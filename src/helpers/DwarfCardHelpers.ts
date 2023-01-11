import { CreateDwarfPlayerCard } from "../Dwarf";
import type { DwarfCard, DwarfPlayerCard } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением карты дворфа в массив карт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты дворфа, добавляющейся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Карта дворфа на поле игрока.
 */
export const AddDwarfToPlayerCards = (card: DwarfCard): DwarfPlayerCard => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateDwarfPlayerCard({
            name: card.name,
            suit: card.playerSuit,
            rank: card.rank,
            points: card.points,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
