import { specialCardsConfig } from "./data/SpecialCardData";
import { CardTypeRusNames } from "./typescript/enums";
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
            name: card.name,
            playerSuit: card.playerSuit,
            points: card.points,
            rank: card.rank,
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
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Особая карта.
 */
const CreateSpecialCard = ({ type = CardTypeRusNames.SpecialCard, name, playerSuit, points = null, rank = 2, }) => ({
    type,
    name,
    playerSuit,
    points,
    rank,
});
/**
 * <h3>Создание особой карты на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной особой карты на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Особая карта на поле игрока.
 */
export const CreateSpecialCardPlayerCard = ({ type = CardTypeRusNames.SpecialPlayerCard, name, suit, points = null, rank = 2, }) => ({
    type,
    name,
    suit,
    points,
    rank,
});
//# sourceMappingURL=SpecialCard.js.map