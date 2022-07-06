import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndGetMjollnirProfitPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (!player.stack.length && !player.actionsNum) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    }
};
/**
 * <h3>Проверяет порядок хода при начале фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckGetMjollnirProfitOrder = (G) => {
    const mjollnirPlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${BuffNames.GetMjollnirProfit}'.`);
    }
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};
/**
 * <h3>Действия при завершении мува в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnGetMjollnirProfitMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
/**
 * <h3>Действия при начале хода в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnGetMjollnirProfitTurnBegin = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getMjollnirProfit()]);
    DrawCurrentProfit(G, ctx);
};
/**
 * <h3>Действия завершения игры при завершении фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartEndGame = (G, ctx) => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
//# sourceMappingURL=GetMjollnirProfitHooks.js.map