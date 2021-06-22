import {ActionDispatcher} from "../actions/Actions";
import {EndAction} from "./ActionHelper";

/**
 * Добавляет действия в стэк действий конкретного игрока.
 * Применения:
 * 1) Выполняется при необходимости добавить действия в стэк действий.
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
 * Добавляет действия в стэк действий конкретного игрока после текущего.
 * Применения:
 * 1) Выполняется при необходимости добавить действия в стэк действий после текущего.
 *
 * @param G
 * @param ctx
 * @param stack Стэк действий.
 * @returns {*} Старт действий.
 * @constructor
 */
export const AddActionsToStackAfterCurrent = (G, ctx, stack) => {
    if (stack.length) {
        for (let i = stack.length - 1; i >= 0; i--) {
            const playerId = stack[i]["playerId"] ?? ctx.currentPlayer;
            if (i === stack.length - 1 && !G.stack[playerId][0]) {
                G.stack[playerId].unshift(stack[i]);
            } else {
                G.stack[playerId].splice(1, 0, stack[i]);
            }
        }
    }
};

/**
 * Начинает действия из стэка действий конкретного игрока.
 * Применения:
 * 1) Выполняется при необходимости активировать действия в стэке действий.
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
        return ActionDispatcher(G, ctx, G.stack[ctx.currentPlayer][0].stack, ...args);
    } else {
        EndAction(G, ctx, isTrading);
    }
};

/**
 * Завершает действие из стэка действий конкретного игрока и добавляет новое по необходимости.
 * Применения:
 * 1) Выполняется при необходимости завершить действие в стэке действий.
 *
 * @param G
 * @param ctx
 * @param newStack Новый стэк.
 * @param args Дополнительные аргументы.
 * @returns {*} Выполнение действий.
 * @constructor
 */
export const EndActionFromStackAndAddNew = (G, ctx, newStack = [], ...args) => {
    if (ctx.activePlayers?.[ctx.currentPlayer]) {
        ctx.events.endStage();
    }
    const isTrading = G.stack[ctx.currentPlayer][0].stack.config.isTrading ?? null;
    G.stack[ctx.currentPlayer].shift();
    AddActionsToStack(G, ctx, newStack);
    return StartActionFromStackOrEndActions(G, ctx, isTrading, ...args);
};
