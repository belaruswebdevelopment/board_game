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
export const CreatePriority = ({ isExchangeable = true, value, } = {}) => ({
    isExchangeable,
    value,
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
export const GeneratePrioritiesForPlayerNumbers = (numPlayers) => {
    const priorityConfig = prioritiesConfig[numPlayers];
    if (priorityConfig === undefined) {
        throw new Error(`В массиве конфига приоритетов отсутствует конфиг для количества игроков - '${numPlayers}'.`);
    }
    return priorityConfig.map((priority) => priority);
};
/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
const priorities = [
    CreatePriority({
        isExchangeable: false,
        value: 0,
    }),
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
export const prioritiesConfig = {
    1: priorities.slice(0, 0),
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};
//# sourceMappingURL=Priority.js.map