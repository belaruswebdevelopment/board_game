import { AddDataToLog, LogTypes } from "./Logging";
import { MyGameState } from "./GameSetup";
import { IPublicPlayer } from "./Player";

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
 * @returns Кристалл.
 */
export const CreatePriority = ({
    value,
    isExchangeable = true,
}: ICreatePriority = {} as ICreatePriority): IPriority => ({
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
const priorities: IPriority[] = [
    CreatePriority({ value: 1 } as ICreatePriority),
    CreatePriority({ value: 2 } as ICreatePriority),
    CreatePriority({ value: 3 } as ICreatePriority),
    CreatePriority({ value: 4 } as ICreatePriority),
    CreatePriority({ value: 5 } as ICreatePriority),
];

/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 */
export const prioritiesConfig: IPrioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};

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
export const GeneratePrioritiesForPlayerNumbers = (numPlayers: number): IPriority[] =>
    prioritiesConfig[numPlayers].map((priority: IPriority): IPriority => priority);

/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 */
export const ChangePlayersPriorities = (G: MyGameState): void => {
    const tempPriorities: (IPriority | undefined)[] = [];
    for (let i: number = 0; i < G.exchangeOrder.length; i++) {
        const exchangeOrder: number | undefined = G.exchangeOrder[i];
        if (exchangeOrder !== undefined) {
            tempPriorities[i] = G.publicPlayers[exchangeOrder].priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypes.GAME, `Обмен кристаллами между игроками:`);
        for (let i: number = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority: IPriority | undefined = tempPriorities[i];
            if (tempPriority !== undefined && G.publicPlayers[i].priority.value !== tempPriority.value) {
                G.publicPlayers[i].priority = tempPriority;
                AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[i].nickname} получил кристалл с приоритетом
                ${tempPriority.value}.`);
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
 * @returns Имеет ли игрок наименьший кристалл.
 */
export const HasLowestPriority = (G: MyGameState, playerId: number): boolean => {
    const tempPriorities: number[] = G.publicPlayers.map((player: IPublicPlayer): number => player.priority.value),
        minPriority: number = Math.min(...tempPriorities),
        priority: IPriority = G.publicPlayers[playerId].priority;
    return priority.value === minPriority;
};
