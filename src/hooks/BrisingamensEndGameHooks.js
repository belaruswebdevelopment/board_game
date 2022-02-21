import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { Phases } from "../typescript/enums";
export const CheckBrisingamensEndGameOrder = (G) => {
    const brisingamensPlayerIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.discardCardEndGame !== undefined)));
    if (brisingamensPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
    }
    else {
        // TODO Error!
    }
};
export const EndBrisingamensEndGameActions = (G) => {
    G.publicPlayersOrder = [];
};
export const OnBrisingamensEndGameMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
export const OnBrisingamensEndGameTurnBegin = (G, ctx) => {
    AddBrisingamensEndGameActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
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
    if (G.publicPlayersOrder.length && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        if (G.publicPlayers[Number(G.publicPlayersOrder[0])].buffs.find((buff) => buff.discardCardEndGame !== undefined) === undefined) {
            const buffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.getMjollnirProfit !== undefined)));
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