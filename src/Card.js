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
 * @param {DeckCardTypes} card Карта.
 * @returns {card is ICard} Является ли объект картой дворфа, а не картой обмена монеты.
 */
export var isCardNotAction = function (card) { return card.suit !== undefined; };
/**
 * <h3>Создание карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param {string | undefined} type Тип.
 * @param {string} suit Фракция.
 * @param {number | null} rank Шевроны.
 * @param {number | null} points Очки.
 * @param {string | undefined} name Название.
 * @param {string | undefined} game Игра/дополнение.
 * @param {number | undefined} tier Эпоха.
 * @param {string | undefined} path URL путь.
 * @returns {ICard} Карта дворфа.
 * @constructor
 */
export var CreateCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "базовая" : _c, suit = _b.suit, rank = _b.rank, points = _b.points, _d = _b.name, name = _d === void 0 ? "" : _d, _e = _b.game, game = _e === void 0 ? "" : _e, _f = _b.tier, tier = _f === void 0 ? 0 : _f, _g = _b.path, path = _g === void 0 ? "" : _g;
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
 * @param {string | undefined} type Тип.
 * @param {number} value Значение.
 * @param {IStack[]} stack Действие.
 * @param {string} name Название.
 * @returns {IActionCard} Карта обмена монеты.
 * @constructor
 */
var CreateActionCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "улучшение монеты" : _c, value = _b.value, stack = _b.stack, name = _b.name;
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
 * @param {IDeckConfig} deckConfig Конфиг карт.
 * @param {IAverageSuitCardData} data Данные для создания карт.
 * @returns {DeckCardTypes[]} Все карты дворфов и обмена монет.
 * @constructor
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
                name: "(\u0444\u0440\u0430\u043A\u0446\u0438\u044F: ".concat(suitsConfig[deckConfig.suits[suit].suit].suitName, ", \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432: \n                ").concat(Array.isArray(rank) ? rank[j] : 1, ", \u043E\u0447\u043A\u043E\u0432: ").concat(Array.isArray(points) ? points[j] + ")" : "нет)"),
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
 * @param {ISuit} suitConfig Конфиг карт дворфов.
 * @param {IAverageSuitCardData} data
 * @returns {ICard} "Средняя" карта дворфа.
 * @constructor
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
 * @param {TavernCardTypes} card1 Первая карта.
 * @param {TavernCardTypes} card2 Вторая карта.
 * @returns {number} Сравнительное значение.
 * @constructor
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {number} Профит карты.
 * @constructor
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
 * @param {IPublicPlayer} player Игрок.
 * @param {PlayerCardsType | IActionCard} card Карта.
 * @returns {number} Потенциальное значение.
 * @constructor
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {ICard} compareCard Карта для сравнения.
 * @param {number} cardId Id карты.
 * @param {TavernCardTypes[]} tavern Таверна.
 * @returns {number} Сравнительное значение.
 * @constructor
 */
export var EvaluateCard = function (G, ctx, compareCard, cardId, tavern) {
    var suitId = GetSuitIndexByName(compareCard.suit);
    if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
        return CompareCards(compareCard, G.averageCards[suitId]);
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        var temp = tavern.map(function (card) {
            return G.publicPlayers.map(function (player) {
                return PotentialScoring({ player: player, card: card });
            });
        }), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach(function (player) { return player.splice(Number(ctx.currentPlayer), 1); });
        return result - Math.max.apply(Math, temp.map(function (player) { return Math.max.apply(Math, player); }));
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
 * @param {MyGameState} G
 * @param {number} discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns {boolean} Сброшена ли карта из таверны.
 * @constructor
 */
export var DiscardCardFromTavern = function (G, discardCardIndex) {
    var discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        AddDataToLog(G, LogTypes.GAME, "\u041A\u0430\u0440\u0442\u0430 ".concat(discardedCard.name, " \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \n        ").concat(tavernsConfig[G.currentTavern].name, " \u0443\u0431\u0440\u0430\u043D\u0430 \u0432 \u0441\u0431\u0440\u043E\u0441."));
        return true;
    }
    AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не удалось сбросить лишнюю карту из таверны.");
    return false;
};
