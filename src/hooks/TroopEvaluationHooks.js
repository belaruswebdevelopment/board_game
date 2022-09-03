import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { RefillCamp } from "../helpers/CampHelpers";
import { ClearPlayerPickedCard, EndTurnActions, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckDistinction } from "../TroopEvaluation";
import { ErrorNames, GameModeNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Определяет порядок получения преимуществ при начале фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckAndResolveTroopEvaluationOrders = (G, ctx) => {
    CheckDistinction(G, ctx);
    const distinctions = Object.values(G.distinctions).filter((distinction) => distinction !== null && distinction !== undefined);
    if (distinctions.every((distinction) => distinction !== null && distinction !== undefined)) {
        G.publicPlayersOrder = distinctions;
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
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndTroopEvaluationPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            return Object.values(G.distinctions).every((distinction) => distinction === undefined);
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
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndTroopEvaluationTurn = (G, ctx) => EndTurnActions(G, ctx);
/**
 * <h3>Действия при завершении фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const EndTroopEvaluationPhaseActions = (G) => {
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
 * @returns
 */
export const OnTroopEvaluationMove = (G, ctx) => {
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
 * @returns
 */
export const OnTroopEvaluationTurnBegin = (G, ctx) => {
    AddActionsToStack(G, ctx, [StackData.getDistinctions()]);
    if (G.distinctions[SuitNames.explorer] === ctx.currentPlayer && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        let length;
        if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            length = 1;
        }
        else {
            length = 3;
        }
        const explorerDistinctionCards = [];
        for (let j = 0; j < length; j++) {
            const card = G.secret.decks[1][j];
            if (card === undefined) {
                throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
            }
            explorerDistinctionCards.push(card);
        }
        G.explorerDistinctionCards = explorerDistinctionCards;
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
 * @returns
 */
export const OnTroopEvaluationTurnEnd = (G, ctx) => {
    ClearPlayerPickedCard(G, ctx);
    if (G.explorerDistinctionCardId !== null && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        G.secret.decks[1].splice(G.explorerDistinctionCardId, 1);
        G.deckLength[1] = G.secret.decks[1].length;
        G.secret.decks[1] = ctx.random.Shuffle(G.secret.decks[1]);
        G.explorerDistinctionCardId = null;
    }
};
//# sourceMappingURL=TroopEvaluationHooks.js.map