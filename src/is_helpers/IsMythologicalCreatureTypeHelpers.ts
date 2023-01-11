import { CardTypeRusNames } from "../typescript/enums";
import type { GiantCard, GodCard, MythicalAnimalCard, MythicalAnimalPlayerCard } from "../typescript/interfaces";

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
 * <h3>Проверка, является ли объект картой бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой бога.
 */
export const IsGodCard = (card: unknown): card is GodCard => (card as GodCard).type === CardTypeRusNames.GodCard;

/**
 * <h3>Проверка, является ли объект картой мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой мифического животного.
 */
export const IsMythicalAnimalCard = (card: unknown): card is MythicalAnimalCard =>
    (card as MythicalAnimalCard).type === CardTypeRusNames.MythicalAnimalCard;

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
