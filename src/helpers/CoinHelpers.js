import { Trading } from "../Coin";
// todo Add logging
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {boolean} Активировался ли обмен монет.
 * @constructor
 */
export var ActivateTrading = function (G, ctx) {
    var _a;
    if ((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading) {
        var tradingCoins = [];
        for (var i = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            var coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
            if (coin !== null) {
                tradingCoins.push(coin);
            }
        }
        Trading(G, ctx, tradingCoins);
        return true;
    }
    else {
        return false;
    }
};
/**
 * <h3>Определяет по расположению монет игроками порядок ходов и порядок обмена кристаллов приоритета.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выкладки всех монет игроками.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {{playersOrder: number[], exchangeOrder: number[]}} Порядок ходов игроков & порядок изменения ходов игроками.
 * @constructor
 */
export var ResolveBoardCoins = function (G, ctx) {
    var playersOrder = [], coinValues = [], exchangeOrder = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        if (G.publicPlayers[i].boardCoins[G.currentTavern]) {
            var coin = G.publicPlayers[i].boardCoins[G.currentTavern];
            // todo Check it
            if (coin !== null) {
                coinValues[i] = coin.value;
            }
            playersOrder.push(i);
        }
        exchangeOrder.push(i);
        for (var j = playersOrder.length - 1; j > 0; j--) {
            var coin = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern], prevCoin = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
            // todo Check it
            if (coin !== null && prevCoin !== null) {
                if (coin.value > prevCoin.value) {
                    // [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                    var temp = playersOrder[j - 1];
                    playersOrder[j - 1] = playersOrder[j];
                    playersOrder[j] = temp;
                }
                else if (coin.value === prevCoin.value) {
                    var priority = G.publicPlayers[playersOrder[j]].priority, prevPriority = G.publicPlayers[playersOrder[j - 1]].priority;
                    if (priority.value > prevPriority.value) {
                        // [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                        var temp = playersOrder[j - 1];
                        playersOrder[j - 1] = playersOrder[j];
                        playersOrder[j] = temp;
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
        var tiePlayers = G.publicPlayers.filter(function (player) { var _a; return ((_a = player.boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.value) === Number(prop) && player.priority.isExchangeable; });
        var _loop_2 = function () {
            var tiePlayersPriorities = tiePlayers.map(function (player) { return player.priority.value; }), maxPriority = Math.max.apply(Math, tiePlayersPriorities), minPriority = Math.min.apply(Math, tiePlayersPriorities), maxIndex = G.publicPlayers.findIndex(function (player) { return player.priority.value === maxPriority; }), minIndex = G.publicPlayers.findIndex(function (player) { return player.priority.value === minPriority; });
            tiePlayers.splice(tiePlayers.findIndex(function (player) {
                return player.priority.value === maxPriority;
            }), 1);
            tiePlayers.splice(tiePlayers.findIndex(function (player) {
                return player.priority.value === minPriority;
            }), 1);
            tiePlayers.splice(tiePlayers.findIndex(function (player) {
                return player.priority.value === minPriority;
            }), 1);
            // [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
            var temp = exchangeOrder[minIndex];
            exchangeOrder[minIndex] = exchangeOrder[maxIndex];
            exchangeOrder[maxIndex] = temp;
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
