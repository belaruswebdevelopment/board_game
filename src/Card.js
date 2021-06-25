import {IsTopPlayer, GetTop1PlayerId, GetTop2PlayerId, AddCardToCards} from "./Player";
import {suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog} from "./Logging";
import {tavernsConfig} from "./Tavern";

/**
 * Создание карты.
 * Применения:
 * 1) Происходит при создании всех карт при инициализации игры.
 *
 * @param type Тип.
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @returns {{name, rank: number, suit, points: null}} Карта.
 * @constructor
 */
export const CreateCard = ({type = "базовая", suit, rank = 1, points = null, name, game, tier, path} = {}) => {
    return {
        type,
        suit,
        rank,
        points,
        name,
        game,
        tier,
        path,
    };
};

/**
 * Создание карты улучшения монеты.
 * Применения:
 * 1) Происходит при создании всех карт улучшения монеты при инициализации игры.
 *
 * @param type Тип.
 * @param value Значение.
 * @param action Действие.
 * @returns {{action, value}} Карта улучшения монеты.
 * @constructor
 */
const CreateActionCard = ({type = "улучшение монеты", value, stack, name} = {}) => {
    return {
        type,
        value,
        stack,
        name,
    };
};

/**
 * Создаёт все карты и карты улучшения монеты.
 * Применения:
 * 1) Происходит при инициализации игры.
 *
 * @param deckConfig Конфиг карт.
 * @param data Данные для создания карт.
 * @returns {*[]} Массив карт и карт улучшения монеты.
 * @constructor
 */
export const BuildCards = (deckConfig, data) => {
    const cards = [];
    for (const suit in suitsConfig) {
        const count = deckConfig.suits[suit].pointsValues()[data.players][data.tier].length ??
            deckConfig.suits[suit].pointsValues()[data.players][data.tier];
        for (let j = 0; j < count; j++) {
            cards.push(CreateCard({
                suit: deckConfig.suits[suit].suit,
                rank: deckConfig.suits[suit].ranksValues()[data.players][data.tier][j],
                points: deckConfig.suits[suit].pointsValues()[data.players][data.tier][j],
                name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: ${deckConfig.suits[suit].ranksValues()[data.players][data.tier][j] ?? 1}, 
                очков: ${deckConfig.suits[suit].pointsValues()[data.players][data.tier][j] !== undefined ?
                    deckConfig.suits[suit].pointsValues()[data.players][data.tier][j] + ")" : "нет)" }`,
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
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param suitConfig
 * @param data
 * @returns {{name, rank: number, suit, points: null}}
 * @constructor
 */
export const GetAverageSuitCard = (suitConfig, data) => {
    const avgCard = CreateCard({suit: suitConfig.suit, rank: 0, points: 0}),
        count = suitConfig.pointsValues()[data.players][data.tier]?.length ?? suitConfig.pointsValues()[data.players][data.tier];
    for (let i = 0; i < count; i++) {
        avgCard.rank += suitConfig.ranksValues()[data.players][data.tier][i] ?? 1;
        avgCard.points += suitConfig.pointsValues()[data.players][data.tier][i] ?? 1;
    }
    avgCard.rank /= count;
    avgCard.points /= count;
    return avgCard;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param card1
 * @param card2
 * @returns {number|number}
 * @constructor
 */
export const CompareCards = (card1, card2) => {
    if (!card1 || !card2) {
        return 0;
    }
    if (card1.suit === card2.suit) {
        const result = (card1.points ?? 1) - (card2.points ?? 1);
        if (result === 0) {
            return result;
        }
        return result > 0 ? 1 : -1;
    }
    return 0;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns {number}
 * @constructor
 */
export const CardProfitForPlayer = (G, ctx) => {
    if (IsTopPlayer(G, ctx.currentPlayer)) {
        let top2PlayerId = GetTop2PlayerId(G, ctx.currentPlayer);
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    let top1PlayerId = GetTop1PlayerId(G, ctx.currentPlayer);
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param player
 * @param card
 * @returns {number}
 * @constructor
 */
export const PotentialScoring = ({player = {}, card = {}}) => {
    let score = 0,
        potentialCards = [];
    for (let i = 0; i < player.cards.length; i++) {
        potentialCards[i] = [];
        for (let j = 0; j < player.cards[i].length; j++) {
            AddCardToCards(potentialCards, player.cards[i][j]);
        }
    }
    if (card && card.suit !== undefined) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    let i = 0;
    for (const suit in suitsConfig) {
        score += suitsConfig[suit].scoringRule(potentialCards[i]);
        i++;
    }
    if (card && card.suit === undefined) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i]?.value ?? 0;
        score += player.handCoins[i]?.value ?? 0;
    }
    return score;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param card
 * @param cardId
 * @param tavern
 * @returns {number}
 * @constructor
 */
export const EvaluateCard = (G, ctx, card, cardId, tavern) => {
    const suitId = GetSuitIndexByName(card.suit);
    if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
        return CompareCards(card, G.averageCards[suitId]);
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        let temp = tavern.map(item => G.players.map(player => PotentialScoring({player: player, card: item}))),
            result = temp[cardId][ctx.currentPlayer];
        temp.splice(cardId, 1);
        temp.forEach(player => player.splice(ctx.currentPlayer, 1));
        return result - Math.max(...temp.map(player => Math.max(...player)));
    }
    return CompareCards(card, G.averageCards[suitId]);
};

/**
 * Убирает карту из таверны в стопку сброса.
 * Применения:
 * 1) При игре на 2-х игроков убирает не выбранную карту.
 * 2) Убирает оставшуюся карту при выборе карты из кэмпа.
 * 3) Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @constructor
 */
export const DiscardCardFromTavern = (G, discardCardIndex) => {
    const discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    G.discardCardsDeck.push(discardedCard);
    G.taverns[G.currentTavern][discardCardIndex] = null;
    AddDataToLog(G, "game", `Карта ${discardedCard.name} из таверны ${tavernsConfig[G.currentTavern].name} убрана в сброс.`);
};
