import { AddDataToLog } from "./Logging";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "./helpers/StackHelpers";
import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
/**
 * <h3>Проверка, является ли объект монетой или пустым объектом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param {{} | ICoin} obj Пустой объект или монета.
 * @returns {obj is ICoin} Является ли объект монетой, а не пустым объектом.
 */
var isCoin = function (obj) { return obj.value !== undefined; };
/**
 * <h3>Создание монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет при инициализации игры.</li>
 * <li>Вызывается при создании монеты преимущества по охотникам.</li>
 * </ol>
 *.
 * @param {number} value Значение.
 * @param {boolean | undefined} isInitial Является ли базовой.
 * @param {boolean | undefined} isTriggerTrading Активирует ли обмен монет.
 * @returns {ICoin} Монета.
 * @constructor
 */
export var CreateCoin = function (_a) {
    var _b = _a === void 0 ? {} : _a, value = _b.value, _c = _b.isInitial, isInitial = _c === void 0 ? false : _c, _d = _b.isTriggerTrading, isTriggerTrading = _d === void 0 ? false : _d;
    return ({
        value: value,
        isInitial: isInitial,
        isTriggerTrading: isTriggerTrading,
    });
};
/**
 * <h3>Создание всех монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * <li>Вызывается при создании всех монет рынка.</li>
 * </ol>
 *
 * @param {IMarketCoinConfig[] | IInitialTradingCoinConfig[]} coinConfig Конфиг монет.
 * @param {IBuildCoinsOptions} options Опции создания монет.
 * @returns {ICoin[]} Массив всех монет.
 * @constructor
 */
export var BuildCoins = function (coinConfig, options) {
    var coins = [];
    for (var i = 0; i < coinConfig.length; i++) {
        var config = coinConfig[i], count = options.players !== undefined && !isInitialPlayerCoinsConfigNotMarket(config) ?
            config.count()[options.players] : 1;
        if (options.players !== undefined && options.count !== undefined) {
            options.count.push({ value: config.value });
        }
        for (var c = 0; c < count; c++) {
            coins.push(CreateCoin({
                value: config.value,
                isInitial: options.isInitial,
                isTriggerTrading: isInitialPlayerCoinsConfigNotMarket(config) ? config.isTriggerTrading : false,
            }));
        }
    }
    return coins;
};
/**
 * <h3>Вычисляет количество монет каждого номинала на рынке монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при отрисовке рынка монет.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @returns {INumberValues} Количество всех монет на рынке (с повторами).
 * @constructor
 */
export var CountMarketCoins = function (G) {
    var repeated = {};
    var _loop_1 = function (i) {
        var temp = G.marketCoinsUnique[i].value;
        repeated[temp] = G.marketCoins.filter(function (coin) { return coin.value === temp; }).length;
    };
    for (var i = 0; i < G.marketCoinsUnique.length; i++) {
        _loop_1(i);
    }
    return repeated;
};
/**
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {ICoin[]} tradingCoins Монеты для обмена.
 * @constructor
 */
export var Trading = function (G, ctx, tradingCoins) {
    var coinsValues = tradingCoins.map(function (coin) { return coin.value; }), coinsMaxValue = Math.max.apply(Math, coinsValues), coinsMinValue = Math.min.apply(Math, coinsValues);
    var stack, upgradingCoinId, upgradingCoin, coinMaxIndex = 0, coinMinIndex = 0;
    AddDataToLog(G, "game" /* GAME */, "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D \u043E\u0431\u043C\u0435\u043D \u043C\u043E\u043D\u0435\u0442 \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E ('".concat(coinsMinValue, "' \u0438 \n    '").concat(coinsMaxValue, "') \u0438\u0433\u0440\u043E\u043A\u0430 ").concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, "."));
    // TODO trading isInitial first or playerChoose?
    for (var i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
        if (tradingCoins[i].value === coinsMinValue) {
            coinMinIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin === "min") {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: coinsMaxValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        upgradingCoin = tradingCoins[coinMinIndex];
    }
    else {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: coinsMinValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        upgradingCoin = tradingCoins[coinMaxIndex];
    }
    AddActionsToStack(G, ctx, stack);
    StartActionFromStackOrEndActions(G, ctx, false, upgradingCoinId, "board", upgradingCoin.isInitial);
};
/**
 * <h3>Обмен монеты с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг обмена.
 * @param {number} upgradingCoinId Id обменной монеты.
 * @param {string} type Тип обменной монеты.
 * @param {boolean} isInitial Является ли обменная монета базовой.
 * @constructor
 */
export var UpgradeCoin = function (G, ctx, config, upgradingCoinId, type, isInitial) {
    // todo Split into different functions!
    var upgradingCoin = {}, coin;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin;
    }
    if ((config === null || config === void 0 ? void 0 : config.coin) === "min") {
        // todo Upgrade isInitial min coin or not or User must choose!?
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline") {
            var allCoins = [], allHandCoins = G.publicPlayers[Number(ctx.currentPlayer)]
                .handCoins.filter(function (coin) { return coin !== null; });
            for (var i = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] === null) {
                    allCoins.push(allHandCoins.splice(0, 1)[0]);
                }
                else {
                    allCoins.push(G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i]);
                }
            }
            var minCoinValue_1 = Math.min.apply(Math, allCoins
                .filter(function (coin) { return coin !== null && !coin.isTriggerTrading; })
                .map(function (coin) { return coin.value; })), upgradingCoinInitial = allCoins
                .find(function (coin) { return coin.value === minCoinValue_1 && coin.isInitial; });
            if (upgradingCoinInitial) {
                upgradingCoin = upgradingCoinInitial;
            }
            else {
                coin = allCoins.find(function (coin) { return coin.value === minCoinValue_1 && !coin.isInitial; });
                if (coin) {
                    upgradingCoin = coin;
                }
            }
            upgradingCoinId = allCoins.findIndex(function (coin) {
                return isCoin(upgradingCoin) && coin.value === upgradingCoin.value;
            });
        }
        else {
            var minCoinValue_2 = Math.min.apply(Math, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                .filter(function (coin) { return coin !== null && !coin.isTriggerTrading; })
                .map(function (coin) { return coin.value; }));
            coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                .find(function (coin) { return (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue_2; });
            if (coin) {
                upgradingCoin = coin;
                upgradingCoinId = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                    .findIndex(function (coin) { return isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) ===
                    upgradingCoin.value; });
            }
        }
    }
    else if (type === "hand") {
        var handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter(function (coin, index) { return coin === null && index <= upgradingCoinId; }).length;
        coin = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter(function (coin) { return coin !== null; })[handCoinPosition - 1];
        if (coin) {
            upgradingCoin = coin;
            upgradingCoinId = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
                .findIndex(function (coin) {
                return isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === isInitial;
            });
        }
    }
    else {
        coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId];
        if (coin) {
            upgradingCoin = coin;
        }
    }
    if (isCoin(upgradingCoin)) {
        var buffValue = G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeCoin ?
            G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeCoin : 0;
        var newValue = 0;
        if (config.value !== undefined) {
            newValue = upgradingCoin.value + config.value + buffValue;
        }
        var upgradedCoin = null;
        if (G.marketCoins.length) {
            if (newValue > G.marketCoins[G.marketCoins.length - 1].value) {
                upgradedCoin = G.marketCoins[G.marketCoins.length - 1];
                G.marketCoins.splice(G.marketCoins.length - 1, 1);
            }
            else {
                for (var i = 0; i < G.marketCoins.length; i++) {
                    if (G.marketCoins[i].value < newValue) {
                        upgradedCoin = G.marketCoins[i];
                    }
                    else if (G.marketCoins[i].value >= newValue) {
                        upgradedCoin = G.marketCoins[i];
                        G.marketCoins.splice(i, 1);
                        break;
                    }
                    if (i === G.marketCoins.length - 1) {
                        G.marketCoins.splice(i, 1);
                    }
                }
            }
        }
        AddDataToLog(G, "game" /* GAME */, "\u041D\u0430\u0447\u0430\u0442\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u043E\u043D\u0435\u0442\u044B \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '".concat(upgradingCoin.value, "' \n        \u043D\u0430 +").concat(config.value, "."));
        if (upgradedCoin !== null) {
            AddDataToLog(G, "private" /* PRIVATE */, "\u041D\u0430\u0447\u0430\u0442\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u043E\u043D\u0435\u0442\u044B c ID '".concat(upgradingCoinId, "' \u0441 \u0442\u0438\u043F\u043E\u043C \n            '").concat(type, "' \u0441 initial '").concat(isInitial, "' \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '").concat(upgradingCoin.value, "' \u043D\u0430 +").concat(config.value, " \u0441 \n            \u043D\u043E\u0432\u044B\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C '").concat(newValue, "' \u0441 \u0438\u0442\u043E\u0433\u043E\u0432\u044B\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C '").concat(upgradedCoin.value, "'."));
            var handCoinIndex = -1;
            if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] === null) {
                handCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
                    .findIndex(function (coin) {
                    return isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value;
                });
            }
            else {
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] = null;
            }
            if ((ctx.activePlayers && ctx.activePlayers[Number(ctx.currentPlayer)]) === "placeTradingCoinsUline") {
                var emptyCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.indexOf(null);
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[emptyCoinIndex] = upgradedCoin;
            }
            else {
                if (handCoinIndex === -1) {
                    G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] = upgradedCoin;
                    AddDataToLog(G, "public" /* PUBLIC */, "\u041C\u043E\u043D\u0435\u0442\u0430 \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '".concat(upgradedCoin.value, "' \u0432\u0435\u0440\u043D\u0443\u043B\u0430\u0441\u044C \n                    \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430 \n                ").concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, "."));
                }
                else {
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinIndex] = upgradedCoin;
                    AddDataToLog(G, "public" /* PUBLIC */, "\u041C\u043E\u043D\u0435\u0442\u0430 \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '".concat(upgradedCoin.value, "' \u0432\u0435\u0440\u043D\u0443\u043B\u0430\u0441\u044C \n                    \u043D\u0430 \u0440\u0443\u043A\u0443 \u0438\u0433\u0440\u043E\u043A\u0430 \n                ").concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, "."));
                }
            }
            if (!upgradingCoin.isInitial) {
                var returningIndex = 0;
                for (var i = 0; i < G.marketCoins.length; i++) {
                    returningIndex = i;
                    if (G.marketCoins[i].value > upgradingCoin.value) {
                        break;
                    }
                }
                G.marketCoins.splice(returningIndex, 0, upgradingCoin);
                AddDataToLog(G, "game" /* GAME */, "\u041C\u043E\u043D\u0435\u0442\u0430 \u0441 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '".concat(upgradingCoin.value, "' \n                \u0432\u0435\u0440\u043D\u0443\u043B\u0430\u0441\u044C \u043D\u0430 \u0440\u044B\u043D\u043E\u043A."));
            }
        }
        else {
            AddDataToLog(G, "private" /* PRIVATE */, "На рынке монет нет доступных монет для обмена.");
        }
    }
};
/**
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @constructor
 */
export var ReturnCoinsToPlayerHands = function (G) {
    for (var i = 0; i < G.publicPlayers.length; i++) {
        for (var j = 0; j < G.publicPlayers[i].boardCoins.length; j++) {
            var isCoinReturned = ReturnCoinToPlayerHands(G.publicPlayers[i], j);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, "game" /* GAME */, "Все монеты вернулись в руки игроков.");
};
/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
 *
 * @param {IPublicPlayer} player Игрок.
 * @param {number} coinId Id монеты.
 * @returns {boolean} Вернулась ли монета в руку.
 * @constructor
 */
export var ReturnCoinToPlayerHands = function (player, coinId) {
    var tempCoinId = player.handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    player.handCoins[tempCoinId] = player.boardCoins[coinId];
    player.boardCoins[coinId] = null;
    return true;
};
