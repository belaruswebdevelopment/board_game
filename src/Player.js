"use strict";
exports.__esModule = true;
exports.GetTop2PlayerId = exports.GetTop1PlayerId = exports.IsTopPlayer = exports.AddCardToCards = exports.AddHeroCardToPlayerCards = exports.AddHeroCardToPlayerHeroCards = exports.AddCampCardToPlayerCards = exports.AddCampCardToPlayer = exports.AddCardToPlayer = exports.CheckPlayersBasicOrder = exports.BuildPublicPlayer = exports.BuildPlayer = void 0;
var Coin_1 = require("./Coin");
var CoinData_1 = require("./data/CoinData");
var Score_1 = require("./Score");
var SuitHelpers_1 = require("./helpers/SuitHelpers");
var Logging_1 = require("./Logging");
var SuitData_1 = require("./data/SuitData");
var Card_1 = require("./Card");
/**
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @constructor
 */
var CreatePlayer = function (_a) {
    var _b = _a === void 0 ? {} : _a, handCoins = _b.handCoins, boardCoins = _b.boardCoins;
    return ({
        handCoins: handCoins,
        boardCoins: boardCoins
    });
};
/**
 *
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param nickname Никнейм.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @constructor
 */
var CreatePublicPlayer = function (_a) {
    var _b = _a === void 0 ? {} : _a, nickname = _b.nickname, cards = _b.cards, _c = _b.heroes, heroes = _c === void 0 ? [] : _c, _d = _b.campCards, campCards = _d === void 0 ? [] : _d, handCoins = _b.handCoins, boardCoins = _b.boardCoins, _e = _b.stack, stack = _e === void 0 ? [] : _e, priority = _b.priority, _f = _b.buffs, buffs = _f === void 0 ? {} : _f, selectedCoin = _b.selectedCoin, _g = _b.pickedCard, pickedCard = _g === void 0 ? null : _g;
    return ({
        nickname: nickname,
        cards: cards,
        campCards: campCards,
        heroes: heroes,
        handCoins: handCoins,
        boardCoins: boardCoins,
        stack: stack,
        priority: priority,
        buffs: buffs,
        selectedCoin: selectedCoin,
        pickedCard: pickedCard
    });
};
/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @constructor
 */
var BuildPlayer = function () { return CreatePlayer({
    handCoins: (0, Coin_1.BuildCoins)(CoinData_1.initialPlayerCoinsConfig, { isInitial: true, isTriggerTrading: false }),
    boardCoins: Array(CoinData_1.initialPlayerCoinsConfig.length).fill(null)
}); };
exports.BuildPlayer = BuildPlayer;
/**
 * <h3>Создаёт всех игроков (публичные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param playersNum Количество игроков.
 * @param suitsNum Количество фракций.
 * @param nickname Никнейм.
 * @constructor
 */
var BuildPublicPlayer = function (playersNum, suitsNum, nickname) {
    return CreatePublicPlayer({
        nickname: nickname,
        cards: Array(suitsNum).fill(Array(0)),
        handCoins: (0, Coin_1.BuildCoins)(CoinData_1.initialPlayerCoinsConfig, { isInitial: true, isTriggerTrading: false }),
        boardCoins: Array(CoinData_1.initialPlayerCoinsConfig.length).fill(null)
    });
};
exports.BuildPublicPlayer = BuildPublicPlayer;
/**
 * <h3>Проверяет базовый порядок хода игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости выставления монет на игровое поле.</li>
 * <li>Происходит при необходимости выставления монет на игровое поле при наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var CheckPlayersBasicOrder = function (G, ctx) {
    G.publicPlayersOrder = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        if (G.publicPlayers[i].buffs.everyTurn === "Uline") {
            G.publicPlayersOrder.push(i);
        }
    }
};
exports.CheckPlayersBasicOrder = CheckPlayersBasicOrder;
/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @constructor
 */
var AddCardToPlayer = function (G, ctx, card) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = card;
    if ((0, Card_1.isCardNotAction)(card)) {
        var suitIndex = (0, SuitHelpers_1.GetSuitIndexByName)(card.suit);
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitIndex].push(card);
        (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 '").concat(card.name, "'."));
        return true;
    }
    (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 '").concat(card.name, "'."));
    return false;
};
exports.AddCardToPlayer = AddCardToPlayer;
/**
 * <h3>Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты кэмпа игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
var AddCampCardToPlayer = function (G, ctx, card) {
    G.publicPlayers[Number(ctx.currentPlayer)].campCards.push(card);
    (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 \u043A\u044D\u043C\u043F\u0430 ").concat(card.name, "."));
};
exports.AddCampCardToPlayer = AddCampCardToPlayer;
/**
 * <h3>Добавляет карту кэмпа в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты кэмпа в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
var AddCampCardToPlayerCards = function (G, ctx, card) {
    var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(card.suit);
    if (suitId !== -1) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(card);
        (0, Logging_1.AddDataToLog)(G, "private" /* PRIVATE */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 \u043A\u044D\u043C\u043F\u0430 '").concat(card.name, "' \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(SuitData_1.suitsConfig[card.suit].suitName, "."));
    }
};
exports.AddCampCardToPlayerCards = AddCampCardToPlayerCards;
/**
 * <h3>Добавляет героя в массив героев игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
var AddHeroCardToPlayerHeroCards = function (G, ctx, hero) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = hero;
    hero.active = false;
    G.publicPlayers[Number(ctx.currentPlayer)].heroes.push(hero);
    (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0432\u044B\u0431\u0440\u0430\u043B \u0433\u0435\u0440\u043E\u044F ").concat(hero.name, "."));
};
exports.AddHeroCardToPlayerHeroCards = AddHeroCardToPlayerHeroCards;
/**
 * <h3>Добавляет героя в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
var AddHeroCardToPlayerCards = function (G, ctx, hero) {
    var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(hero.suit);
    if (suitId !== -1) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(hero);
        (0, Logging_1.AddDataToLog)(G, "private" /* PRIVATE */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u0433\u0435\u0440\u043E\u044F ").concat(hero.name, " \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(SuitData_1.suitsConfig[hero.suit].suitName, "."));
    }
};
exports.AddHeroCardToPlayerCards = AddHeroCardToPlayerCards;
/**
 * <h3>Добавляет карту в массив потенциальных карт для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подсчёте потенциального скоринга для ботов.</li>
 * </ol>
 *
 * @param cards Массив потенциальных карт для ботов.
 * @param card Карта.
 */
var AddCardToCards = function (cards, card) {
    var suitIndex = (0, SuitHelpers_1.GetSuitIndexByName)(card.suit);
    if (suitIndex) {
        cards[suitIndex].push(card);
    }
};
exports.AddCardToCards = AddCardToCards;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param playerId
 * @constructor
 */
var IsTopPlayer = function (G, playerId) {
    var score = (0, Score_1.CurrentScoring)(G.publicPlayers[playerId]);
    return G.publicPlayers.every(function (player) { return (0, Score_1.CurrentScoring)(player) <= score; });
};
exports.IsTopPlayer = IsTopPlayer;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров
 * @param G
 * @param currentPlayerId Id текущего игрока.
 * @constructor
 */
var GetTop1PlayerId = function (G, currentPlayerId) {
    var top1PlayerId = G.publicPlayers.findIndex(function (player, index) {
        return (0, exports.IsTopPlayer)(G, index);
    });
    if (G.publicPlayersOrder.indexOf(currentPlayerId) > G.publicPlayersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};
exports.GetTop1PlayerId = GetTop1PlayerId;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId Id текущего игрока.
 * @constructor
 */
var GetTop2PlayerId = function (G, top1PlayerId) {
    var playersScore = G.publicPlayers.map(function (player) { return (0, Score_1.CurrentScoring)(player); }), maxScore = Math.max.apply(Math, playersScore);
    var top2PlayerId, temp;
    if (playersScore.filter(function (score) { return score === maxScore; }).length === 1) {
        temp = playersScore.sort(function (a, b) { return b - a; })[1];
        top2PlayerId = G.publicPlayers.findIndex(function (player) { return (0, Score_1.CurrentScoring)(player) === temp; });
    }
    else {
        top2PlayerId = G.publicPlayers.findIndex(function (player, index) { return index !== top1PlayerId &&
            (0, exports.IsTopPlayer)(G, index); });
    }
    if (G.publicPlayersOrder.indexOf(top1PlayerId) > G.publicPlayersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};
exports.GetTop2PlayerId = GetTop2PlayerId;
