import { RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Проверка, является ли объект картой Наёмника для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Наёмника для лагеря.
 */
export const IsMercenaryCampCard = (card) => card.type === RusCardTypeNames.Mercenary_Card;
/**
* <h3>Проверка, является ли объект картой лагеря Наёмник на поле игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой лагеря Наёмник на поле игрока.
*/
export const IsMercenaryPlayerCampCard = (card) => card.type === RusCardTypeNames.Mercenary_Player_Card;
//# sourceMappingURL=IsCampTypeHelpers.js.map