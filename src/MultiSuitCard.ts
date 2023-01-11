import { multiCardsConfig } from "./data/MultiSuitCardData";
import { CardTypeRusNames } from "./typescript/enums";
import type { CreateMultiSuitCardFromData, CreateMultiSuitPlayerCardFromData, GameNamesKeyofTypeofType, MultiSuitCard, MultiSuitCardData, MultiSuitCardNamesKeyofTypeofType, MultiSuitPlayerCard } from "./typescript/interfaces";

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
export const BuildMultiSuitCards = (configOptions: GameNamesKeyofTypeofType[]): MultiSuitCard[] => {
    const cards: MultiSuitCard[] = [];
    let cardName: MultiSuitCardNamesKeyofTypeofType;
    for (cardName in multiCardsConfig) {
        const card: MultiSuitCardData = multiCardsConfig[cardName];
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
 * @param playerSuit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Мультифракционная карта.
 */
const CreateMultiSuitCard = ({
    type = CardTypeRusNames.MultiSuitCard,
    name,
    playerSuit = null,
    rank = null,
    points = null,
}: CreateMultiSuitCardFromData): MultiSuitCard => ({
    type,
    name,
    playerSuit,
    rank,
    points,
});

/**
 * <h3>Создание мультифракционной карты на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной мультифракционной карты на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Мультифракционная карта на поле игрока.
 */
export const CreateMultiSuitPlayerCard = ({
    type = CardTypeRusNames.MultiSuitPlayerCard,
    name,
    suit,
    rank = 1,
    points = null,
}: CreateMultiSuitPlayerCardFromData): MultiSuitPlayerCard => ({
    type,
    name,
    suit,
    rank,
    points,
});
