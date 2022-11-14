import { RusCardTypeNames } from "../typescript/enums";
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
export const IsGiantCard = (card) => card.type === RusCardTypeNames.Giant_Card;
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
export const IsGodCard = (card) => card.type === RusCardTypeNames.God_Card;
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
export const IsMythicalAnimalCard = (card) => card.type === RusCardTypeNames.Mythical_Animal_Card;
//# sourceMappingURL=IsMythologicalCreatureTypeHelpers.js.map