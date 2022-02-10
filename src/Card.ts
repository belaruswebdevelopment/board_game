import { additionalCardsConfig } from "./data/AdditionalCardData";
import { suitsConfig } from "./data/SuitData";
import { IActionCard, ICreateActionCard } from "./typescript/action_card_interfaces";
import { IAverageSuitCardData } from "./typescript/bot_interfaces";
import { ICard, ICreateCard } from "./typescript/card_interfaces";
import { DeckCardTypes, DiscardCardTypes } from "./typescript/card_types";
import { RusCardTypes } from "./typescript/enums";
import { IDeckConfig } from "./typescript/interfaces";

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
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const points: number | number[] = deckConfig.suits[suit].pointsValues()[data.players][data.tier];
            let count = 0;
            if (Array.isArray(points)) {
                count = points.length;
            } else {
                count = points;
            }
            for (let j = 0; j < count; j++) {
                const rank: number | number[] = deckConfig.suits[suit].ranksValues()[data.players][data.tier];
                cards.push(CreateCard({
                    suit: deckConfig.suits[suit].suit,
                    rank: Array.isArray(rank) ? rank[j] : 1,
                    points: Array.isArray(points) ? points[j] : null,
                    name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: ${Array.isArray(rank) ? rank[j] : 1}, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
                } as ICreateCard));
            }
        }
    }
    for (let i = 0; i < deckConfig.actions.length; i++) {
        for (let j = 0; j < deckConfig.actions[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: deckConfig.actions[i].value,
                stack: deckConfig.actions[i].stack,
                name: `улучшение монеты на +${deckConfig.actions[i].value}`,
            } as ICreateActionCard));
        }
    }
    return cards;
};

export const BuildAdditionalCards = (): ICard[] => {
    const cards: ICard[] = [];
    for (const card in additionalCardsConfig) {
        if (Object.prototype.hasOwnProperty.call(additionalCardsConfig, card)) {
            cards.push(CreateCard({
                suit: additionalCardsConfig[card].suit,
                rank: additionalCardsConfig[card].rank,
                points: additionalCardsConfig[card].points,
                name: additionalCardsConfig[card].name,
            } as ICreateCard));
        }
    }
    return cards;
};

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
    name = ``,
    game = ``,
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

export const isActionDiscardCard = (card: DiscardCardTypes): card is IActionCard =>
    (card as IActionCard).type !== RusCardTypes.ACTION;

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
export const isCardNotAction = (card: DeckCardTypes): card is ICard => (card as ICard).suit !== undefined;
