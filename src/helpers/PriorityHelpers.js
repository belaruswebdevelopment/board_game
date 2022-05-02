import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
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
export const HasLowestPriority = (G, playerId) => {
    const tempPriorities = Object.values(G.publicPlayers).map((player) => player.priority.value), minPriority = Math.min(...tempPriorities), player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    const priority = player.priority;
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
export const ChangePlayersPriorities = (G) => {
    const tempPriorities = [];
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        const exchangeOrder = G.exchangeOrder[i];
        if (exchangeOrder !== undefined) {
            const exchangePlayer = G.publicPlayers[exchangeOrder];
            if (exchangePlayer === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с id '${exchangeOrder}'.`);
            }
            tempPriorities[i] = exchangePlayer.priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypes.GAME, `Обмен кристаллами между игроками:`);
        for (let i = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority = tempPriorities[i], player = G.publicPlayers[i];
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
//# sourceMappingURL=PriorityHelpers.js.map