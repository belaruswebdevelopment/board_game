import { IsCoin } from "../Coin";
/**
 * <h3>Находит максимальную монету игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, если выбран герой Астрид.</li>
 * <li>В конце игры, если получено преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Максимальная монета игрока.
 */
export const GetMaxCoinValue = (player) => (Math.max(...player.boardCoins.filter((coin) => IsCoin(coin)).map((coin) => coin.value), ...player.handCoins.filter((coin) => IsCoin(coin)).map((coin) => coin.value)));
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
    var _a;
    const playersOrderNumbers = [], coinValues = [], exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
        const coin = playerI.boardCoins[G.currentTavern];
        if (coin !== undefined) {
            if (IsCoin(coin)) {
                coinValues[i] = coin.value;
                playersOrderNumbers.push(i);
                exchangeOrder.push(i);
            }
            for (let j = playersOrderNumbers.length - 1; j > 0; j--) {
                const playersOrderNumberCur = playersOrderNumbers[j], playersOrderNumberPrev = playersOrderNumbers[j - 1];
                if (playersOrderNumberCur === undefined || playersOrderNumberPrev === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствуют ${j} и/или ${j - 1}.`);
                }
                const playerCur = G.publicPlayers[playersOrderNumberCur], playerPrev = G.publicPlayers[playersOrderNumberPrev];
                if (playerCur === undefined || playerPrev === undefined) {
                    throw new Error(`В массиве игроков отсутствует игроки ${playersOrderNumberCur} и/или ${playersOrderNumberPrev}.`);
                }
                const coin = playerCur.boardCoins[G.currentTavern], prevCoin = playerPrev.boardCoins[G.currentTavern];
                if (coin === undefined || prevCoin === undefined) {
                    throw new Error(`В массиве монет игроков ${playersOrderNumberCur} и/или ${playersOrderNumberPrev} на столе отсутствует монета в позиции ${G.currentTavern}.`);
                }
                if (IsCoin(coin) && IsCoin(prevCoin)) {
                    // TODO Move same logic 1place: [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumberPrev, playersOrderNumberCur]
                    if (coin.value > prevCoin.value) {
                        [playersOrderNumbers[j], playersOrderNumbers[j - 1]] =
                            [playersOrderNumberPrev, playersOrderNumberCur];
                    }
                    else if (coin.value === prevCoin.value) {
                        const priority = playerCur.priority, prevPriority = playerPrev.priority;
                        if (priority.value > prevPriority.value) {
                            [playersOrderNumbers[j], playersOrderNumbers[j - 1]] =
                                [playersOrderNumberPrev, playersOrderNumberCur];
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else {
            throw new Error(`В массиве монет игрока ${i} на столе отсутствует монета в позиции ${G.currentTavern}.`);
        }
    }
    const counts = {};
    for (let i = 0; i < coinValues.length; i++) {
        const coinValue = coinValues[i];
        if (coinValue !== undefined) {
            const value = (_a = counts[coinValue]) !== null && _a !== void 0 ? _a : 0;
            counts[coinValue] = 1 + value;
        }
    }
    for (const prop in counts) {
        if (Object.prototype.hasOwnProperty.call(counts, prop)) {
            const value = counts[prop];
            if (value === undefined) {
                throw new Error(`В массиве значений монет отсутствует ${prop}.`);
            }
            if (value <= 1) {
                continue;
            }
            const tiePlayers = G.publicPlayers.filter((player) => {
                const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
                if (boardCoinCurrentTavern === undefined) {
                    throw new Error(`В массиве монет игрока отсутствует монета текущей таверны ${G.currentTavern}.`);
                }
                return (boardCoinCurrentTavern === null || boardCoinCurrentTavern === void 0 ? void 0 : boardCoinCurrentTavern.value) === Number(prop) && player.priority.isExchangeable;
            });
            while (tiePlayers.length > 1) {
                const tiePlayersPriorities = tiePlayers.map((player) => player.priority.value), maxPriority = Math.max(...tiePlayersPriorities), minPriority = Math.min(...tiePlayersPriorities), maxIndex = G.publicPlayers.findIndex((player) => player.priority.value === maxPriority), minIndex = G.publicPlayers.findIndex((player) => player.priority.value === minPriority);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === maxPriority), 1);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
                const exchangeOrderMax = exchangeOrder[maxIndex], exchangeOrderMin = exchangeOrder[minIndex];
                if (exchangeOrderMax === undefined || exchangeOrderMin === undefined) {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует ${exchangeOrder[maxIndex]} и/или ${exchangeOrder[minIndex]}.`);
                }
                [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrderMax, exchangeOrderMin];
            }
        }
    }
    const playersOrder = playersOrderNumbers.map((index) => String(index));
    return {
        playersOrder,
        exchangeOrder,
    };
};
//# sourceMappingURL=CoinHelpers.js.map