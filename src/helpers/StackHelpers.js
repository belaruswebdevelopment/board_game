"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.EndActionFromStackAndAddNew = exports.EndActionForChosenPlayer = exports.StartActionForChosenPlayer = exports.StartActionFromStackOrEndActions = exports.AddActionsToStackAfterCurrent = exports.AddActionsToStack = void 0;
var Actions_1 = require("../actions/Actions");
var ActionHelper_1 = require("./ActionHelper");
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
var AddActionsToStack = function (G, ctx, stack) {
    var _a;
    if (stack.length) {
        for (var i = stack.length - 1; i >= 0; i--) {
            var playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
            G.publicPlayers[playerId].stack.unshift(stack[i]);
        }
    }
};
exports.AddActionsToStack = AddActionsToStack;
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
var AddActionsToStackAfterCurrent = function (G, ctx, stack) {
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
exports.AddActionsToStackAfterCurrent = AddActionsToStackAfterCurrent;
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
var StartActionFromStackOrEndActions = function (G, ctx, isTrading) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) {
        Actions_1.ActionDispatcher.apply(void 0, __spreadArray([G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0]], args, false));
    }
    else {
        (0, ActionHelper_1.EndAction)(G, ctx, isTrading);
    }
};
exports.StartActionFromStackOrEndActions = StartActionFromStackOrEndActions;
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
var StartActionForChosenPlayer = function (G, ctx, playerId) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    Actions_1.ActionDispatcher.apply(void 0, __spreadArray([G, ctx, G.publicPlayers[playerId].stack[0]], args, false));
};
exports.StartActionForChosenPlayer = StartActionForChosenPlayer;
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
var EndActionForChosenPlayer = function (G, ctx, playerId) {
    G.publicPlayers[playerId].stack = [];
    ctx.events.endStage();
    var activePlayers = 0;
    for (var activePlayersKey in ctx.activePlayers) {
        activePlayers++;
    }
    if (activePlayers === 1) {
        (0, exports.EndActionFromStackAndAddNew)(G, ctx);
    }
};
exports.EndActionForChosenPlayer = EndActionForChosenPlayer;
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
var EndActionFromStackAndAddNew = function (G, ctx, newStack) {
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
            G.actionsNum = null;
            G.drawProfit = null;
        }
        if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) {
            ctx.events.endStage();
        }
        var isTrading = (_a = config.isTrading) !== null && _a !== void 0 ? _a : false;
        G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
        (0, exports.AddActionsToStack)(G, ctx, newStack);
        exports.StartActionFromStackOrEndActions.apply(void 0, __spreadArray([G, ctx, isTrading], args, false));
    }
};
exports.EndActionFromStackAndAddNew = EndActionFromStackAndAddNew;
