import { CardTypeRusNames } from "../typescript/enums";
import type { GiantCard, MythicalAnimalPlayerCard, ValkyryCard } from "../typescript/interfaces";

/**
 * <h3>Проверка, является ли объект картой гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой гиганта.
 */
export const IsGiantCard = (card: unknown): card is GiantCard =>
    (card as GiantCard).type === CardTypeRusNames.GiantCard;

/**
 * <h3>Проверка, является ли объект картой мифического животного на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой мифического животного на поле игрока.
 */
export const IsMythicalAnimalPlayerCard = (card: unknown): card is MythicalAnimalPlayerCard =>
    (card as MythicalAnimalPlayerCard).type === CardTypeRusNames.MythicalAnimalPlayerCard;

/**
* <h3>Проверка, является ли объект картой валькирии.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой валькирии.
*/
export const IsValkyryCard = (card: unknown): card is ValkyryCard =>
    (card as ValkyryCard).type === CardTypeRusNames.ValkyryCard;
