import { CreateCard } from "./Card";
import { additionalCardsConfig } from "./data/AdditionalCardData";
import { CardNames, GameNames } from "./typescript/enums";
import type { AdditionalCardTypes, ICard, ICreateOlwinDoubleNonPlacedCard, IOlwinDoubleNonPlacedCard } from "./typescript/interfaces";

export const BuildAdditionalCards = (): ICard[] => {
    const cards: ICard[] = [];
    let cardName: AdditionalCardTypes;
    for (cardName in additionalCardsConfig) {
        const card: ICard = additionalCardsConfig[cardName];
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

export const CreateOlwinDoubleNonPlacedCard = ({
    name = CardNames.OlwinsDouble,
    suit,
}: ICreateOlwinDoubleNonPlacedCard = {} as ICreateOlwinDoubleNonPlacedCard): IOlwinDoubleNonPlacedCard => ({
    name,
    suit,
});
