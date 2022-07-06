import { specialCardsConfig } from "./data/SpecialCardData";
import { CardNames, GameNames, HeroNames, RusCardTypeNames } from "./typescript/enums";
import type { CreateOlwinDoubleNonPlacedCardType, CreateSpecialCardType, CreateThrudNonPlacedCardType, IOlwinDoubleNonPlacedCard, ISpecialCard, IThrudNonPlacedCard, SpecialCardDataType, SpecialCardTypes } from "./typescript/interfaces";

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

// TODO Move to new card type?!
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
export const CreateOlwinDoubleNonPlacedCard = ({
    name = CardNames.OlwinsDouble,
    suit,
}: CreateOlwinDoubleNonPlacedCardType = {} as CreateOlwinDoubleNonPlacedCardType): IOlwinDoubleNonPlacedCard => ({
    name,
    suit,
});

/**
 * <h3>Создание фейковой карты 'Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании фейковой карты 'Труд' при необходимости отрисовки выкладки карты на стол игрока.</li>
 * </ol>
 *
 * @param name Название.
 * @returns
 */
export const CreateThrudNonPlacedCard = ({
    name = HeroNames.Thrud,
}: CreateThrudNonPlacedCardType = {} as CreateThrudNonPlacedCardType): IThrudNonPlacedCard => ({
    name,
});

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
 * @param game Игра/дополнение.
 * @returns Карта дворфа.
 */
const CreateSpecialCard = ({
    type = RusCardTypeNames.Special,
    suit,
    rank,
    points,
    name,
    game = GameNames.Basic,
}: CreateSpecialCardType = {} as CreateSpecialCardType): ISpecialCard => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
});

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
export const IsSpecialCard = (card: unknown): card is ISpecialCard =>
    card !== null && (card as ISpecialCard).suit !== undefined && !(`tier` in (card as ISpecialCard))
    && !(`description` in (card as ISpecialCard));
