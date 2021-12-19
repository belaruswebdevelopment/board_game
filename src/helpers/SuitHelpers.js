import { suitsConfig } from "../data/SuitData";
/**
 * <h3>Вычисляет индекс указанной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретной фракции.</li>
 * </ol>
 *
 * @param suitName Название фракции.
 * @returns Индекс фракции.
 */
export var GetSuitIndexByName = function (suitName) {
    return Object.keys(suitsConfig).indexOf(suitName);
};
