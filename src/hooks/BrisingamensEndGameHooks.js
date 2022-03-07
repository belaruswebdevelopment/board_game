import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames, Phases } from "../typescript/enums";
export const CheckBrisingamensEndGameOrder = (G) => {
    const brisingamensPlayerIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
    }
    else {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.DiscardCardEndGame}.`);
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (G.publicPlayersOrder.length && !player.stack.length) {
            const firstPlayer = G.publicPlayers[Number(G.publicPlayersOrder[0])];
            if (firstPlayer !== undefined) {
                if (!CheckPlayerHasBuff(firstPlayer, BuffNames.EveryTurn)) {
                    const buffIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
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
            else {
                throw new Error(`В массиве игроков отсутствует игрок с первым ходом.`);
            }
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
//# sourceMappingURL=BrisingamensEndGameHooks.js.map