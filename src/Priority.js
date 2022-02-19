import { AddDataToLog } from "./Logging";
import { LogTypes } from "./typescript/enums";
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
            tempPriorities[i] = G.publicPlayers[exchangeOrder].priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypes.GAME, `Обмен кристаллами между игроками:`);
        for (let i = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority = tempPriorities[i];
            if (tempPriority !== undefined && G.publicPlayers[i].priority.value !== tempPriority.value) {
                G.publicPlayers[i].priority = tempPriority;
                AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[i].nickname} получил кристалл с приоритетом ${tempPriority.value}.`);
            }
        }
    }
};
/**
 * <h3>Создание кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в массиве всех кристаллов.</li>
 * <li>Используется при раздаче кристаллов игрокам.</li>
 * <li>Используется при выдаче преимущества в виде кристалла горняков.</li>
 * </ol>
 *
 * @param value Значение кристалла.
 * @param isExchangeable Является ли кристалл обменным.
 * @returns Кристалл.
 */
export const CreatePriority = ({ value, isExchangeable = true, } = {}) => ({
    value,
    isExchangeable,
});
/**
 * <h3>Генерирует кристаллы из конфига кристаллов по количеству игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param numPlayers Количество игроков.
 * @returns Массив базовых кристаллов.
 */
export const GeneratePrioritiesForPlayerNumbers = (numPlayers) => prioritiesConfig[numPlayers].map((priority) => priority);
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
    const tempPriorities = G.publicPlayers.map((player) => player.priority.value), minPriority = Math.min(...tempPriorities), priority = G.publicPlayers[playerId].priority;
    return priority.value === minPriority;
};
/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
const priorities = [
    CreatePriority({ value: 1 }),
    CreatePriority({ value: 2 }),
    CreatePriority({ value: 3 }),
    CreatePriority({ value: 4 }),
    CreatePriority({ value: 5 }),
];
/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 */
export const prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};
//# sourceMappingURL=Priority.js.map