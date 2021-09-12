import {AddDataToLog} from "./Logging";

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
 * @returns {{isExchangeable: boolean, value}} Кристалл.
 * @constructor
 */
export const CreatePriority = ({value, isExchangeable = true} = {}) => ({
    value,
    isExchangeable,
});

/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 *
 * @type {{isExchangeable: boolean, value}[]} Массив кристаллов.
 */
const priorities = [
    CreatePriority({value: 1}),
    CreatePriority({value: 2}),
    CreatePriority({value: 3}),
    CreatePriority({value: 4}),
    CreatePriority({value: 5}),
];

/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 *
 * @type {{"2": {isExchangeable: boolean, value}[], "3": {isExchangeable: boolean, value}[], "4": {isExchangeable: boolean, value}[], "5": {isExchangeable: boolean, value}[]}} Конфиг кристаллов.
 */
const prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};

/**
 * <h3>Раздать случайные кристаллы по одному каждому игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Раздаёт кристаллы после создания всех игроков.</li>
 * </ol>
 *
 * @param players Массив всех игроков.
 * @constructor
 */
export const BuildPriorities = (players) => {
    const priorities = prioritiesConfig[players.length].map(priority => priority);
    for (let i = 0; i < players.length; i++) {
        const randomPriorityIndex = Math.floor(Math.random() * priorities.length),
            priority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i].priority = CreatePriority(priority);
    }
};

/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export const ChangePlayersPriorities = (G) => {
    AddDataToLog(G, "game", "Обмен кристаллами между игроками:");
    const tempPriorities = [];
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        tempPriorities[i] = G.players[G.exchangeOrder[i]].priority;
    }
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        if (G.players[i].priority.value !== tempPriorities[i].value) {
            AddDataToLog(G, "public", `Игрок ${G.players[i].nickname} получил кристалл с приоритетом 
            ${tempPriorities[i].value}.`);
            G.players[i].priority = tempPriorities[i];
        }
    }
};

/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id выбранного игрока.
 * @returns {boolean} Имеет ли выбранный игрок наименьший кристалл.
 * @constructor
 */
export const HasLowestPriority = (G, playerId) => {
    const tempPriorities = G.players.map(player => player.priority.value),
        minPriority = Math.min(...tempPriorities);
    return G.players[playerId].priority.value === minPriority;
};
