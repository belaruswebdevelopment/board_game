import {AddDataToLog, LogTypes} from "./Logging";
import {MyGameState} from "./GameSetup";
import {IPublicPlayer} from "./Player";

/**
 * <h3>Интерфейс для кристалла.</h3>
 */
export interface IPriority {
    value: number,
    isExchangeable: boolean,
}

/**
 * <h3>Интерфейс для конфига всех кристаллов.</h3>
 */
interface IPrioritiesConfig {
    [index: number]: IPriority[],
}

/**
 * <h3>Интерфейс для создания кристалла.</h3>
 */
interface ICreatePriority {
    value: number,
    isExchangeable?: boolean,
}

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
 * @constructor
 */
export const CreatePriority = ({value, isExchangeable = true} = {} as ICreatePriority): IPriority => ({
    value,
    isExchangeable,
});

/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
const priorities = [
    CreatePriority({value: 1} as ICreatePriority),
    CreatePriority({value: 2} as ICreatePriority),
    CreatePriority({value: 3} as ICreatePriority),
    CreatePriority({value: 4} as ICreatePriority),
    CreatePriority({value: 5} as ICreatePriority),
];

/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 */
const prioritiesConfig: IPrioritiesConfig = {
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
 * @param numPlayers Количество игроков.
 * @param players Объект всех игроков.
 * @constructor
 */
export const BuildPriorities = (numPlayers: number, players: IPublicPlayer[]): void => {
    const priorities: IPriority[] = prioritiesConfig[numPlayers].map(priority => priority);
    for (let i: number = 0; i < numPlayers; i++) {
        const randomPriorityIndex: number = Math.floor(Math.random() * priorities.length),
            priority: IPriority = priorities.splice(randomPriorityIndex, 1)[0];
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
export const ChangePlayersPriorities = (G: MyGameState): void => {
    AddDataToLog(G, LogTypes.GAME, "Обмен кристаллами между игроками:");
    const tempPriorities: IPriority[] = [];
    for (let i: number = 0; i < G.exchangeOrder.length; i++) {
        const priority: IPriority | undefined = G.publicPlayers[G.exchangeOrder[i]].priority;
        if (priority) {
            tempPriorities[i] = priority;
        }
    }
    for (let i: number = 0; i < G.exchangeOrder.length; i++) {
        const priority: IPriority | undefined = G.publicPlayers[i].priority;
        if (priority) {
            if (priority.value !== tempPriorities[i].value) {
                AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[i].nickname} получил кристалл с 
                приоритетом ${tempPriorities[i].value}.`);
                G.publicPlayers[i].priority = tempPriorities[i];
            }
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
 * @constructor
 */
export const HasLowestPriority = (G: MyGameState, playerId: number): boolean => {
    const tempPriorities: number[] = G.publicPlayers.map(player => (player.priority as IPriority).value),
        minPriority: number = Math.min(...tempPriorities),
        priority: IPriority | undefined = G.publicPlayers[playerId].priority;
    if (priority) {
        return priority.value === minPriority;
    }
    return false;
};
