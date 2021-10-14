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
            const playerId = stack[i]["playerId"]!== undefined ? stack[i]["playerId"] : ctx.currentPlayer;
            G.publicPlayers[playerId].stack.unshift(stack[i]);
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
            const playerId = stack[i]["playerId"] !== undefined ? stack[i]["playerId"] : ctx.currentPlayer;
            if (i === stack.length - 1 && G.publicPlayers[playerId].stack[0] === undefined) {
                G.publicPlayers[playerId].stack.push(stack[i]);
                noCurrent = true;
            } else if (!noCurrent) {
                G.publicPlayers[playerId].stack.splice(1, 0, stack[i]);
            } else if (noCurrent) {
                G.publicPlayers[playerId].stack.unshift(stack[i]);
            }
        }
    }
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
 * @returns {*} Выполнение действий.
 * @constructor
 */
export const StartActionFromStackOrEndActions = (G, ctx, isTrading = null, ...args) => {
    if (G.publicPlayers[ctx.currentPlayer].stack[0]) {
        return ActionDispatcher(G, ctx, G.publicPlayers[ctx.currentPlayer].stack[0], ...args);
    } else {
        EndAction(G, ctx, isTrading);
    }
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
 * @returns {*} Выполнение действий.
 * @constructor
 */
export const StartActionForChosenPlayer = (G, ctx, playerId, ...args) => {
    return ActionDispatcher(G, ctx, G.publicPlayers[playerId].stack[0], ...args);
};

/**
 * <h3>Завершает действие из стэка действий указанного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости завершить действие в стэке действий указанного игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @constructor
 */
export const EndActionForChosenPlayer = (G, ctx, playerId) => {
    G.publicPlayers[playerId].stack = [];
    ctx.events.endStage();
    let activePlayers = 0;
    for (const activePlayersKey in ctx.activePlayers) {
        activePlayers++;
    }
    if (activePlayers === 1) {
        return EndActionFromStackAndAddNew(G, ctx);
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
    if ((G.publicPlayers[ctx.currentPlayer].stack[0].config && G.publicPlayers[ctx.currentPlayer].stack[0].config.name) === "explorerDistinction" ||
        G.publicPlayers[ctx.currentPlayer].stack[0].actionName !== "DrawProfitAction") {
        G.actionsNum = null;
        G.drawProfit = null;
    }
    if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) {
        ctx.events.endStage();
    }
    const isTrading = (G.publicPlayers[ctx.currentPlayer].stack[0].config &&
        G.publicPlayers[ctx.currentPlayer].stack[0].config.isTrading) ? G.publicPlayers[ctx.currentPlayer].stack[0].config.isTrading : null;
    G.publicPlayers[ctx.currentPlayer].stack.shift();
    AddActionsToStack(G, ctx, newStack);
    return StartActionFromStackOrEndActions(G, ctx, isTrading, ...args);
};
