import { CardTypeRusNames } from "../typescript/enums";
/**
 * <h3>Проверка, является ли объект картой дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой дворфа.
 */
export const IsDwarfCard = (card) => card.type === CardTypeRusNames.DwarfCard;
//# sourceMappingURL=IsDwarfTypeHelpers.js.map