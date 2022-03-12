import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames, Phases } from "../typescript/enums";
export const CheckBrisingamensEndGameOrder = (G) => {
    const brisingamensPlayerIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.DiscardCardEndGame}.`);
    }
    G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
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
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с первым ходом.`);
        }
        if (!CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame) && !player.stack.length
            && !player.actionsNum) {
            if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                const buffIndex = G.publicPlayers.findIndex((playerB) => CheckPlayerHasBuff(playerB, BuffNames.GetMjollnirProfit));
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
    }
};
//# sourceMappingURL=BrisingamensEndGameHooks.js.map