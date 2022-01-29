import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame } from "../helpers/GameHooksHelpers";
/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckEndGetMjollnirProfitPhase = (G) => {
    if (G.publicPlayersOrder.length) {
        return G.suitIdForMjollnir !== null;
    }
};
export const CheckGetMjollnirProfitOrder = (G) => {
    const mjollnirPlayerIndex = G.publicPlayers.findIndex((player) => player.buffs.getMjollnirProfit === true);
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};
export const OnGetMjollnirProfitTurnBegin = (G, ctx) => {
    var _a;
    AddGetMjollnirProfitActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx, (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) === null || _a === void 0 ? void 0 : _a.config);
};
export const StartEndGame = (G, ctx) => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
//# sourceMappingURL=GetMjollnirProfitHooks.js.map