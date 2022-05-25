import type { Ctx } from "boardgame.io";
import { IsMercenaryCampCard } from "../Camp";
import { AddDataToLog } from "../Logging";
import { BuffNames, HeroNames, LogTypes, Phases } from "../typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, DeckCardTypes, IMyGameState, INext, IPublicPlayer, PlayerCardTypes } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { CheckPickHero } from "./HeroHelpers";

/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const AfterLastTavernEmptyActions = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    const deck: CanBeUndef<DeckCardTypes[]> = G.secret.decks[G.secret.decks.length - G.tierToEnd];
    if (deck === undefined) {
        throw new Error(`Отсутствует колода карт текущей эпохи '${G.secret.decks.length - G.tierToEnd}'.`);
    }
    if (deck.length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
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
 * @returns
 */
export const CheckAndStartPlaceCoinsUlineOrPickCardsPhase = (G: IMyGameState): INext => {
    const ulinePlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if (!G.solo && ulinePlayerIndex !== -1) {
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
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения действий в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckEndGameLastActions = (G: IMyGameState): boolean | INext => {
    const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[0],
        deck2: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
    if (deck1 === undefined) {
        throw new Error(`Отсутствует колода карт '1' эпохи.`);
    }
    if (deck2 === undefined) {
        throw new Error(`Отсутствует колода карт '2' эпохи.`);
    }
    if (!deck1.length && deck2.length) {
        return {
            next: Phases.GetDistinctions,
        };
    } else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensBuffIndex !== -1) {
                return {
                    next: Phases.BrisingamensEndGame,
                };
            }
            const mjollnirBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
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
* @returns
*/
export const CheckEndTierActionsOrEndGameLastActions = (G: IMyGameState): boolean | INext => {
    const yludIndex: number = Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EndTier));
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
 * @returns
 */
const CheckEnlistmentMercenaries = (G: IMyGameState, ctx: Ctx): boolean | INext => {
    let count = false;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        if (player.campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCampCard(card)).length) {
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

/**
 * <h3>Действия очистки выбранной карты игроком при завершении хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в любой фазе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ClearPlayerPickedCard = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = null;
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

/**
 * <h3>Проверяет необходимость завершения хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверке завершения любой фазы.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndTurnActions = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
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
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G: IMyGameState): void => {
    const thrudPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${thrudPlayerIndex}'.`);
        }
        const playerCards: PlayerCardTypes[] = Object.values(player.cards).flat(),
            thrud: CanBeUndef<PlayerCardTypes> =
                playerCards.find((card: PlayerCardTypes): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number =
                player.cards[thrud.suit].findIndex((card: PlayerCardTypes): boolean =>
                    card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
        }
    }
};

/**
 * <h3>Действия старта или завершения действий при завершении мува в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в любой фазе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartOrEndActions = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${ctx.currentPlayer}'.`);
    }
    // TODO Why i need it?!
    if (player.actionsNum) {
        player.actionsNum--;
    }
    if (ctx.activePlayers === null || ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        player.stack.shift();
        CheckPickHero(G, ctx);
        DrawCurrentProfit(G, ctx);
    }
};
