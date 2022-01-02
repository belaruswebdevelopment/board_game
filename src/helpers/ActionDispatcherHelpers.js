import { ActionDispatcher } from "../actions/ActionDispatcher";
import { CampActionDispatcher } from "../actions/CampActionDispatcher";
import { CoinActionDispatcher } from "../actions/CoinActionDispatcher";
import { HeroActionDispatcher } from "../actions/HeroActionDispatcher";
import { EndAction } from "./ActionHelpers";
// eslint-disable-next-line @typescript-eslint/ban-types
export const ActionDispatcherSwitcher = (actionTypes) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let actionDispatcher;
    switch (actionTypes) {
        case `Action`:
            actionDispatcher = ActionDispatcher;
            break;
        case `Camp`:
            actionDispatcher = CampActionDispatcher;
            break;
        case `Coin`:
            actionDispatcher = CoinActionDispatcher;
            break;
        case `Hero`:
            actionDispatcher = HeroActionDispatcher;
            break;
        default:
            actionDispatcher = null;
    }
    return actionDispatcher;
};
/**
 * <h3>Начинает действия из стэка действий указанного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости активировать действия в стэке действий указанного игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @param args Дополнительные аргументы.
 */
export const StartActionForChosenPlayer = (G, ctx, playerId, ...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const actionDispatcher = ActionDispatcherSwitcher(G.publicPlayers[playerId].stack[0].action.type);
    actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, G.publicPlayers[playerId].stack[0], ...args);
};
/**
 * <h3>Начинает действия из стэка действий конкретного игрока или завершает действия при их отсутствии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости активировать действия в стэке действий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @param args Дополнительные аргументы.
 */
export const StartActionFromStackOrEndActions = (G, ctx, isTrading, ...args) => {
    if (G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const actionDispatcher = ActionDispatcherSwitcher(G.publicPlayers[Number(ctx.currentPlayer)].stack[0].action.type);
        actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0], ...args);
    }
    else {
        EndAction(G, ctx, isTrading);
    }
};
