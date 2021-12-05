var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ActionDispatcher } from "../actions/Actions";
import { EndAction } from "./ActionHelper";
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
export var AddActionsToStack = function (G, ctx, stack) {
    var _a;
    if (stack.length) {
        for (var i = stack.length - 1; i >= 0; i--) {
            var playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
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
export var AddActionsToStackAfterCurrent = function (G, ctx, stack) {
    var _a;
    if (stack.length) {
        var noCurrent = false;
        for (var i = stack.length - 1; i >= 0; i--) {
            var playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
            if (i === stack.length - 1 && G.publicPlayers[playerId].stack[0] === undefined) {
                G.publicPlayers[playerId].stack.push(stack[i]);
                noCurrent = true;
            }
            else if (!noCurrent) {
                G.publicPlayers[playerId].stack.splice(1, 0, stack[i]);
            }
            else if (noCurrent) {
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
export var StartActionFromStackOrEndActions = function (G, ctx, isTrading) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) {
        ActionDispatcher.apply(void 0, __spreadArray([G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0]], args, false));
    }
    else {
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
export var StartActionForChosenPlayer = function (G, ctx, playerId) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    ActionDispatcher.apply(void 0, __spreadArray([G, ctx, G.publicPlayers[playerId].stack[0]], args, false));
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
export var EndActionForChosenPlayer = function (G, ctx, playerId) {
    G.publicPlayers[playerId].stack = [];
    ctx.events.endStage();
    var activePlayers = 0;
    for (var activePlayersKey in ctx.activePlayers) {
        activePlayers++;
    }
    if (activePlayers === 1) {
        EndActionFromStackAndAddNew(G, ctx);
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
export var EndActionFromStackAndAddNew = function (G, ctx, newStack) {
    var _a;
    if (newStack === void 0) { newStack = []; }
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config) {
        if (config.name === "explorerDistinction" || G.publicPlayers[Number(ctx.currentPlayer)].stack[0].actionName
            !== "DrawProfitAction") {
            G.actionsNum = 0;
            G.drawProfit = "";
        }
        if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) {
            ctx.events.endStage();
        }
        var isTrading = (_a = config.isTrading) !== null && _a !== void 0 ? _a : false;
        G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
        AddActionsToStack(G, ctx, newStack);
        StartActionFromStackOrEndActions.apply(void 0, __spreadArray([G, ctx, isTrading], args, false));
    }
};
