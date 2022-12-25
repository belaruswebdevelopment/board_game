import { specialCardsConfig } from "./data/SpecialCardData";
import { RusCardTypeNames } from "./typescript/enums";
/**
 * <h3>Создание особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании особых карт во время получения преимущества по фракции 'Кузнецы'.</li>
 * </ol>
 *
 * @returns Массив особых карт.
 */
export const BuildSpecialCards = () => {
    const cards = [];
    let cardName;
    for (cardName in specialCardsConfig) {
        const card = specialCardsConfig[cardName];
        cards.push(CreateSpecialCard({
            suit: card.suit,
            rank: card.rank,
            points: card.points,
            name: card.name,
        }));
    }
    return cards;
};
/**
 * <h3>Создание особой карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта дворфа.
 */
const CreateSpecialCard = ({ type = RusCardTypeNames.Special_Card, name, suit, rank, points, }) => ({
    type,
    name,
    suit,
    rank,
    points,
});
//# sourceMappingURL=SpecialCard.js.map