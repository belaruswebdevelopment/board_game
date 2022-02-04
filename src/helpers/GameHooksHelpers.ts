import { Ctx } from "boardgame.io";
import { AddDataToLog } from "../Logging";
import { CampDeckCardTypes, PlayerCardsType } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { HeroNames, LogTypes, Phases, RusCardTypes, Stages } from "../typescript/enums";
import { IMyGameState, INext } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";

/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 * @param ctx
 */
export const AfterLastTavernEmptyActions = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
        } else {
            return CheckEndTierActionsOrEndGameLastActions(G, ctx);
        }
    } else {
        return {
            next: Phases.PlaceCoins,
        };
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'placeCoinsUline' или фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'placeCoinsUline' или фаза 'pickCards'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckAndStartPlaceCoinsUlineOrPickCardsPhase = (G: IMyGameState): INext => {
    const ulinePlayerIndex: number = G.publicPlayers
        .findIndex((player: IPublicPlayer): boolean => player.buffs.everyTurn === HeroNames.Uline);
    if (ulinePlayerIndex !== -1) {
        return {
            next: Phases.PlaceCoinsUline,
        };
    } else {
        return {
            next: Phases.PickCards,
        };
    }
};

/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckAndStartUlineActionsOrContinue = (G: IMyGameState, ctx: Ctx): void => {
    const ulinePlayerIndex: number =
        G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.everyTurn === HeroNames.Uline);
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin: CoinType = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
            if (coin?.isTriggerTrading) {
                const tradingCoinPlacesLength: number =
                    G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                        .filter((coin: CoinType, index: number): boolean =>
                            index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== Stages.PlaceTradingCoinsUline
                        && tradingCoinPlacesLength === 2) {
                        const handCoinsLength: number = G.publicPlayers[Number(ctx.currentPlayer)]
                            .handCoins.filter((coin: CoinType): boolean => coin !== null).length;
                        G.actionsNum = G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum :
                            handCoinsLength;
                    }
                }
            }
        }
    }
};

/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndGameLastActions = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    if (!G.decks[0].length && G.decks[1].length) {
        return {
            next: Phases.GetDistinctions,
        };
    } else {
        let buffIndex: number;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
                buffIndex = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                    Boolean(player.buffs.discardCardEndGame));
                if (buffIndex !== -1) {
                    return {
                        next: Phases.BrisingamensEndGame,
                    };
                }
            } else if (ctx.phase !== Phases.GetMjollnirProfit) {
                buffIndex = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                    Boolean(player.buffs.getMjollnirProfit));
                if (buffIndex !== -1) {
                    return {
                        next: Phases.GetMjollnirProfit,
                    };
                }
            }
        }
        return true;
    }
};

/**
* <h3>Проверка начала фазы 'endTier' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
* @param ctx
*/
export const CheckEndTierActionsOrEndGameLastActions = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        player.buffs.endTier === HeroNames.Ylud);
    if (yludIndex !== -1) {
        return {
            next: Phases.EndTier,
        };
    } else {
        return CheckEndGameLastActions(G, ctx);
    }
};

/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
const CheckEnlistmentMercenaries = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return {
            next: Phases.EnlistmentMercenaries,
        };
    } else {
        return CheckEndTierActionsOrEndGameLastActions(G, ctx);
    }
};

export const ClearPlayerPickedCard = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
};

/**
 * <h3>Завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фаз конца игры.</li>
 * </ol>
 *
 * @param ctx
 */
export const EndGame = (ctx: Ctx): void => {
    ctx.events?.endGame();
};

export const EndTurnActions = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        if (!G.actionsNum) {
            return true;
        }
    }
};

/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G: IMyGameState, ctx: Ctx): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerCards: PlayerCardsType[] = Object.values(G.publicPlayers[i].cards).flat();
        const thrud: PlayerCardsType | undefined =
            playerCards.find((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number = G.publicPlayers[i].cards[thrud.suit]
                .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
            G.publicPlayers[i].cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${G.publicPlayers[i].nickname} уходит с игрового поля.`);
        }
    }
};

export const StartOrEndActions = (G: IMyGameState, ctx: Ctx): void => {
    if (G.actionsNum) {
        G.actionsNum--;
    }
    if (ctx.activePlayers === null
        || ctx.activePlayers !== null && ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
        DrawCurrentProfit(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config);
    }
};
