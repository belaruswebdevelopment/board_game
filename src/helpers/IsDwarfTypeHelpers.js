import { RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Проверка, является ли объект картой Дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Дворфа.
 */
export const IsDwarfCard = (card) => card.type === RusCardTypeNames.Dwarf_Card;
//# sourceMappingURL=IsDwarfTypeHelpers.js.map