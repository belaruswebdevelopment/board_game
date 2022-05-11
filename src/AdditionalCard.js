import { CreateCard } from "./Card";
import { additionalCardsConfig } from "./data/AdditionalCardData";
import { CardNames, GameNames } from "./typescript/enums";
/**
 * <h3>Создание дополнительной карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании дополнительной карты во время получения преимущества по фракции 'Кузнецы'.</li>
 * </ol>
 *
 * @returns Массив дополнительных карт.
 */
export const BuildAdditionalCards = () => {
    const cards = [];
    let cardName;
    for (cardName in additionalCardsConfig) {
        const card = additionalCardsConfig[cardName];
        cards.push(CreateCard({
            suit: card.suit,
            rank: card.rank,
            points: card.points,
            name: card.name,
            game: GameNames.Basic,
        }));
    }
    return cards;
};
// TODO Can OlwinDouble be discarded and if picked from discard which suit it has?
/**
 * <h3>Создание фейковой карты 'Двойник Ольвюна'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании фейковой карты 'Двойник Ольвюна' при необходимости отрисовки выкладки карты на стол игрока.</li>
 * </ol>
 *
 * @param name Название.
 * @param suit Фракция.
 * @returns
 */
export const CreateOlwinDoubleNonPlacedCard = ({ name = CardNames.OlwinsDouble, suit, } = {}) => ({
    name,
    suit,
});
//# sourceMappingURL=AdditionalCard.js.map