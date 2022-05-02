import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import type { IMyGameState, IPriority, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id выбранного игрока.
 * @returns Имеет ли игрок наименьший кристалл.
 */
export const HasLowestPriority = (G: IMyGameState, playerId: number): boolean => {
    const tempPriorities: number[] =
        Object.values(G.publicPlayers).map((player: IPublicPlayer): number => player.priority.value),
        minPriority: number = Math.min(...tempPriorities),
        player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    const priority: IPriority = player.priority;
    return priority.value === minPriority;
};

/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 */
export const ChangePlayersPriorities = (G: IMyGameState): void => {
    const tempPriorities: (IPriority | undefined)[] = [];
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        const exchangeOrder: number | undefined = G.exchangeOrder[i];
        if (exchangeOrder !== undefined) {
            const exchangePlayer: IPublicPlayer | undefined = G.publicPlayers[exchangeOrder];
            if (exchangePlayer === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с id '${exchangeOrder}'.`);
            }
            tempPriorities[i] = exchangePlayer.priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypes.GAME, `Обмен кристаллами между игроками:`);
        for (let i = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority: IPriority | undefined = tempPriorities[i],
                player: IPublicPlayer | undefined = G.publicPlayers[i];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
            }
            if (tempPriority !== undefined && player.priority.value !== tempPriority.value) {
                player.priority = tempPriority;
                AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' получил кристалл с приоритетом '${tempPriority.value}'.`);
            }
        }
    }
};
