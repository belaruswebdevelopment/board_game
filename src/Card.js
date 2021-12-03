"use strict";
exports.__esModule = true;
exports.DiscardCardFromTavern = exports.EvaluateCard = exports.PotentialScoring = exports.CardProfitForPlayer = exports.CompareCards = exports.GetAverageSuitCard = exports.BuildCards = exports.CreateCard = exports.isCardNotAction = void 0;
var Player_1 = require("./Player");
var SuitData_1 = require("./data/SuitData");
var SuitHelpers_1 = require("./helpers/SuitHelpers");
var Logging_1 = require("./Logging");
var Tavern_1 = require("./Tavern");
var isCardNotAction = function (card) { return card.suit !== undefined; };
exports.isCardNotAction = isCardNotAction;
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
 * @constructor
 */
var CreateCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "базовая" : _c, suit = _b.suit, _d = _b.rank, rank = _d === void 0 ? 1 : _d, _e = _b.points, points = _e === void 0 ? null : _e, _f = _b.name, name = _f === void 0 ? "" : _f, _g = _b.game, game = _g === void 0 ? "" : _g, _h = _b.tier, tier = _h === void 0 ? 0 : _h, _j = _b.path, path = _j === void 0 ? "" : _j;
    return {
        type: type,
        suit: suit,
        rank: rank,
        points: points,
        name: name,
        game: game,
        tier: tier,
        path: path
    };
};
exports.CreateCard = CreateCard;
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
 * @constructor
 */
var CreateActionCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "улучшение монеты" : _c, value = _b.value, stack = _b.stack, name = _b.name;
    return ({
        type: type,
        value: value,
        stack: stack,
        name: name
    });
};
/**
 * <h3>Создаёт все карты и карты улучшения монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param deckConfig Конфиг карт.
 * @param data Данные для создания карт.
 * @constructor
 */
var BuildCards = function (deckConfig, data) {
    var cards = [];
    for (var suit in SuitData_1.suitsConfig) {
        var cardPoints = deckConfig.suits[suit].pointsValues()[data.players][data.tier];
        var count = 0;
        if (Array.isArray(cardPoints)) {
            count = cardPoints.length;
        }
        else {
            count = cardPoints;
        }
        for (var j = 0; j < count; j++) {
            cards.push((0, exports.CreateCard)({
                suit: deckConfig.suits[suit].suit,
                rank: deckConfig.suits[suit].ranksValues()[data.players][data.tier][j],
                points: deckConfig.suits[suit].pointsValues()[data.players][data.tier][j],
                name: "(\u0444\u0440\u0430\u043A\u0446\u0438\u044F: ".concat(SuitData_1.suitsConfig[deckConfig.suits[suit].suit].suitName, ", \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432: \n                ").concat(deckConfig.suits[suit].ranksValues()[data.players][data.tier][j] !== undefined ?
                    deckConfig.suits[suit].ranksValues()[data.players][data.tier][j] : 1, ", \n                \u043E\u0447\u043A\u043E\u0432: ").concat(deckConfig.suits[suit].pointsValues()[data.players][data.tier][j] !== undefined ?
                    deckConfig.suits[suit].pointsValues()[data.players][data.tier][j] + ")" : "нет)")
            }));
        }
    }
    for (var i = 0; i < deckConfig.actions.length; i++) {
        for (var j = 0; j < deckConfig.actions[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: deckConfig.actions[i].value,
                stack: deckConfig.actions[i].stack,
                name: "\u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u043C\u043E\u043D\u0435\u0442\u044B \u043D\u0430 +".concat(deckConfig.actions[i].value)
            }));
        }
    }
    return cards;
};
exports.BuildCards = BuildCards;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param suitConfig
 * @param data
 * @constructor
 */
var GetAverageSuitCard = function (suitConfig, data) {
    var avgCard = (0, exports.CreateCard)({
        suit: suitConfig.suit,
        rank: 0,
        points: 0
    }), cardPoints = suitConfig.pointsValues()[data.players][data.tier];
    var count = 0;
    if (Array.isArray(cardPoints)) {
        count = cardPoints.length;
    }
    else {
        count = cardPoints;
    }
    for (var i = 0; i < count; i++) {
        avgCard.rank += suitConfig.ranksValues()[data.players][data.tier][i] !== undefined ?
            suitConfig.ranksValues()[data.players][data.tier][i] : 1;
        avgCard.points += suitConfig.pointsValues()[data.players][data.tier][i] !== undefined ?
            suitConfig.pointsValues()[data.players][data.tier][i] : 1;
    }
    avgCard.rank /= count;
    avgCard.points /= count;
    return avgCard;
};
exports.GetAverageSuitCard = GetAverageSuitCard;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param card1
 * @param card2
 * @constructor
 */
var CompareCards = function (card1, card2) {
    if (!card1 || !card2) {
        return 0;
    }
    if (card1.suit === card2.suit) {
        var result = (card1.points !== undefined && card1.points !== null ? card1.points : 1) -
            (card2.points !== undefined && card2.points !== null ? card2.points : 1);
        if (result === 0) {
            return result;
        }
        return result > 0 ? 1 : -1;
    }
    return 0;
};
exports.CompareCards = CompareCards;
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
 * @constructor
 */
var CardProfitForPlayer = function (G, ctx) {
    if ((0, Player_1.IsTopPlayer)(G, Number(ctx.currentPlayer))) {
        var top2PlayerId = (0, Player_1.GetTop2PlayerId)(G, Number(ctx.currentPlayer));
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    var top1PlayerId = (0, Player_1.GetTop1PlayerId)(G, Number(ctx.currentPlayer));
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};
exports.CardProfitForPlayer = CardProfitForPlayer;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param player
 * @param card
 * @constructor
 */
var PotentialScoring = function (_a) {
    var _b, _c, _d, _e;
    var _f = _a.player, player = _f === void 0 ? {} : _f, _g = _a.card, card = _g === void 0 ? {} : _g;
    var score = 0, potentialCards = [];
    for (var i_1 = 0; i_1 < player.cards.length; i_1++) {
        potentialCards[i_1] = [];
        for (var j = 0; j < player.cards[i_1].length; j++) {
            (0, Player_1.AddCardToCards)(potentialCards, player.cards[i_1][j]);
        }
    }
    if (card && card.suit !== undefined) {
        (0, Player_1.AddCardToCards)(potentialCards, (0, exports.CreateCard)(card));
    }
    var i = 0;
    for (var suit in SuitData_1.suitsConfig) {
        score += SuitData_1.suitsConfig[suit].scoringRule(potentialCards[i]);
        i++;
    }
    if (card && card.suit === undefined) {
        score += card.value;
    }
    for (var i_2 = 0; i_2 < player.boardCoins.length; i_2++) {
        score += (_c = (_b = player.boardCoins[i_2]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0;
        score += (_e = (_d = player.handCoins[i_2]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : 0;
    }
    return score;
};
exports.PotentialScoring = PotentialScoring;
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
 * @param compareCard
 * @param cardId
 * @param tavern
 * @constructor
 */
var EvaluateCard = function (G, ctx, compareCard, cardId, tavern) {
    var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(compareCard.suit);
    if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
        return (0, exports.CompareCards)(compareCard, G.averageCards[suitId]);
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        var temp = tavern.map(function (card) { return G.publicPlayers.map(function (player) {
            return (0, exports.PotentialScoring)({ player: player, card: card });
        }); }), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach(function (player) { return player.splice(Number(ctx.currentPlayer), 1); });
        return result - Math.max.apply(Math, temp.map(function (player) { return Math.max.apply(Math, player); }));
    }
    return (0, exports.CompareCards)(compareCard, G.averageCards[suitId]);
};
exports.EvaluateCard = EvaluateCard;
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
 * @constructor
 */
var DiscardCardFromTavern = function (G, discardCardIndex) {
    var discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u041A\u0430\u0440\u0442\u0430 ".concat(discardedCard.name, " \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \n        ").concat(Tavern_1.tavernsConfig[G.currentTavern].name, " \u0443\u0431\u0440\u0430\u043D\u0430 \u0432 \u0441\u0431\u0440\u043E\u0441."));
        return true;
    }
    return false;
};
exports.DiscardCardFromTavern = DiscardCardFromTavern;
