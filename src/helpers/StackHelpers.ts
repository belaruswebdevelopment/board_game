import { Ctx } from "boardgame.io";
import { IStack } from "../typescript/action_interfaces";
import { IMyGameState } from "../typescript/game_data_interfaces";

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
export const AddActionsToStackAfterCurrent = (G: IMyGameState, ctx: Ctx, stack?: IStack[]): void => {
    if (stack) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const activePlayersKey in ctx.activePlayers) {
        activePlayers++;
    }
    if (activePlayers === 1) {
        // TODO Check: G.publicPlayers[Number(ctx.currentPlayer)].stack = [];
        G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
    }
};
