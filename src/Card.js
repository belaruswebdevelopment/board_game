import { AddCardToCards } from "./Player";
import { suitsConfig } from "./data/SuitData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
import { tavernsConfig } from "./Tavern";
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
export const isCardNotAction = (card) => card.suit !== undefined;
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
    for (const suit in suitsConfig) {
        const points = deckConfig.suits[suit].pointsValues()[data.players][data.tier];
        let count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        }
        else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            const rank = deckConfig.suits[suit].ranksValues()[data.players][data.tier];
            cards.push(CreateCard({
                suit: deckConfig.suits[suit].suit,
                rank: Array.isArray(rank) ? rank[j] : 1,
                points: Array.isArray(points) ? points[j] : null,
                name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: ${Array.isArray(rank) ? rank[j] : 1}, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
            }));
        }
    }
    for (let i = 0; i < deckConfig.actions.length; i++) {
        for (let j = 0; j < deckConfig.actions[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: deckConfig.actions[i].value,
                stack: deckConfig.actions[i].stack,
                name: `улучшение монеты на +${deckConfig.actions[i].value}`,
            }));
        }
    }
    return cards;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns Профит карты.
 */
/*export const CardProfitForPlayer = (G: MyGameState, ctx: Ctx): number => {
    if (IsTopPlayer(G, Number(ctx.currentPlayer))) {
        let top2PlayerId: number = GetTop2PlayerId(G, Number(ctx.currentPlayer));
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    let top1PlayerId: number = GetTop1PlayerId(G, Number(ctx.currentPlayer));
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};*/
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param card1 Первая карта.
 * @param card2 Вторая карта.
 * @returns Сравнительное значение.
 */
export const CompareCards = (card1, card2) => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (isCardNotAction(card1) && isCardNotAction(card2)) {
        if (card1.suit === card2.suit) {
            const result = (card1.points !== undefined && card1.points !== null ?
                card1.points : 1) - (card2.points !== undefined && card2.points !== null ? card2.points : 1);
            if (result === 0) {
                return result;
            }
            return result > 0 ? 1 : -1;
        }
    }
    return 0;
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
const CreateActionCard = ({ type = `улучшение монеты`, value, stack, name, } = {}) => ({
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
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @returns Карта дворфа.
 */
export const CreateCard = ({ type = `базовая`, suit, rank, points, name = ``, game = ``, tier = 0, path = ``, } = {}) => ({
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
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из кэмпа.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G, discardCardIndex) => {
    const discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        AddDataToLog(G, LogTypes.GAME, `Карта ${discardedCard.name} из таверны ${tavernsConfig[G.currentTavern].name} убрана в сброс.`);
        const additionalDiscardCardIndex = G.taverns[G.currentTavern].findIndex((card) => card !== null);
        if (additionalDiscardCardIndex !== -1) {
            AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
            DiscardCardFromTavern(G, additionalDiscardCardIndex);
        }
        return true;
    }
    AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось сбросить лишнюю карту из таверны.`);
    return false;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param compareCard Карта для сравнения.
 * @param cardId Id карты.
 * @param tavern Таверна.
 * @returns Сравнительное значение.
 */
export const EvaluateCard = (G, ctx, compareCard, cardId, tavern) => {
    // todo check it and fix -1
    let suitId = -1;
    if (compareCard !== null && "suit" in compareCard) {
        suitId = GetSuitIndexByName(compareCard.suit);
        if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[suitId]);
        }
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        let temp = tavern.map((card) => G.publicPlayers.map((player) => PotentialScoring({ player, card: card }))), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach((player) => player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player) => Math.max(...player)));
    }
    return CompareCards(compareCard, G.averageCards[suitId]);
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param suitConfig Конфиг карт дворфов.
 * @param data
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suitConfig, data) => {
    const avgCard = CreateCard({
        suit: suitConfig.suit,
        rank: 0,
        points: 0
    }), rank = suitConfig.ranksValues()[data.players][data.tier], points = suitConfig.pointsValues()[data.players][data.tier];
    let count = Array.isArray(points) ? points.length : points;
    if (avgCard.points !== null) {
        for (let i = 0; i < count; i++) {
            avgCard.rank += Array.isArray(rank) ? rank[i] : 1;
            avgCard.points += Array.isArray(points) ? points[i] : 1;
        }
        avgCard.rank /= count;
        avgCard.points /= count;
    }
    return avgCard;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
export const PotentialScoring = ({ player = {}, card = {}, }) => {
    var _a, _b, _c, _d;
    let score = 0, potentialCards = [];
    for (let i = 0; i < player.cards.length; i++) {
        potentialCards[i] = [];
        for (let j = 0; j < player.cards[i].length; j++) {
            AddCardToCards(potentialCards, player.cards[i][j]);
        }
    }
    if (card !== null && `suit` in card) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    let i = 0;
    for (const suit in suitsConfig) {
        score += suitsConfig[suit].scoringRule(potentialCards[i]);
        i++;
    }
    if (card !== null && `value` in card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += (_b = (_a = player.boardCoins[i]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
        score += (_d = (_c = player.handCoins[i]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0;
    }
    return score;
};
