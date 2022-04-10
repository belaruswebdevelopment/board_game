import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames } from "../typescript/enums";
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
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (!player.stack.length && !player.actionsNum) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    }
};
export const CheckGetMjollnirProfitOrder = (G) => {
    const mjollnirPlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${BuffNames.GetMjollnirProfit}'.`);
    }
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};
export const OnGetMjollnirProfitMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
export const OnGetMjollnirProfitTurnBegin = (G, ctx) => {
    AddGetMjollnirProfitActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};
export const StartEndGame = (G, ctx) => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
//# sourceMappingURL=GetMjollnirProfitHooks.js.map