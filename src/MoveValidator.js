"use strict";
exports.__esModule = true;
exports.moveValidators = exports.moveBy = exports.CoinUpgradeValidation = exports.IsValidMove = void 0;
var SuitHelpers_1 = require("./helpers/SuitHelpers");
var ScoreHelpers_1 = require("./helpers/ScoreHelpers");
/**
 * Validates arguments inside of move.
 * obj - object to validate.
 * objId - Id of object.
 * range - range for Id.
 * values - values for Id.
 */
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param args
 * @constructor
 */
var IsValidMove = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var isValid = true;
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var item = args_1[_a];
        isValid = isValid && CheckMove(item);
        if (!isValid) {
            break;
        }
    }
    return isValid;
};
exports.IsValidMove = IsValidMove;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param obj
 * @param objId
 * @param range
 * @param values
 * @constructor
 */
var CheckMove = function (_a) {
    var obj = _a.obj, objId = _a.objId, _b = _a.range, range = _b === void 0 ? [] : _b, _c = _a.values, values = _c === void 0 ? [] : _c;
    var isValid = obj !== null;
    if (range.length === 2) {
        isValid = isValid && ValidateByRange(objId, range);
    }
    else if (values.length > 0) {
        isValid = isValid && ValidateByValues(objId, values);
    }
    return isValid;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param num
 * @param range
 * @constructor
 */
var ValidateByRange = function (num, range) { return range[0] <= num && num < range[1]; };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @constructor
 */
var ValidateByValues = function (num, values) { return values.includes(num); };
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
 * @param coinId
 * @param type
 * @constructor
 */
var CoinUpgradeValidation = function (G, ctx, coinId, type) {
    var _a, _b;
    if (type === "hand") {
        var handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)]
            .boardCoins.filter(function (coin, index) { return coin === null && index <= coinId; }).length;
        if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter(function (coin) { return coin !== null; })[handCoinPosition - 1]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
            return true;
        }
    }
    else {
        if (!((_b = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
            return true;
        }
    }
    return false;
};
exports.CoinUpgradeValidation = CoinUpgradeValidation;
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 */
exports.moveBy = {
    "null": {},
    placeCoins: {
        default1: "ClickHandCoin",
        default2: "ClickBoardCoin",
        default_advanced: "BotsPlaceAllCoins"
    },
    pickCards: {
        "default": "ClickCard",
        defaultPickCampCard: "ClickCampCard",
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
        discardSuitCard: "discardSuitCard"
    },
    getDistinctions: {
        "default": "ClickDistinctionCard",
        pickDistinctionCard: "ClickCardToPickDistinction",
        upgradeCoin: "ClickCoinToUpgrade"
    },
    endTier: {
        pickHero: "ClickHeroCard"
    },
    enlistmentMercenaries: {
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade"
    },
    placeCoinsUline: {},
    getMjollnirProfit: {},
    brisingamensEndGame: {}
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 */
exports.moveValidators = {
    // todo Add all validators to all moves
    ClickHandCoin: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0,
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined &&
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
        }
    },
    ClickBoardCoin: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined &&
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
        }
    },
    BotsPlaceAllCoins: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.botData.allCoinsOrder.length]);
        },
        getValue: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            return G.botData.allCoinsOrder[id];
        },
        validate: function () { return true; }
    },
    ClickHeroCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.heroes.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            var isValid = G.heroes[id].active;
            // todo Add validators to others heroes
            if (G.heroes[id].name === "Hourya") {
                var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(G.heroes[id].stack[0].config.conditions.suitCountMin.suit);
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].reduce(ScoreHelpers_1.TotalRank, 0) >=
                    G.heroes[id].stack[0].config.conditions.suitCountMin.value;
            }
            return isValid;
        }
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgrade: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0,
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id, type = _a.type;
            return (0, exports.CoinUpgradeValidation)(G, ctx, id, type);
        }
    },
    ClickCardToPickDistinction: {
        getRange: function () { return ([0, 3]); },
        validate: function () { return true; }
    },
    ClickDistinctionCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.distinctions.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            return G.distinctions.indexOf(Number(ctx.currentPlayer)) === id;
        }
    },
    ClickCampCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.camp.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return G.expansions.thingvellir.active &&
                (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
                    (!G.campPicked && G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp));
        }
    }
};
