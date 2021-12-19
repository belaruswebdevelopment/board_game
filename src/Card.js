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
export var isCardNotAction = function (card) { return card.suit !== undefined; };
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
export var CreateCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "\u0431\u0430\u0437\u043E\u0432\u0430\u044F" : _c, suit = _b.suit, rank = _b.rank, points = _b.points, _d = _b.name, name = _d === void 0 ? "" : _d, _e = _b.game, game = _e === void 0 ? "" : _e, _f = _b.tier, tier = _f === void 0 ? 0 : _f, _g = _b.path, path = _g === void 0 ? "" : _g;
    return ({
        type: type,
        suit: suit,
        rank: rank,
        points: points,
        name: name,
        game: game,
        tier: tier,
        path: path,
    });
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
var CreateActionCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "\u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u043C\u043E\u043D\u0435\u0442\u044B" : _c, value = _b.value, stack = _b.stack, name = _b.name;
    return ({
        type: type,
        value: value,
        stack: stack,
        name: name,
    });
};
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
export var BuildCards = function (deckConfig, data) {
    var cards = [];
    for (var suit in suitsConfig) {
        var points = deckConfig.suits[suit].pointsValues()[data.players][data.tier];
        var count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        }
        else {
            count = points;
        }
        for (var j = 0; j < count; j++) {
            var rank = deckConfig.suits[suit].ranksValues()[data.players][data.tier];
            cards.push(CreateCard({
                suit: deckConfig.suits[suit].suit,
                rank: Array.isArray(rank) ? rank[j] : 1,
                points: Array.isArray(points) ? points[j] : null,
                name: "(\u0444\u0440\u0430\u043A\u0446\u0438\u044F: ".concat(suitsConfig[deckConfig.suits[suit].suit].suitName, ", \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432: ").concat(Array.isArray(rank) ? rank[j] : 1, ", \u043E\u0447\u043A\u043E\u0432: ").concat(Array.isArray(points) ? points[j] + ")" : "\u043D\u0435\u0442)"),
            }));
        }
    }
    for (var i = 0; i < deckConfig.actions.length; i++) {
        for (var j = 0; j < deckConfig.actions[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: deckConfig.actions[i].value,
                stack: deckConfig.actions[i].stack,
                name: "\u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u043C\u043E\u043D\u0435\u0442\u044B \u043D\u0430 +".concat(deckConfig.actions[i].value),
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
 * @param suitConfig Конфиг карт дворфов.
 * @param data
 * @returns "Средняя" карта дворфа.
 */
export var GetAverageSuitCard = function (suitConfig, data) {
    var avgCard = CreateCard({
        suit: suitConfig.suit,
        rank: 0,
        points: 0
    }), rank = suitConfig.ranksValues()[data.players][data.tier], points = suitConfig.pointsValues()[data.players][data.tier];
    var count = Array.isArray(points) ? points.length : points;
    if (avgCard.points !== null) {
        for (var i = 0; i < count; i++) {
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
 * @param card1 Первая карта.
 * @param card2 Вторая карта.
 * @returns Сравнительное значение.
 */
export var CompareCards = function (card1, card2) {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (isCardNotAction(card1) && isCardNotAction(card2)) {
        if (card1.suit === card2.suit) {
            var result = (card1.points !== undefined && card1.points !== null ?
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
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
export var PotentialScoring = function (_a) {
    var _b, _c, _d, _e;
    var _f = _a.player, player = _f === void 0 ? {} : _f, _g = _a.card, card = _g === void 0 ? {} : _g;
    var score = 0, potentialCards = [];
    for (var i_1 = 0; i_1 < player.cards.length; i_1++) {
        potentialCards[i_1] = [];
        for (var j = 0; j < player.cards[i_1].length; j++) {
            AddCardToCards(potentialCards, player.cards[i_1][j]);
        }
    }
    if (card !== null && "suit" in card) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    var i = 0;
    for (var suit in suitsConfig) {
        score += suitsConfig[suit].scoringRule(potentialCards[i]);
        i++;
    }
    if (card !== null && "value" in card) {
        score += card.value;
    }
    for (var i_2 = 0; i_2 < player.boardCoins.length; i_2++) {
        score += (_c = (_b = player.boardCoins[i_2]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0;
        score += (_e = (_d = player.handCoins[i_2]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : 0;
    }
    return score;
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
export var EvaluateCard = function (G, ctx, compareCard, cardId, tavern) {
    // todo check it and fix -1
    var suitId = -1;
    if (compareCard !== null && "suit" in compareCard) {
        suitId = GetSuitIndexByName(compareCard.suit);
        if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[suitId]);
        }
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        var temp = tavern.map(function (card) {
            return G.publicPlayers.map(function (player) {
                return PotentialScoring({ player: player, card: card });
            });
        }), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach(function (player) {
            return player.splice(Number(ctx.currentPlayer), 1);
        });
        return result - Math.max.apply(Math, temp.map(function (player) {
            return Math.max.apply(Math, player);
        }));
    }
    return CompareCards(compareCard, G.averageCards[suitId]);
};
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
export var DiscardCardFromTavern = function (G, discardCardIndex) {
    var discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        AddDataToLog(G, LogTypes.GAME, "\u041A\u0430\u0440\u0442\u0430 ".concat(discardedCard.name, " \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B ").concat(tavernsConfig[G.currentTavern].name, " \u0443\u0431\u0440\u0430\u043D\u0430 \u0432 \u0441\u0431\u0440\u043E\u0441."));
        var additionalDiscardCardIndex = G.taverns[G.currentTavern].findIndex(function (card) { return card !== null; });
        if (additionalDiscardCardIndex !== -1) {
            AddDataToLog(G, LogTypes.GAME, "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B ".concat(tavernsConfig[G.currentTavern].name, " \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0443\u0431\u0440\u0430\u043D\u0430 \u0432 \u0441\u0431\u0440\u043E\u0441 \u0438\u0437-\u0437\u0430 \u043F\u0438\u043A\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u0430 Jarnglofi."));
            DiscardCardFromTavern(G, additionalDiscardCardIndex);
        }
        return true;
    }
    AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043B\u0438\u0448\u043D\u044E\u044E \u043A\u0430\u0440\u0442\u0443 \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B.");
    return false;
};
