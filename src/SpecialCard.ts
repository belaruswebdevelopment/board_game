import { specialCardsConfig } from "./data/SpecialCardData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CreateSpecialCardType, ISpecialCard, SpecialCardDataType, SpecialCardNamesKeyofTypeofType } from "./typescript/interfaces";

/**
 * <h3>Создание особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании особых карт во время получения преимущества по фракции 'Кузнецы'.</li>
 * </ol>
 *
 * @returns Массив особых карт.
 */
export const BuildSpecialCards = (): ISpecialCard[] => {
    const cards: ISpecialCard[] = [];
    let cardName: SpecialCardNamesKeyofTypeofType;
    for (cardName in specialCardsConfig) {
        const card: SpecialCardDataType = specialCardsConfig[cardName];
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
const CreateSpecialCard = ({
    type = RusCardTypeNames.Special_Card,
    suit,
    rank,
    points,
    name,
}: CreateSpecialCardType = {} as CreateSpecialCardType): ISpecialCard => ({
    type,
    suit,
    rank,
    points,
    name,
});
