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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (G.publicPlayersOrder.length && !player.stack.length) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const CheckGetMjollnirProfitOrder = (G) => {
    const mjollnirPlayerIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
    }
    else {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.GetMjollnirProfit}.`);
    }
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