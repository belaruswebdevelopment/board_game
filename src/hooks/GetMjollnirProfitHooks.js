import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
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
export const CheckEndGetMjollnirProfitPhase = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (G.publicPlayersOrder.length && !player.stack.length) {
        return player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined) !== undefined;
    }
};
export const CheckGetMjollnirProfitOrder = (G) => {
    const mjollnirPlayerIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.getMjollnirProfit !== undefined)));
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