import { ActionDispatcher, ConfigNames } from "../actions/Actions";
import { EndAction } from "./ActionHelpers";
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
 */
export const AddActionsToStack = (G, ctx, stack) => {
    var _a;
    if (stack.length) {
        for (let i = stack.length - 1; i >= 0; i--) {
            const playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
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
 */
export const AddActionsToStackAfterCurrent = (G, ctx, stack) => {
    var _a;
    if (stack.length) {
        let noCurrent = false;
        for (let i = stack.length - 1; i >= 0; i--) {
            const playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
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
 * <h3>Завершает действие из стэка действий указанного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости завершить действие в стэке действий указанного игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 */
export const EndActionForChosenPlayer = (G, ctx, playerId) => {
    G.publicPlayers[playerId].stack = [];
    ctx.events.endStage();
    let activePlayers = 0;
    for (const activePlayersKey in ctx.activePlayers) {
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
 * @returns Выполнение действий.
 */
export const EndActionFromStackAndAddNew = (G, ctx, newStack = [], ...args) => {
    var _a;
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (G.drawProfit !== `` || (config === null || config === void 0 ? void 0 : config.name) === ConfigNames.ExplorerDistinction) {
        G.actionsNum = 0;
        G.drawProfit = ``;
    }
    if (ctx.activePlayers !== null && ctx.activePlayers[ctx.currentPlayer]) {
        ctx.events.endStage();
    }
    const isTrading = (_a = config === null || config === void 0 ? void 0 : config.isTrading) !== null && _a !== void 0 ? _a : false;
    G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
    AddActionsToStack(G, ctx, newStack);
    StartActionFromStackOrEndActions(G, ctx, isTrading, ...args);
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
    ActionDispatcher(G, ctx, G.publicPlayers[playerId].stack[0], ...args);
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
        ActionDispatcher(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0], ...args);
    }
    else {
        EndAction(G, ctx, isTrading);
    }
};
