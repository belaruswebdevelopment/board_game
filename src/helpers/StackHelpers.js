import {ActionDispatcher} from "../actions/Actions";
import {EndAction} from "./ActionHelper";

/**
 * <h3>Добавляет действия в стэк действий конкретного игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости добавить действия в стэк действий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param stack Стэк действий.
 * @returns {*} Старт действий.
 * @constructor
 */
export const AddActionsToStack = (G, ctx, stack) => {
    if (stack.length) {
        for (let i = stack.length - 1; i >= 0; i--) {
            const playerId = stack[i]["playerId"] ?? ctx.currentPlayer;
            G.stack[playerId].unshift(stack[i]);
        }
    }
};

/**
 * <h3>Добавляет действия в стэк действий конкретного игрока после текущего.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости добавить действия в стэк действий после текущего.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param stack Стэк действий.
 * @returns {*} Старт действий.
 * @constructor
 */
export const AddActionsToStackAfterCurrent = (G, ctx, stack) => {
    if (stack.length) {
        let noCurrent = false;
        for (let i = stack.length - 1; i >= 0; i--) {
            const playerId = stack[i]["playerId"] ?? ctx.currentPlayer;
            if (i === stack.length - 1 && G.stack[playerId][0] === undefined) {
                G.stack[playerId].push(stack[i]);
                noCurrent = true;
            } else if (!noCurrent) {
                G.stack[playerId].splice(1, 0, stack[i]);
            } else if (noCurrent) {
                G.stack[playerId].unshift(stack[i]);
            }
        }
    }
};

/**
 * <h3>Начинает действия из стэка действий конкретного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости активировать действия в стэке действий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @param args Дополнительные аргументы.
 * @returns {*} Выполнение действий.
 * @constructor
 */
export const StartActionFromStackOrEndActions = (G, ctx, isTrading = null, ...args) => {
    if (G.stack[ctx.currentPlayer][0]) {
        return ActionDispatcher(G, ctx, G.stack[ctx.currentPlayer][0], ...args);
    } else {
        EndAction(G, ctx, isTrading);
    }
};

/**
 * <h3>Завершает действие из стэка действий конкретного игрока и добавляет новое по необходимости.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости завершить действие в стэке действий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param newStack Новый стэк.
 * @param args Дополнительные аргументы.
 * @returns {*} Выполнение действий.
 * @constructor
 */
export const EndActionFromStackAndAddNew = (G, ctx, newStack = [], ...args) => {
    if (G.stack[ctx.currentPlayer][0].config?.name === "explorerDistinction" ||
        G.stack[ctx.currentPlayer][0].actionName !== "DrawProfitAction") {
        G.actionsNum = null;
        G.drawProfit = null;
    }
    if (ctx.activePlayers?.[ctx.currentPlayer]) {
        ctx.events.endStage();
    }
    const isTrading = G.stack[ctx.currentPlayer][0].config?.isTrading ?? null;
    G.stack[ctx.currentPlayer].shift();
    AddActionsToStack(G, ctx, newStack);
    return StartActionFromStackOrEndActions(G, ctx, isTrading, ...args);
};
