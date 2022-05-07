import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypes } from "./typescript/enums";
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
export const BuildCards = (deckConfig, data) => {
    const cards = [];
    let suit;
    for (suit in suitsConfig) {
        const pointValuesPlayers = deckConfig.suits[suit].pointsValues()[data.players];
        if (pointValuesPlayers === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}'.`);
        }
        const points = pointValuesPlayers[data.tier];
        if (points === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}' для указанной эпохи - '${data.tier}'.`);
        }
        let count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        }
        else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            let currentPoints;
            if (Array.isArray(points)) {
                const cardPoints = points[j];
                if (cardPoints === undefined) {
                    throw new Error(`Отсутствует значение очков карты с id '${j}'.`);
                }
                currentPoints = cardPoints;
            }
            else {
                currentPoints = null;
            }
            cards.push(CreateCard({
                suit: deckConfig.suits[suit].suit,
                points: currentPoints,
                name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
                game: GameNames.Basic,
            }));
        }
    }
    const actionCardConfig = deckConfig.actions;
    for (let i = 0; i < actionCardConfig.length; i++) {
        const currentActionCardConfig = actionCardConfig[i];
        if (currentActionCardConfig === undefined) {
            throw new Error(`В массиве конфигов карт улучшения монет отсутствует значение с id '${i}'.`);
        }
        const amountPlayersValue = currentActionCardConfig.amount()[data.players];
        if (amountPlayersValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт улучшения монет для указанного числа игроков - '${data.players}'.`);
        }
        const amountTierValue = amountPlayersValue[data.tier];
        if (amountTierValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт улучшения монет для указанного числа игроков - '${data.players}' для эпохи '${data.tier}'.`);
        }
        for (let j = 0; j < amountTierValue; j++) {
            cards.push(CreateActionCard({
                value: currentActionCardConfig.value,
                stack: currentActionCardConfig.stack,
                name: `улучшение монеты на +${currentActionCardConfig.value}`,
            }));
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
const CreateActionCard = ({ type = RusCardTypes.ACTION, value, stack, name, } = {}) => ({
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
export const CreateCard = ({ type = RusCardTypes.BASIC, suit, rank = 1, points, name, game, tier = 0, path = ``, } = {}) => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
    path,
});
/**
 * <h3>Проверка, является ли объект картой обмена монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой обмена монеты.
 */
export const IsActionCard = (card) => card !== null && card.value !== undefined;
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
export const IsCardNotActionAndNotNull = (card) => card !== null && card.suit !== undefined;
//# sourceMappingURL=Card.js.map