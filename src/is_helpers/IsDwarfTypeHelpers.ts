import { RusCardTypeNames } from "../typescript/enums";
import type { IDwarfCard } from "../typescript/interfaces";

/**
 * <h3>Проверка, является ли объект картой Дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Дворфа.
 */
export const IsDwarfCard = (card: unknown): card is IDwarfCard =>
    (card as IDwarfCard).type === RusCardTypeNames.Dwarf_Card;
