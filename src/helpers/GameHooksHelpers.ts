import { Ctx } from "boardgame.io";
import { IsMercenaryCard } from "../Camp";
import { isCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { HeroNames, LogTypes, Phases, Stages } from "../typescript/enums";
import { CampDeckCardTypes, CoinType, IBuffs, IMyGameState, INext, IPublicPlayer, PlayerCardsType } from "../typescript/interfaces";
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
export const AfterLastTavernEmptyActions = (G: IMyGameState): boolean | INext => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G);
        } else {
            return CheckEndTierActionsOrEndGameLastActions(G);
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
    const ulinePlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        Boolean(player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)));
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        ulinePlayerIndex: number = G.publicPlayers.findIndex((findPlayer: IPublicPlayer): boolean =>
            Boolean(findPlayer.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)));
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin: CoinType = player.boardCoins[G.currentTavern];
            if (coin?.isTriggerTrading) {
                const tradingCoinPlacesLength: number =
                    player.boardCoins.filter((coin: CoinType, index: number): boolean =>
                        index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== Stages.PlaceTradingCoinsUline
                        && tradingCoinPlacesLength === 2) {
                        const handCoinsLength: number =
                            player.handCoins.filter((coin: CoinType): boolean => isCoin(coin)).length;
                        player.actionsNum =
                            G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
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
 * <li>После завершения действий в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 */
export const CheckEndGameLastActions = (G: IMyGameState): boolean | INext => {
    if (!G.decks[0].length && G.decks[1].length) {
        return {
            next: Phases.GetDistinctions,
        };
    } else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex: number =
                G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                    Boolean(player.buffs.find((buff: IBuffs): boolean =>
                        buff.discardCardEndGame !== undefined)));
            if (brisingamensBuffIndex !== -1) {
                return {
                    next: Phases.BrisingamensEndGame,
                };
            }
            const mjollnirBuffIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                Boolean(player.buffs.find((buff: IBuffs): boolean =>
                    buff.getMjollnirProfit !== undefined)));
            if (mjollnirBuffIndex !== -1) {
                return {
                    next: Phases.GetMjollnirProfit,
                };
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
export const CheckEndTierActionsOrEndGameLastActions = (G: IMyGameState): boolean | INext => {
    const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        Boolean(player.buffs.find((buff: IBuffs): boolean => buff.endTier !== undefined)));
    if (yludIndex !== -1) {
        return {
            next: Phases.EndTier,
        };
    } else {
        return CheckEndGameLastActions(G);
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
const CheckEnlistmentMercenaries = (G: IMyGameState): boolean | INext => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCard(card)).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return {
            next: Phases.EnlistmentMercenaries,
        };
    } else {
        return CheckEndTierActionsOrEndGameLastActions(G);
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (!player.stack.length && !player.actionsNum) {
        return true;
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
        const player: IPublicPlayer = G.publicPlayers[i],
            playerCards: PlayerCardsType[] = Object.values(player.cards).flat(),
            thrud: PlayerCardsType | undefined =
                playerCards.find((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number =
                player.cards[thrud.suit].findIndex((card: PlayerCardsType): boolean =>
                    card.name === HeroNames.Thrud);
            if (thrudIndex !== undefined) {
                player.cards[thrud.suit].splice(thrudIndex, 1);
                AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${player.nickname} уходит с игрового поля.`);
            } else {
                // TODO Error!
            }
        }
    }
};

export const StartOrEndActions = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player.actionsNum) {
        player.actionsNum--;
    }
    if (ctx.activePlayers === null
        || ctx.activePlayers !== null && ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        player.stack.shift();
        DrawCurrentProfit(G, ctx);
    }
};
