import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { RefillCamp } from "../helpers/CampHelpers";
import { ClearPlayerPickedCard, EndTurnActions, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckDistinction } from "../TroopEvaluation";
import { ErrorNames, SuitNames } from "../typescript/enums";
import type { CanBeUndef, DeckCardTypes, DistinctionTypes, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет порядок получения преимуществ при начале фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckAndResolveTroopEvaluationOrders = (G: IMyGameState, ctx: Ctx): void => {
    CheckDistinction(G, ctx);
    const distinctions: DistinctionTypes[] =
        Object.values(G.distinctions).filter((distinction: DistinctionTypes): boolean =>
            distinction !== null && distinction !== undefined);
    if (distinctions.every((distinction: DistinctionTypes): boolean =>
        distinction !== null && distinction !== undefined)) {
        G.publicPlayersOrder = distinctions as string[];
    }
};

/**
 * <h3>Проверяет необходимость завершения фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом получении преимуществ в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndTroopEvaluationPhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            return Object.values(G.distinctions).every((distinction: DistinctionTypes): boolean =>
                distinction === undefined);
        }
    }

};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndTroopEvaluationTurn = (G: IMyGameState, ctx: Ctx): true | void => EndTurnActions(G, ctx);

/**
 * <h3>Действия при завершении фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 */
export const EndTroopEvaluationPhaseActions = (G: IMyGameState): void => {
    if (G.expansions.thingvellir.active) {
        RefillCamp(G);
    }
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnTroopEvaluationMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

/**
 * <h3>Действия при начале хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnTroopEvaluationTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStack(G, ctx, [StackData.getDistinctions()]);
    if (G.distinctions[SuitNames.Explorer] === ctx.currentPlayer && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        for (let j = 0; j < 3; j++) {
            const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
            if (deck1 === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
            }
            const card: CanBeUndef<DeckCardTypes> = deck1[j];
            if (card === undefined) {
                throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
            }
            G.explorerDistinctionCards.push(card);
        }
    }
};

/**
 * <h3>Действия при завершении хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnTroopEvaluationTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
    if (G.explorerDistinctionCardId !== null && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        const deck1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
        if (deck1 === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
        }
        deck1.splice(G.explorerDistinctionCardId, 1);
        G.deckLength[1] = deck1.length;
        G.secret.decks[1] = ctx.random!.Shuffle(deck1);
        G.explorerDistinctionCardId = null;
    }
};
