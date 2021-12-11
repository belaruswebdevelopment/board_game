import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
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
 * @param {ICheckMoveParam} obj Параметры валидации мува.
 * @returns {boolean} Валидный ли мув.
 * @constructor
 */
export var IsValidMove = function (obj) {
    return CheckMove(obj);
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {object | null | undefined} obj
 * @param {number} objId
 * @param {number[] | undefined} range
 * @param {number[] | undefined} values
 * @returns {boolean} Валидный ли мув.
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
 * @param {number} num
 * @param {number[]} range
 * @returns {boolean}
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
 * @param {number} num
 * @param {number[]} values
 * @returns {boolean}
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId
 * @param {string} type
 * @returns {boolean}
 * @constructor
 */
export var CoinUpgradeValidation = function (G, ctx, coinId, type) {
    var _a, _b;
    if (type === "hand") {
        var handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter(function (coin, index) { return coin === null && index <= coinId; }).length;
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
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{placeCoins: {default1: string, default2: string, default_advanced: string}, placeCoinsUline: {}, getMjollnirProfit: {}, null: {}, brisingamensEndGame: {}, pickCards: {default: string, discardSuitCard: string, upgradeCoin: string, defaultPickCampCard: string, pickHero: string}, getDistinctions: {default: string, upgradeCoin: string, pickDistinctionCard: string}, endTier: {pickHero: string}, enlistmentMercenaries: {upgradeCoin: string, pickHero: string}}}
 */
export var moveBy = {
    null: {},
    placeCoins: {
        default1: "ClickHandCoin",
        default2: "ClickBoardCoin",
        default_advanced: "BotsPlaceAllCoins",
    },
    pickCards: {
        default: "ClickCard",
        defaultPickCampCard: "ClickCampCard",
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
        discardSuitCard: "discardSuitCard"
    },
    getDistinctions: {
        default: "ClickDistinctionCard",
        pickDistinctionCard: "ClickCardToPickDistinction",
        upgradeCoin: "ClickCoinToUpgrade",
    },
    endTier: {
        pickHero: "ClickHeroCard",
    },
    enlistmentMercenaries: {
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
    },
    placeCoinsUline: {},
    getMjollnirProfit: {},
    brisingamensEndGame: {},
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{ClickDistinctionCard: {getRange: ({G}: IMoveValidatorParams) => [number, number], validate: ({G, ctx, id}: IMoveValidatorParams) => boolean}, ClickCoinToUpgrade: {getRange: ({G, ctx}: IMoveValidatorParams) => [number, number], validate: ({G, ctx, id, type}: IMoveValidatorParams) => boolean}, ClickCardToPickDistinction: {getRange: () => [number, number], validate: () => boolean}, ClickCampCard: {getRange: ({G}: IMoveValidatorParams) => [number, number], validate: ({G, ctx}: IMoveValidatorParams) => boolean}, ClickHandCoin: {getRange: ({G, ctx}: IMoveValidatorParams) => [number, number], validate: ({G, ctx, id}: IMoveValidatorParams) => boolean}, BotsPlaceAllCoins: {getValue: ({G, id}: IMoveValidatorParams) => number[], getRange: ({G}: IMoveValidatorParams) => [number, number], validate: () => boolean}, ClickHeroCard: {getRange: ({G}: IMoveValidatorParams) => [number, number], validate: ({G, ctx, id}: IMoveValidatorParams) => boolean}, ClickBoardCoin: {getRange: ({G, ctx}: IMoveValidatorParams) => [number, number], validate: ({G, ctx, id}: IMoveValidatorParams) => boolean}}}
 */
export var moveValidators = {
    // todo Add all validators to all moves
    ClickHandCoin: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0, G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'id'.");
            return false;
        },
    },
    ClickBoardCoin: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
            }
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'id'.");
            return false;
        },
    },
    BotsPlaceAllCoins: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.botData.allCoinsOrder.length]);
        },
        getValue: function (_a) {
            var G = _a.G, id = _a.id;
            if (id !== undefined) {
                return G.botData.allCoinsOrder[id];
            }
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'id'.");
            // todo Return []???
            return [];
        },
        validate: function () { return true; },
    },
    ClickHeroCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.heroes.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            if (id !== undefined) {
                var isValid = G.heroes[id].active;
                // todo Add validators to others heroes
                if (G.heroes[id].name === "Hourya") {
                    var config = G.heroes[id].stack[0].config;
                    if ((config === null || config === void 0 ? void 0 : config.conditions) !== undefined) {
                        var suitId = GetSuitIndexByName(config.conditions.suitCountMin.suit);
                        if (suitId !== -1) {
                            isValid =
                                G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].reduce(TotalRank, 0) >=
                                    config.conditions.suitCountMin.value;
                            return isValid;
                        }
                        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0430\u044F \u0444\u0440\u0430\u043A\u0446\u0438\u044F \n                        ".concat(config.conditions.suitCountMin.suit, "."));
                    }
                    else {
                        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 stack[0] \u0443 \n                        \u0433\u0435\u0440\u043E\u044F ".concat(G.heroes[id].name, "."));
                    }
                    return false;
                }
                return isValid;
            }
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'id'.");
            return false;
        },
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgrade: {
        getRange: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return ([0, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id, type = _a.type;
            if (id !== undefined && type !== undefined) {
                return CoinUpgradeValidation(G, ctx, id, type);
            }
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'id' \u0438\u043B\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \n            \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'type'.");
            return false;
        },
    },
    ClickCardToPickDistinction: {
        getRange: function () { return ([0, 3]); },
        validate: function () { return true; },
    },
    ClickDistinctionCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.distinctions.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx, id = _a.id;
            if (id !== undefined) {
                return G.distinctions.indexOf(Number(ctx.currentPlayer)) === id;
            }
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'id'.");
            return false;
        }
    },
    ClickCampCard: {
        getRange: function (_a) {
            var G = _a.G;
            return ([0, G.camp.length]);
        },
        validate: function (_a) {
            var G = _a.G, ctx = _a.ctx;
            return G.expansions.thingvellir.active
                && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
                    || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
        },
    },
};
