import {AddDataToLog} from "./Logging";

/**
 * Создание кристаллов.
 * Применения:
 * 1) Используется в массиве всех кристаллов.
 * 2) Используется при раздаче кристаллов игрокам.
 * 3) Используется при выдаче преимущества в виде кристалла горняков.
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
 * Массив кристаллов.
 * Применения:
 * 1) Используется в конфиге кристаллов.
 *
 * @type {{isExchangeable: boolean, value}[]}
 */
const priorities = [
    CreatePriority({value: 1}),
    CreatePriority({value: 2}),
    CreatePriority({value: 3}),
    CreatePriority({value: 4}),
    CreatePriority({value: 5}),
];

/**
 * Конфиг кристаллов.
 * Применения:
 * 1) Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).
 *
 * @type {{"2": {isExchangeable: boolean, value}[], "3": {isExchangeable: boolean, value}[], "4": {isExchangeable: boolean, value}[], "5": {isExchangeable: boolean, value}[]}}
 */
const prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};

/**
 * Раздать случайные кристаллы по одному каждому игроку.
 * Применения:
 * 1) Раздаёт кристаллы после создания всех игроков.
 *
 * @todo Доработать возможность раздачи кристаллов каждому игроку по отдельности.
 * @param G
 * @param players Массив всех игроков.
 * @constructor
 */
export const BuildPriorities = (G, players) => {
    AddDataToLog(G, "game", "Получение стартовых кристаллов игроками:");
    const priorities = prioritiesConfig[players.length].map(priority => priority);
    for (let i = 0; i < players.length; i++) {
        const randomPriorityIndex = Math.floor(Math.random() * priorities.length),
            priority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i].priority = CreatePriority(priority);
        AddDataToLog(G, "public", `Игрок ${G.players[i].nickname} получил кристалл ${players[i].priority}.`);
    }
};

/**
 * Изменяет приоритет игроков для выбора карт из текущей таверны.
 * Применения:
 * 1) Используется в конце фазы выбора карт.
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
        G.players[i].priority = tempPriorities[i];
        AddDataToLog(G, "public", `Игрок ${G.players[i].nickname} получил кристалл ${tempPriorities[i]}.`);
    }
};

/**
 * Определяет имеет ли выбранный игрок наименьший кристалл.
 * Применения:
 * 1) Используется для ботов при определении приоритета выставления монет.
 *
 * @param G
 * @param playerId ID выбранного грока.
 * @returns {boolean} Имеет ли выбранный игрок наименьший кристалл.
 * @constructor
 */
export const HasLowestPriority = (G, playerId) => {
    const tempPriorities = G.players.map(player => player.priority.value),
        minPriority = Math.min(...tempPriorities);
    return G.players[playerId].priority.value === minPriority;
};
