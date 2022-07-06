import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames } from "../typescript/enums";
/**
 * <h3>Проверяет порядок хода при начале фазы 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckBrisingamensEndGameOrder = (G) => {
    const brisingamensPlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.DiscardCardEndGame}'.`);
    }
    G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
};
/**
 * <h3>Начинает фазу 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndBrisingamensEndGamePhase = (G, ctx) => {
    if (G.publicPlayersOrder.length && ctx.playOrder.length === 1 && G.publicPlayersOrder[0] === ctx.playOrder[0]
        && ctx.currentPlayer === ctx.playOrder[0]) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с первым ходом с id '${ctx.currentPlayer}'.`);
        }
        if (!CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame) && !player.stack.length) {
            const buffIndex = Object.values(G.publicPlayers).findIndex((playerB) => CheckPlayerHasBuff(playerB, BuffNames.GetMjollnirProfit));
            if (buffIndex !== -1) {
                return true;
            }
        }
    }
};
/**
 * <h3>Действия при завершении фазы 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 */
export const EndBrisingamensEndGameActions = (G) => {
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при завершении мува в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnBrisingamensEndGameMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
/**
 * <h3>Действия при начале хода в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnBrisingamensEndGameTurnBegin = (G, ctx) => {
    AddActionsToStack(G, ctx, [StackData.brisingamensEndGameAction()]);
    DrawCurrentProfit(G, ctx);
};
//# sourceMappingURL=BrisingamensEndGameHooks.js.map