// todo Add logging
import {Trading} from "../Coin";

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
export const ActivateTrading = (G, ctx) => {
    if (G.players[ctx.currentPlayer].boardCoins[G.currentTavern]?.isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
            tradingCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
        }
        Trading(G, ctx, tradingCoins);
        return true;
    } else {
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
 * @param G
 * @param ctx
 * @returns {{playersOrder: *[], exchangeOrder: *[]}} Массив порядка ходов игроков и порядок обмена кристаллов приоритета.
 * @constructor
 */
export const ResolveBoardCoins = (G, ctx) => {
    const playersOrder = [],
        coinValues = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (G.players[i].boardCoins[G.currentTavern]) {
            coinValues[i] = G.players[i].boardCoins[G.currentTavern].value;
            playersOrder.push(i);
        }
        exchangeOrder.push(i);
        for (let j = playersOrder.length - 1; j > 0; j--) {
            if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value >
                G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
                [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
            } else if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value ===
                G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
                if (G.players[playersOrder[j]].priority.value > G.players[playersOrder[j - 1]].priority.value) {
                    [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                }
            } else {
                break;
            }
        }
    }
    const counts = {};
    for (let i = 0; i < coinValues.length; i++) {
        counts[coinValues[i]] = 1 + (counts[coinValues[i]] || 0);
    }
    for (let prop in counts) {
        if (counts[prop] <= 1) {
            continue;
        }
        const tiePlayers = G.players.filter(player => player.boardCoins[G.currentTavern] &&
            player.boardCoins[G.currentTavern].value === Number(prop) && player.priority.isExchangeable);
        while (tiePlayers.length > 1) {
            const tiePlayersPriorities = tiePlayers.map(player => player.priority.value),
                maxPriority = Math.max(...tiePlayersPriorities),
                minPriority = Math.min(...tiePlayersPriorities),
                maxIndex = G.players.findIndex(player => player.priority.value === maxPriority),
                minIndex = G.players.findIndex(player => player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex(player => player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex(player => player.priority.value === minPriority), 1);
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
        }
    }
    return {playersOrder, exchangeOrder};
};
