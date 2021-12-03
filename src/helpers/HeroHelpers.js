"use strict";
exports.__esModule = true;
exports.CheckAndStartUlineActionsOrContinue = exports.StartThrudMoving = exports.CheckAndMoveThrud = exports.GetHeroIndexByName = void 0;
var HeroData_1 = require("../data/HeroData");
var SuitHelpers_1 = require("./SuitHelpers");
var StackHelpers_1 = require("./StackHelpers");
/**
 * <h3>Вычисляет индекс указанного героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретного героя.</li>
 * </ol>
 *
 * @param heroName Название героя.
 * @returns {number} Индекс героя.
 * @constructor
 */
var GetHeroIndexByName = function (heroName) { return Object.keys(HeroData_1.heroesConfig).indexOf(heroName); };
exports.GetHeroIndexByName = GetHeroIndexByName;
/**
 * <h3>Проверяет нужно ли перемещать героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns {boolean} Нужно ли перемещать героя Труд.
 * @constructor
 */
var CheckAndMoveThrud = function (G, ctx, card) {
    if (card.suit) {
        var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(card.suit), index = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].findIndex(function (card) {
            return card.name === "Thrud";
        });
        if (index !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};
exports.CheckAndMoveThrud = CheckAndMoveThrud;
/**
 * <h3>Перемещение героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока и требуется переместить героя Труд.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @constructor
 */
var StartThrudMoving = function (G, ctx, card) {
    var variants = {
        blacksmith: {
            suit: "blacksmith",
            rank: 1,
            points: null
        },
        hunter: {
            suit: "hunter",
            rank: 1,
            points: null
        },
        explorer: {
            suit: "explorer",
            rank: 1,
            points: null
        },
        warrior: {
            suit: "warrior",
            rank: 1,
            points: null
        },
        miner: {
            suit: "miner",
            rank: 1,
            points: null
        }
    }, stack = [
        {
            actionName: "DrawProfitAction",
            variants: variants,
            config: {
                drawName: "Thrud",
                name: "placeCards",
                stageName: "placeCards",
                suit: card.suit
            }
        },
        {
            actionName: "PlaceThrudAction",
            variants: variants
        },
    ];
    (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
};
exports.StartThrudMoving = StartThrudMoving;
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {string|boolean}
 * @constructor
 */
var CheckAndStartUlineActionsOrContinue = function (G, ctx) {
    // todo Rework it all!
    var ulinePlayerIndex = G.publicPlayers.findIndex(function (player) { return player.buffs.everyTurn === "Uline"; });
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers[ctx.currentPlayer] !== "placeTradingCoinsUline" &&
            ulinePlayerIndex === Number(ctx.currentPlayer)) {
            var coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
            if (coin) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern] && coin.isTriggerTrading) {
                    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.filter(function (coin, index) {
                        return index >= G.tavernsNum && coin === null;
                    })) {
                        G.actionsNum = G.suitsNum - G.tavernsNum;
                        ctx.events.setStage("placeTradingCoinsUline");
                        return "placeTradingCoinsUline";
                    }
                }
            }
        }
        else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline" &&
            !G.actionsNum) {
            ctx.events.endStage();
            return "endPlaceTradingCoinsUline";
        }
        else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline" &&
            G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        }
        else {
            return "placeCoinsUline";
        }
    }
    else if (ctx.phase !== "pickCards") {
        ctx.events.setPhase("pickCards");
    }
    return false;
};
exports.CheckAndStartUlineActionsOrContinue = CheckAndStartUlineActionsOrContinue;
