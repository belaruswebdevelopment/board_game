import { AssertPrioritiesAmount } from "./is_helpers/AssertionTypeHelpers";
/**
 * <h3>Создание кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в массиве всех кристаллов.</li>
 * <li>Используется при раздаче кристаллов игрокам.</li>
 * <li>Используется при выдаче преимущества в виде кристалла горняков.</li>
 * </ol>
 *
 * @param isExchangeable Является ли кристалл обменным.
 * @param value Значение кристалла.
 * @returns Кристалл.
 */
export const CreatePriority = ({ isExchangeable = true, value, }) => ({
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
 * @param solo Является ли режим игры соло игрой.
 * @returns Массив базовых кристаллов.
 */
export const GeneratePrioritiesForPlayerNumbers = (numPlayers, solo) => {
    const priorityNum = (solo ? 1 : numPlayers) - 1;
    AssertPrioritiesAmount(priorityNum);
    return prioritiesConfig[priorityNum].map((priority) => priority);
};
// TODO Move to PriorityData?!
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
        value: -1,
    }),
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
const prioritiesConfig = [
    priorities.slice(0, 2),
    priorities.slice(-2),
    priorities.slice(-3),
    priorities.slice(-4),
    priorities.slice(-5),
];
//# sourceMappingURL=Priority.js.map