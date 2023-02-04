import { CardTypeRusNames } from "../typescript/enums";
import type { MercenaryCard, MercenaryPlayerCard } from "../typescript/interfaces";

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
export const IsMercenaryCampCard = (card: unknown): card is MercenaryCard =>
    (card as MercenaryCard).type === CardTypeRusNames.MercenaryCard;

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
export const IsMercenaryPlayerCampCard = (card: unknown): card is MercenaryPlayerCard =>
    (card as MercenaryPlayerCard).type === CardTypeRusNames.MercenaryPlayerCard;
