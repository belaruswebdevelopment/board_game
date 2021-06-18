import {suitsConfig} from "../data/SuitData";

/**
 * Вычисляет индекс указанной фракции.
 * Применения:
 * 1) Используется повсеместно в проекте для вычисления индекса конкретной фракции.
 *
 * @param suitName Название фракции.
 * @returns {number} Индекс фракции.
 * @constructor
 */
export const GetSuitIndexByName = (suitName) => Object.keys(suitsConfig).indexOf(suitName);
