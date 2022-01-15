import { suitsConfig } from "../data/SuitData";
/**
 * <h3>Вычисляет индекс указанной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретной фракции.</li>
 * </ol>
 *
 * @param suit Название фракции.
 * @returns Индекс фракции.
 */
export const GetSuitIndexByName = (suit) => Object.keys(suitsConfig).indexOf(suit);
//# sourceMappingURL=SuitHelpers.js.map