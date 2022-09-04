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
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @returns Карта дворфа.
 */
const CreateSpecialCard = ({ type = RusCardTypeNames.Special_Card, suit, rank, points, name, }) => ({
    type,
    suit,
    rank,
    points,
    name,
});
//# sourceMappingURL=SpecialCard.js.map