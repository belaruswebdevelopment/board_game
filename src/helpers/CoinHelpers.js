import { Trading } from "../Coin";
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Активировался ли обмен монет.
 */
export const ActivateTrading = (G, ctx) => {
    var _a;
    if ((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
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
 * <h3>Находит максимальную монету игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, если пикнут герой Astrid.</li>
 * <li>В конце игры, если получено преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Максимальная монета игрока.
 */
export const GetMaxCoinValue = (player) => (Math.max(...player.boardCoins
    .filter((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.value))
    .map((coin) => coin.value), ...player.handCoins.filter((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.value))
    .map((coin) => coin.value)));
/**
 * <h3>Определяет по расположению монет игроками порядок ходов и порядок обмена кристаллов приоритета.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выкладки всех монет игроками.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Порядок ходов игроков & порядок изменения ходов игроками.
 */
export const ResolveBoardCoins = (G, ctx) => {
    const playersOrder = [], coinValues = [], exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const coin = G.publicPlayers[i].boardCoins[G.currentTavern];
        if (coin !== null) {
            coinValues[i] = coin.value;
            playersOrder.push(i);
            exchangeOrder.push(i);
        }
        for (let j = playersOrder.length - 1; j > 0; j--) {
            const coin = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern], prevCoin = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
            if (coin !== null && prevCoin !== null) {
                if (coin.value > prevCoin.value) {
                    [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                }
                else if (coin.value === prevCoin.value) {
                    const priority = G.publicPlayers[playersOrder[j]].priority, prevPriority = G.publicPlayers[playersOrder[j - 1]].priority;
                    if (priority.value > prevPriority.value) {
                        [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                    }
                }
                else {
                    break;
                }
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
        const tiePlayers = G.publicPlayers.filter((player) => { var _a; return ((_a = player.boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.value) === Number(prop) && player.priority.isExchangeable; });
        while (tiePlayers.length > 1) {
            const tiePlayersPriorities = tiePlayers.map((player) => player.priority.value), maxPriority = Math.max(...tiePlayersPriorities), minPriority = Math.min(...tiePlayersPriorities), maxIndex = G.publicPlayers.findIndex((player) => player.priority.value === maxPriority), minIndex = G.publicPlayers.findIndex((player) => player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
        }
    }
    return { playersOrder, exchangeOrder };
};
