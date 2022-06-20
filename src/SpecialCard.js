import { specialCardsConfig } from "./data/SpecialCardData";
import { CardNames, GameNames, RusCardTypes } from "./typescript/enums";
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
export const CreateOlwinDoubleNonPlacedCard = ({ name = CardNames.OlwinsDouble, suit, } = {}) => ({
    name,
    suit,
});
/**
 * <h3>Создание особой карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @returns Карта дворфа.
 */
const CreateSpecialCard = ({ type = RusCardTypes.Special, suit, rank, points, name, game = GameNames.Basic, } = {}) => ({
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
export const IsSpecialCard = (card) => card !== null && card.suit !== undefined && !(`tier` in card)
    && !(`description` in card);
//# sourceMappingURL=SpecialCard.js.map