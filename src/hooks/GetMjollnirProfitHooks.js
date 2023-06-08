import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertPlayerId } from "../is_helpers/AssertionTypeHelpers";
import { CampBuffNames, CommonBuffNames, ErrorNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndGetMjollnirProfitPhase = ({ G, ctx, ...rest }) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
        }
        if (!player.stack.length) {
            return CheckPlayerHasBuff({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, CommonBuffNames.SuitIdForMjollnir);
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
 * @param context
 * @returns
 */
export const CheckGetMjollnirProfitOrder = ({ G, ctx, ...rest }) => {
    const mjollnirPlayerIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, CampBuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${CampBuffNames.GetMjollnirProfit}'.`);
    }
    const mjollnirPlayerId = String(mjollnirPlayerIndex);
    AssertPlayerId(mjollnirPlayerId);
    G.publicPlayersOrder.push(String(mjollnirPlayerId));
};
/**
 * <h3>Действия при завершении мува в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnGetMjollnirProfitMove = ({ G, ctx, ...rest }) => {
    StartOrEndActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
};
/**
 * <h3>Действия при начале хода в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnGetMjollnirProfitTurnBegin = ({ G, ctx, events, ...rest }) => {
    AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [AllStackData.getMjollnirProfit()]);
    DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
};
/**
 * <h3>Действия завершения игры при завершении фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const StartEndGame = ({ G, events }) => {
    G.publicPlayersOrder = [];
    events.endGame();
};
//# sourceMappingURL=GetMjollnirProfitHooks.js.map