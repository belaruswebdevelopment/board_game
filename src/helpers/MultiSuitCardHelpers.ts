import { CreateMultiSuitPlayerCard } from "../MultiSuitCard";
import type { MultiSuitCard, MultiSuitPlayerCard } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением мультифракционной карты в массив карт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе мультифракционной карты, добавляющейся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Мультифракционная карта на поле игрока.
 */
export const AddMultiSuitCardToPlayerCards = (card: MultiSuitCard): MultiSuitPlayerCard => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateMultiSuitPlayerCard({
            name: card.name,
            points: card.points,
            rank: card.rank,
            suit: card.playerSuit,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
