import { AddDataToLog } from "./Logging";
import { LogTypes } from "./typescript/enums";
import type { ICreatePriority, IMyGameState, IPrioritiesConfig, IPriority, IPublicPlayer } from "./typescript/interfaces";

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
 * <h3>Генерирует кристаллы из конфига кристаллов по количеству игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param numPlayers Количество игроков.
 * @returns Массив базовых кристаллов.
 */
export const GeneratePrioritiesForPlayerNumbers = (numPlayers: number): IPriority[] => {
    const priorityConfig: IPriority[] | undefined = prioritiesConfig[numPlayers];
    if (priorityConfig === undefined) {
        throw new Error(`В массиве конфига приоритетов отсутствует конфиг для количества игроков - '${numPlayers}'.`);
    }
    return priorityConfig.map((priority: IPriority): IPriority => priority);
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
export const HasLowestPriority = (G: IMyGameState, playerId: number): boolean => {
    const tempPriorities: number[] =
        Object.values(G.publicPlayers).map((player: IPublicPlayer): number => player.priority.value),
        minPriority: number = Math.min(...tempPriorities);
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    const priority: IPriority = player.priority;
    return priority.value === minPriority;
};

/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
const priorities: IPriority[] = [
    CreatePriority({
        value: 1,
    }),
    CreatePriority({
        value: 2,
    }),
    CreatePriority({
        value: 3,
    }),
    CreatePriority({
        value: 4,
    }),
    CreatePriority({
        value: 5,
    }),
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
