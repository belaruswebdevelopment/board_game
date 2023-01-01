import { CardTypeRusNames } from "../typescript/enums";
import type { MercenaryCampCard, MercenaryPlayerCampCard } from "../typescript/interfaces";

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
export const IsMercenaryCampCard = (card: unknown): card is MercenaryCampCard =>
    (card as MercenaryCampCard).type === CardTypeRusNames.Mercenary_Card;

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
export const IsMercenaryPlayerCampCard = (card: unknown): card is MercenaryPlayerCampCard =>
    (card as MercenaryPlayerCampCard).type === CardTypeRusNames.Mercenary_Player_Card;
