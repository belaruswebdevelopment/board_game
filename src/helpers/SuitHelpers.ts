import { suitsConfig } from "../data/SuitData";

/**
 * <h3>Вычисляет индекс указанной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретной фракции.</li>
 * </ol>
 *
 * @param {string} suitName Название фракции.
 * @returns {number} Индекс фракции.
 * @constructor
 */
export const GetSuitIndexByName = (suitName: string): number => Object.keys(suitsConfig).indexOf(suitName);
