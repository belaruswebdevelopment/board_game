import { Ctx } from "boardgame.io";
import { IConfig, IStack } from "../typescript/action_interfaces";
import { ConfigNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { ArgsTypes } from "../typescript/types";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";

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
export const AddActionsToStack = (G: IMyGameState, ctx: Ctx, stack: IStack[]): void => {
    if (stack.length) {
        for (let i: number = stack.length - 1; i >= 0; i--) {
            const playerId: number = stack[i].playerId ?? Number(ctx.currentPlayer);
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
export const AddActionsToStackAfterCurrent = (G: IMyGameState, ctx: Ctx, stack: IStack[]): void => {
    if (stack.length) {
        let noCurrent = false;
        for (let i: number = stack.length - 1; i >= 0; i--) {
            const playerId: number = stack[i].playerId ?? Number(ctx.currentPlayer);
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
export const EndActionForChosenPlayer = (G: IMyGameState, ctx: Ctx, playerId: number): void => {
    G.publicPlayers[playerId].stack = [];
    let activePlayers = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export const EndActionFromStackAndAddNew = (G: IMyGameState, ctx: Ctx, newStack: IStack[] = [], ...args: ArgsTypes):
    void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (G.drawProfit !== `` || config?.name === ConfigNames.ExplorerDistinction) {
        G.actionsNum = 0;
        G.drawProfit = ``;
    }
    if (ctx.activePlayers !== null && ctx.activePlayers[ctx.currentPlayer]) {
        ctx.events?.endStage();
    }
    const isTrading: boolean = config?.isTrading ?? false;
    G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
    AddActionsToStack(G, ctx, newStack);
    StartActionFromStackOrEndActions(G, ctx, isTrading, ...args);
};
