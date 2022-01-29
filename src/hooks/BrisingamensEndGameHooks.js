import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { Phases } from "../typescript/enums";
export const CheckBrisingamensEndGameOrder = (G) => {
    const brisingamensPlayerIndex = G.publicPlayers.findIndex((player) => player.buffs.discardCardEndGame === true);
    G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
};
export const EndBrisingamensEndGameActions = (G) => {
    G.publicPlayersOrder = [];
};
export const OnBrisingamensEndGameTurnBegin = (G, ctx) => {
    var _a;
    AddBrisingamensEndGameActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx, (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) === null || _a === void 0 ? void 0 : _a.config);
};
/**
 * <h3>Начинает фазу 'getMjollnirProfit' или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 * @param G
 * @param ctx
 * @returns
 */
export const StartGetMjollnirProfitOrEndGame = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame === undefined) {
            const buffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.getMjollnirProfit));
            if (buffIndex !== -1) {
                return {
                    next: Phases.GetMjollnirProfit,
                };
            }
            else {
                return true;
            }
        }
    }
};
//# sourceMappingURL=BrisingamensEndGameHooks.js.map