import { CardTypeRusNames } from "../typescript/enums";
/**
 * <h3>Проверка, является ли объект картой наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой наёмника.
 */
export const IsMercenaryCampCard = (card) => card.type === CardTypeRusNames.MercenaryCard;
/**
* <h3>Проверка, является ли объект картой наёмника на поле игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой наёмника на поле игрока.
*/
export const IsMercenaryPlayerCampCard = (card) => card.type === CardTypeRusNames.MercenaryPlayerCard;
//# sourceMappingURL=IsCampTypeHelpers.js.map