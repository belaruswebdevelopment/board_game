import { CreateSpecialCardPlayerCard } from "../SpecialCard";
/**
 * <h3>Действия, связанные с добавлением особой карты в массив карт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе особой карты, добавляющейся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Особая карта на поле игрока.
 */
export const AddSpecialCardToPlayerCards = (card) => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateSpecialCardPlayerCard({
            name: card.name,
            points: card.points,
            rank: card.rank,
            suit: card.playerSuit,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
//# sourceMappingURL=SpecialCardHelpers.js.map