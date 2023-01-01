import { CardTypeRusNames } from "../typescript/enums";
import type { GiantCard, GodCard, MythicalAnimalCard } from "../typescript/interfaces";

/**
 * <h3>Проверка, является ли объект картой Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Гиганта.
 */
export const IsGiantCard = (card: unknown): card is GiantCard =>
    (card as GiantCard).type === CardTypeRusNames.Giant_Card;

/**
 * <h3>Проверка, является ли объект картой Мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Мифического животного.
 */
export const IsGodCard = (card: unknown): card is GodCard => (card as GodCard).type === CardTypeRusNames.God_Card;

/**
 * <h3>Проверка, является ли объект картой Мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Мифического животного.
 */
export const IsMythicalAnimalCard = (card: unknown): card is MythicalAnimalCard =>
    (card as MythicalAnimalCard).type === CardTypeRusNames.Mythical_Animal_Card;
