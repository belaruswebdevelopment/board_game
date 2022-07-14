import { specialCardsConfig } from "./data/SpecialCardData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CreateSpecialCardType, ISpecialCard, SpecialCardDataType, SpecialCardTypes } from "./typescript/interfaces";

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
    let cardName: SpecialCardTypes;
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

// TODO Fix it!
/**
 * <h3>Проверка, является ли объект особой картой.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект особой картой.
 */
export const IsSpecialCard = (card: unknown): card is ISpecialCard => card !== null
    && (card as ISpecialCard).suit !== undefined && !(`description` in (card as ISpecialCard));
