import { multiCardsConfig } from "./data/MultiSuitCardData";
import { GameNames, RusCardTypeNames } from "./typescript/enums";
/**
 * <h3>Создание особых мультифракционных карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании мультифракционных карт во время инициализации игры.</li>
 * </ol>
 *
 * @param configOptions Конфиг опций мультифракционных карт.
 * @returns Массив мультифракционных карт.
 */
export const BuildMultiSuitCards = (configOptions) => {
    const cards = [];
    let cardName;
    for (cardName in multiCardsConfig) {
        const card = multiCardsConfig[cardName];
        if (configOptions.includes(card.game)) {
            cards.push(CreateMultiSuitCard({
                name: card.name,
            }));
        }
    }
    return cards;
};
/**
 * <h3>Создание мультифракционной карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех мультифракционных карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @returns Мультифракционная карта.
 */
const CreateMultiSuitCard = ({ type = RusCardTypeNames.Multi_Suit_Card, name, } = {}) => ({
    type,
    name,
});
/**
 * <h3>Создание мультифракционной карты на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при размещении мультифракционной карты на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @returns Мультифракционная карта на поле игрока.
 */
export const CreateMultiSuitPlayerCard = ({ type = RusCardTypeNames.Multi_Suit_Player_Card, name, suit, rank, points, } = {}) => ({
    type,
    name,
    suit,
    rank,
    points,
});
// TODO Add !(...) for IsMythicalAnimalCard
/**
 * <h3>Проверка, является ли объект мультифракционной картой.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект мультифракционной картой.
 */
export const IsMultiSuitCard = (card) => card !== null
    && !(`points` in card) && !(`value` in card)
    && !(`placedSuit` in card) && !(`strengthTokenNotch` in card);
// TODO Fix it!
/**
* <h3>Проверка, является ли объект мультифракционной картой на поле игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект мультифракционной картой на поле игрока.
*/
export const IsMultiSuitPlayerCard = (card) => card !== null
    && card.suit !== undefined;
//# sourceMappingURL=MultiSuitCard.js.map