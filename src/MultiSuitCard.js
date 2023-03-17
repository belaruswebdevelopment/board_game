import { multiCardsConfig } from "./data/MultiSuitCardData";
import { CardTypeRusNames } from "./typescript/enums";
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
 * @param name Название.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param type Тип.
 * @returns Мультифракционная карта.
 */
const CreateMultiSuitCard = ({ name, playerSuit = null, points = null, rank = null, type = CardTypeRusNames.MultiSuitCard, }) => ({
    name,
    playerSuit,
    points,
    rank,
    type,
});
/**
 * <h3>Создание мультифракционной карты на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной мультифракционной карты на поле игрока.</li>
 * </ol>
 *
 * @param name Название.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Мультифракционная карта на поле игрока.
 */
export const CreateMultiSuitPlayerCard = ({ name, points = null, rank = 1, suit, type = CardTypeRusNames.MultiSuitPlayerCard, }) => ({
    name,
    points,
    rank,
    suit,
    type,
});
//# sourceMappingURL=MultiSuitCard.js.map