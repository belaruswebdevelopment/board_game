"use strict";
exports.__esModule = true;
exports.PickHero = exports.PickHeroWithConditions = exports.GetClosedCoinIntoPlayerHand = exports.AddHeroToCards = exports.CheckAndMoveThrudOrPickHeroAction = exports.PlaceYludAction = exports.PlaceThrudAction = void 0;
var SuitData_1 = require("../data/SuitData");
var Card_1 = require("../Card");
var Player_1 = require("../Player");
var Hero_1 = require("../Hero");
var StackHelpers_1 = require("../helpers/StackHelpers");
var Coin_1 = require("../Coin");
var HeroHelpers_1 = require("../helpers/HeroHelpers");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var core_1 = require("boardgame.io/core");
var Logging_1 = require("../Logging");
var ScoreHelpers_1 = require("../helpers/ScoreHelpers");
/**
 * <h3>Действия, связанные с проверкой расположением героя Труд на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceThrudAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(SuitData_1.suitsConfig)[suitId], playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants) {
        var thrudCard = (0, Card_1.CreateCard)({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: "герой",
            name: "Thrud",
            game: "base"
        });
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(SuitData_1.suitsConfig[suit].suitName, "."));
        (0, Player_1.AddCardToPlayer)(G, ctx, thrudCard);
        (0, Hero_1.CheckPickHero)(G, ctx);
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
    }
};
exports.PlaceThrudAction = PlaceThrudAction;
/**
 * <h3>Действия, связанные с проверкой расположением героя Илуд на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceYludAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(SuitData_1.suitsConfig)[suitId], playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants) {
        var yludCard = (0, Card_1.CreateCard)({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: "герой",
            name: "Ylud",
            game: "base"
        });
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u0418\u043B\u0443\u0434 \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(SuitData_1.suitsConfig[suit].suitName, "."));
        (0, Player_1.AddCardToPlayer)(G, ctx, yludCard);
        (0, exports.CheckAndMoveThrudOrPickHeroAction)(G, ctx, yludCard);
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
    }
};
exports.PlaceYludAction = PlaceYludAction;
/**
 * <h3>Действия, связанные с проверкой перемещения героя Труд или выбора героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении карт, героев или карт кэмпа, помещающихся на карту героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта, помещающаяся на карту героя Труд.
 * @constructor
 */
var CheckAndMoveThrudOrPickHeroAction = function (G, ctx, card) {
    var isMoveThrud = (0, HeroHelpers_1.CheckAndMoveThrud)(G, ctx, card);
    if (isMoveThrud) {
        (0, HeroHelpers_1.StartThrudMoving)(G, ctx, card);
    }
    else {
        (0, Hero_1.CheckPickHero)(G, ctx);
    }
};
exports.CheckAndMoveThrudOrPickHeroAction = CheckAndMoveThrudOrPickHeroAction;
/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
var AddHeroToCards = function (G, ctx, config) {
    if (config.drawName) {
        var heroIndex = (0, HeroHelpers_1.GetHeroIndexByName)(config.drawName), hero = G.heroes[heroIndex];
        var suitId = null;
        (0, Player_1.AddHeroCardToPlayerHeroCards)(G, ctx, hero);
        if (hero.suit) {
            (0, Player_1.AddHeroCardToPlayerCards)(G, ctx, hero);
            (0, exports.CheckAndMoveThrudOrPickHeroAction)(G, ctx, hero);
            suitId = (0, SuitHelpers_1.GetSuitIndexByName)(hero.suit);
        }
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
    }
};
exports.AddHeroToCards = AddHeroToCards;
/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var GetClosedCoinIntoPlayerHand = function (G, ctx) {
    var coinsCount = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length, tradingBoardCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex(function (coin) { return coin && coin.isTriggerTrading; }), tradingHandCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
        .findIndex(function (coin) { return coin && coin.isTriggerTrading; });
    for (var i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) ||
            (i >= G.tavernsNum && tradingHandCoinIndex !== -1) ||
            (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            (0, Coin_1.ReturnCoinToPlayerHands)(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.GetClosedCoinIntoPlayerHand = GetClosedCoinIntoPlayerHand;
/**
 * <h3>Действия, связанные с выбором героев по определённым условиям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, получаемых по определённым условиям.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string|*} INVALID_MOVE
 * @constructor
 */
var PickHeroWithConditions = function (G, ctx, config) {
    var isValidMove = false;
    for (var condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === "suitCountMin") {
                var ranks = 0;
                for (var key in config.conditions[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === "suit") {
                            var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(config.conditions[condition][key]);
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].reduce(ScoreHelpers_1.TotalRank, 0);
                        }
                        else if (key === "value") {
                            isValidMove = ranks >= config.conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.PickHeroWithConditions = PickHeroWithConditions;
/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var PickHero = function (G, ctx) {
    var playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (playerConfig) {
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u041D\u0430\u0447\u0430\u043B\u043E \u0444\u0430\u0437\u044B ".concat(playerConfig.stageName, "."));
        ctx.events.setStage(playerConfig.stageName);
    }
};
exports.PickHero = PickHero;
