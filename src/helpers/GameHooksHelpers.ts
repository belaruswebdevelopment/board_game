import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CheckIfCurrentTavernEmpty } from "../Tavern";
import { BuffNames, ErrorNames, GameModeNames, HeroNames, LogTypeNames, PhaseNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, DeckCardType, IMyGameState, IPublicPlayer, PlayerCardType } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { CheckPickHero } from "./HeroHelpers";
import { IsMercenaryCampCard } from "./IsCampTypeHelpers";

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
const AfterLastTavernEmptyActions = (G: IMyGameState, ctx: Ctx): CanBeVoidType<PhaseNames> => {
    const isLastRound: boolean = ctx.numPlayers < 4 ? ((G.round === 3 || G.round === 6) ? true : false) :
        ((G.round === 2 || G.round === 5) ? true : false),
        currentDeck: CanBeUndefType<DeckCardType[]> =
            G.secret.decks[G.secret.decks.length - G.tierToEnd - Number(isLastRound)];
    if (currentDeck === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTierDeckIsUndefined);
    }
    if (currentDeck.length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
        } else {
            return StartEndTierPhaseOrEndGameLastActions(G);
        }
    } else {
        return PhaseNames.Bids;
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const StartGetMjollnirProfitPhase = (G: IMyGameState): CanBeVoidType<PhaseNames> => {
    const buffIndex: number =
        Object.values(G.publicPlayers).findIndex((playerB: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(playerB, BuffNames.GetMjollnirProfit));
    if (buffIndex !== -1) {
        return PhaseNames.GetMjollnirProfit;
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @returns Следующая фаза игры.
 */
export const StartBidUlineOrTavernsResolutionPhase = (G: IMyGameState): PhaseNames => {
    const ulinePlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ulinePlayerIndex !== -1) {
        return PhaseNames.BidUline;
    } else {
        return PhaseNames.TavernsResolution;
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн' или фазы 'EndTier' или фазы конца игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн' или фаза 'EndTier' или фазы конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase = (G: IMyGameState, ctx: Ctx):
    CanBeVoidType<PhaseNames> => {
    const isLastTavern: boolean = G.tavernsNum - 1 === G.currentTavern && CheckIfCurrentTavernEmpty(G);
    if (isLastTavern) {
        return AfterLastTavernEmptyActions(G, ctx);
    } else {
        return StartBidUlineOrTavernsResolutionPhase(G);
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
 * @returns Название новой фазы игры.
 */
export const StartEndGameLastActions = (G: IMyGameState): CanBeVoidType<PhaseNames> => {
    if (!G.secret.decks[0].length && G.secret.decks[1].length) {
        return PhaseNames.TroopEvaluation;
    } else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensBuffIndex !== -1) {
                return PhaseNames.BrisingamensEndGame;
            }
            const mjollnirBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
            if (mjollnirBuffIndex !== -1) {
                return PhaseNames.GetMjollnirProfit;
            }
        }
    }
};

/**
* <h3>Проверка начала фазы 'Поместить Труд' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
* @returns
*/
export const StartEndTierPhaseOrEndGameLastActions = (G: IMyGameState): CanBeVoidType<PhaseNames> => {
    const yludIndex: number = Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex !== -1) {
        return PhaseNames.PlaceYlud;
    } else {
        return StartEndGameLastActions(G);
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
const CheckEnlistmentMercenaries = (G: IMyGameState, ctx: Ctx): CanBeVoidType<PhaseNames> => {
    let count = false;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (player.campCards.filter(IsMercenaryCampCard).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return PhaseNames.EnlistmentMercenaries;
    } else {
        return StartEndTierPhaseOrEndGameLastActions(G);
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
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
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
export const EndTurnActions = (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
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
    const thrudPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                thrudPlayerIndex);
        }
        const playerCards: PlayerCardType[] = Object.values(player.cards).flat(),
            thrud: CanBeUndefType<PlayerCardType> =
                playerCards.find((card: PlayerCardType): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number =
                player.cards[thrud.suit].findIndex((card: PlayerCardType): boolean =>
                    card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypeNames.Game, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
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
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.activePlayers === null || ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        player.stack.shift();
        if ((player.stack[0]?.priority === undefined)
            || (player.stack[0]?.priority !== undefined && player.stack[0]?.priority > 1)) {
            CheckPickHero(G, ctx);
        }
        DrawCurrentProfit(G, ctx);
    }
};
