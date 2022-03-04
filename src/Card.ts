import { additionalCardsConfig } from "./data/AdditionalCardData";
import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypes } from "./typescript/enums";
import type { AdditionalCardTypes, DeckCardTypes, IActionCard, IActionCardConfig, IAverageSuitCardData, ICard, ICreateActionCard, ICreateCard, IDeckConfig, PlayerCardsType, SuitTypes } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты и карты улучшения монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param deckConfig Конфиг карт.
 * @param data Данные для создания карт.
 * @returns Все карты дворфов и обмена монет.
 */
export const BuildCards = (deckConfig: IDeckConfig, data: IAverageSuitCardData): DeckCardTypes[] => {
    const cards: DeckCardTypes[] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const points: number | number[] =
                deckConfig.suits[suit].pointsValues()[data.players][data.tier];
            let count = 0;
            if (Array.isArray(points)) {
                count = points.length;
            } else {
                count = points;
            }
            for (let j = 0; j < count; j++) {
                const rank: number | number[] =
                    deckConfig.suits[suit].ranksValues()[data.players][data.tier];
                cards.push(CreateCard({
                    suit: deckConfig.suits[suit].suit,
                    rank: Array.isArray(rank) ? rank[j] : 1,
                    points: Array.isArray(points) ? points[j] : null,
                    name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: ${Array.isArray(rank) ? rank[j] : 1}, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
                    game: GameNames.Basic,
                }));
            }
        }
    }
    const actionCardConfig: IActionCardConfig[] = deckConfig.actions;
    for (let i = 0; i < actionCardConfig.length; i++) {
        for (let j = 0; j < actionCardConfig[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: actionCardConfig[i].value,
                stack: actionCardConfig[i].stack,
                name: `улучшение монеты на +${actionCardConfig[i].value}`,
            }));
        }
    }
    return cards;
};

export const BuildAdditionalCards = (): ICard[] => {
    const cards: ICard[] = [];
    let cardName: AdditionalCardTypes;
    for (cardName in additionalCardsConfig) {
        if (Object.prototype.hasOwnProperty.call(additionalCardsConfig, cardName)) {
            const card: ICard = additionalCardsConfig[cardName];
            cards.push(CreateCard({
                suit: card.suit,
                rank: card.rank,
                points: card.points,
                name: card.name,
                game: GameNames.Basic,
            }));
        }
    }
    return cards;
};

export const CheckIsMercenaryCampCardInPlayerCards = (card: PlayerCardsType): boolean =>
    card !== null && card.type === RusCardTypes.MERCENARY;

/**
 * <h3>Создание карты улучшения монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт улучшения монеты во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param value Значение.
 * @param action Действие.
 * @param name Название.
 * @param type Тип.
 * @param value Значение.
 * @param stack Действие.
 * @param name Название.
 * @returns Карта обмена монеты.
 */
const CreateActionCard = ({
    type = RusCardTypes.ACTION,
    value,
    stack,
    name,
}: ICreateActionCard = {} as ICreateActionCard): IActionCard => ({
    type,
    value,
    stack,
    name,
});

/**
 * <h3>Создание карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @returns Карта дворфа.
 */
export const CreateCard = ({
    type = RusCardTypes.BASIC,
    suit,
    rank,
    points,
    name,
    game,
    tier = 0,
    path = ``,
}: ICreateCard = {} as ICreateCard): ICard => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
    path,
});

export const IsActionCard = (card: unknown): card is IActionCard =>
    card !== null && (card as IActionCard).value !== undefined;

/**
 * <h3>Проверка, является ли объект картой дворфа или картой обмена монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой дворфа, а не картой обмена монеты.
 */
export const IsCardNotActionAndNotNull = (card: unknown): card is ICard =>
    card !== null && (card as ICard).suit !== undefined;
