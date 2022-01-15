import { Ctx } from "boardgame.io";
import { ActionDispatcher } from "../actions/ActionDispatcher";
import { CampActionDispatcher } from "../actions/CampActionDispatcher";
import { CoinActionDispatcher } from "../actions/CoinActionDispatcher";
import { HeroActionDispatcher } from "../actions/HeroActionDispatcher";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { ArgsTypes } from "../typescript/types";

/**
 * <h3>Диспетчер всех экшенов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при вызове каждого экшена.</li>
 * </ol>
 *
 * @param actionTypes Тип экшена.
 * @returns Диспетчер экшенов.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const ActionDispatcherSwitcher = (actionTypes: string): Function | null => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let actionDispatcher: Function | null;
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
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
const EndAction = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
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
export const StartActionForChosenPlayer = (G: IMyGameState, ctx: Ctx, playerId: number, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const actionDispatcher: Function | null =
        ActionDispatcherSwitcher(G.publicPlayers[playerId].stack[0].action.type);
    actionDispatcher?.(G, ctx, G.publicPlayers[playerId].stack[0], ...args);
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
export const StartActionFromStackOrEndActions = (G: IMyGameState, ctx: Ctx, isTrading: boolean, ...args: ArgsTypes):
    void => {
    if (G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const actionDispatcher: Function | null =
            ActionDispatcherSwitcher(G.publicPlayers[Number(ctx.currentPlayer)].stack[0].action.type);
        actionDispatcher?.(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0], ...args);
    } else {
        EndAction(G, ctx);
    }
};
