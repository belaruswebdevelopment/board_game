import { CreateCard } from "./Card";
import { additionalCardsConfig } from "./data/AdditionalCardData";
import { CardNames, GameNames } from "./typescript/enums";
import type { AdditionalCardTypes, ICard, ICreateOlwinDoubleNonPlacedCard, IOlwinDoubleNonPlacedCard } from "./typescript/interfaces";

/**
 * <h3>Создание дополнительной карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании дополнительной карты во время получения преимущества по фракции 'Кузнецы'.</li>
 * </ol>
 *
 * @returns Массив дополнительных карт.
 */
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
export const CreateOlwinDoubleNonPlacedCard = ({
    name = CardNames.OlwinsDouble,
    suit,
}: ICreateOlwinDoubleNonPlacedCard = {} as ICreateOlwinDoubleNonPlacedCard): IOlwinDoubleNonPlacedCard => ({
    name,
    suit,
});
