import { CreateCard } from "./Card";
import { additionalCardsConfig } from "./data/AdditionalCardData";
import { CardNames, GameNames } from "./typescript/enums";
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
export const CreateOlwinDoubleNonPlacedCard = ({ name = CardNames.OlwinsDouble, suit, } = {}) => ({
    name,
    suit,
});
//# sourceMappingURL=AdditionalCard.js.map