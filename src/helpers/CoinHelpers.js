"use strict";
exports.__esModule = true;
exports.ResolveBoardCoins = exports.ActivateTrading = void 0;
// todo Add logging
var Coin_1 = require("../Coin");
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {boolean} Активировался ли обмен монет.
 * @constructor
 */
var ActivateTrading = function (G, ctx) {
    var _a;
    if ((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading) {
        var tradingCoins = [];
        for (var i = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            var coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
            if (coin) {
                tradingCoins.push(coin);
            }
        }
        (0, Coin_1.Trading)(G, ctx, tradingCoins);
        return true;
    }
    else {
        return false;
    }
};
exports.ActivateTrading = ActivateTrading;
/**
 * <h3>Определяет по расположению монет игроками порядок ходов и порядок обмена кристаллов приоритета.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выкладки всех монет игроками.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {{playersOrder: *[], exchangeOrder: *[]}} Массив порядка ходов игроков и порядок обмена кристаллов приоритета.
 * @constructor
 */
var ResolveBoardCoins = function (G, ctx) {
    var _a, _b;
    var playersOrder = [], coinValues = [], exchangeOrder = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        if (G.publicPlayers[i].boardCoins[G.currentTavern]) {
            var coin = G.publicPlayers[i].boardCoins[G.currentTavern];
            if (coin) {
                coinValues[i] = coin.value;
            }
            playersOrder.push(i);
        }
        exchangeOrder.push(i);
        for (var j = playersOrder.length - 1; j > 0; j--) {
            var coin = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern], prevCoin = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
            if (coin && prevCoin) {
                if (coin.value > prevCoin.value) {
                    _a = [playersOrder[j - 1], playersOrder[j]], playersOrder[j] = _a[0], playersOrder[j - 1] = _a[1];
                }
                else if (coin.value === prevCoin.value) {
                    var priority = G.publicPlayers[playersOrder[j]].priority, prevPriority = G.publicPlayers[playersOrder[j - 1]].priority;
                    if (priority && prevPriority) {
                        if (priority.value > prevPriority.value) {
                            _b = [playersOrder[j - 1], playersOrder[j]], playersOrder[j] = _b[0], playersOrder[j - 1] = _b[1];
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
    }
    var counts = {};
    for (var i = 0; i < coinValues.length; i++) {
        counts[coinValues[i]] = 1 + (counts[coinValues[i]] || 0);
    }
    var _loop_1 = function (prop) {
        if (counts[prop] <= 1) {
            return "continue";
        }
        var tiePlayers = G.publicPlayers.filter(function (player) { return player.boardCoins[G.currentTavern] &&
            player.boardCoins[G.currentTavern].value === Number(prop) && player.priority.isExchangeable; });
        var _loop_2 = function () {
            var _c;
            var tiePlayersPriorities = tiePlayers.map(function (player) { return player.priority.value; }), maxPriority = Math.max.apply(Math, tiePlayersPriorities), minPriority = Math.min.apply(Math, tiePlayersPriorities), maxIndex = G.publicPlayers.findIndex(function (player) { return player.priority.value === maxPriority; }), minIndex = G.publicPlayers.findIndex(function (player) { return player.priority.value === minPriority; });
            tiePlayers.splice(tiePlayers.findIndex(function (player) { return player.priority.value === maxPriority; }), 1);
            tiePlayers.splice(tiePlayers.findIndex(function (player) { return player.priority.value === minPriority; }), 1);
            _c = [exchangeOrder[maxIndex], exchangeOrder[minIndex]], exchangeOrder[minIndex] = _c[0], exchangeOrder[maxIndex] = _c[1];
        };
        while (tiePlayers.length > 1) {
            _loop_2();
        }
    };
    for (var prop in counts) {
        _loop_1(prop);
    }
    return { playersOrder: playersOrder, exchangeOrder: exchangeOrder };
};
exports.ResolveBoardCoins = ResolveBoardCoins;
