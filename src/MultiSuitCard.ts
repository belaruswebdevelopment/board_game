import { multiCardsConfig } from "./data/MultiSuitCardData";
import { GameNames, RusCardTypeNames } from "./typescript/enums";
import type { CreateMultiSuitCardType, CreateMultiSuitPlayerCardType, IMultiSuitCard, IMultiSuitPlayerCard, MultiSuitCardDataType, MultiSuitCardKeyofType } from "./typescript/interfaces";

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
export const BuildMultiSuitCards = (configOptions: GameNames[]): IMultiSuitCard[] => {
    const cards: IMultiSuitCard[] = [];
    let cardName: MultiSuitCardKeyofType;
    for (cardName in multiCardsConfig) {
        const card: MultiSuitCardDataType = multiCardsConfig[cardName];
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
const CreateMultiSuitCard = ({
    type = RusCardTypeNames.Multi_Suit_Card,
    name,
}: CreateMultiSuitCardType = {} as CreateMultiSuitCardType): IMultiSuitCard => ({
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
export const CreateMultiSuitPlayerCard = ({
    type = RusCardTypeNames.Multi_Suit_Player_Card,
    name,
    suit,
    rank,
    points,
}: CreateMultiSuitPlayerCardType = {} as CreateMultiSuitPlayerCardType): IMultiSuitPlayerCard => ({
    type,
    name,
    suit,
    rank,
    points,
});
