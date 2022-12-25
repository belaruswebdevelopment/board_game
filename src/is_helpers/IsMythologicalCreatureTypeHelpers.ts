import { RusCardTypeNames } from "../typescript/enums";
import type { IGiantCard, IGodCard, IMythicalAnimalCard } from "../typescript/interfaces";

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
export const IsGiantCard = (card: unknown): card is IGiantCard =>
    (card as IGiantCard).type === RusCardTypeNames.Giant_Card;

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
export const IsGodCard = (card: unknown): card is IGodCard => (card as IGodCard).type === RusCardTypeNames.God_Card;

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
export const IsMythicalAnimalCard = (card: unknown): card is IMythicalAnimalCard =>
    (card as IMythicalAnimalCard).type === RusCardTypeNames.Mythical_Animal_Card;
