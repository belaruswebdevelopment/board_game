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
    const playersOrderNumbers = [], coinValues = [], exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI !== undefined) {
            const coin = playerI.boardCoins[G.currentTavern];
            if (coin !== undefined) {
                if (IsCoin(coin)) {
                    coinValues[i] = coin.value;
                    playersOrderNumbers.push(i);
                    exchangeOrder.push(i);
                }
                for (let j = playersOrderNumbers.length - 1; j > 0; j--) {
                    const playersOrderNumberCur = playersOrderNumbers[j], playersOrderNumberPrev = playersOrderNumbers[j - 1];
                    if (playersOrderNumberCur !== undefined && playersOrderNumberPrev !== undefined) {
                        const playerCur = G.publicPlayers[playersOrderNumberCur], playerPrev = G.publicPlayers[playersOrderNumberPrev];
                        if (playerCur !== undefined && playerPrev !== undefined) {
                            const coin = playerCur.boardCoins[G.currentTavern], prevCoin = playerPrev.boardCoins[G.currentTavern];
                            if (coin !== undefined && prevCoin !== undefined) {
                                if (IsCoin(coin) && IsCoin(prevCoin)) {
                                    // TODO Move same logic 1place: [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumberPrev, playersOrderNumberCur]
                                    if (coin.value > prevCoin.value) {
                                        [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumberPrev, playersOrderNumberCur];
                                    }
                                    else if (coin.value === prevCoin.value) {
                                        const priority = playerCur.priority, prevPriority = playerPrev.priority;
                                        if (priority.value > prevPriority.value) {
                                            [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumberPrev, playersOrderNumberCur];
                                        }
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                            else {
                                throw new Error(`В массиве монет игроков ${playersOrderNumberCur} и/или ${playersOrderNumberPrev} на столе отсутствует монета в позиции ${G.currentTavern}.`);
                            }
                        }
                        else {
                            throw new Error(`В массиве игроков отсутствует игроки ${playersOrderNumberCur} и/или ${playersOrderNumberPrev}.`);
                        }
                    }
                    else {
                        throw new Error(`В массиве порядка хода игроков отсутствуют ${j} и/или ${j - 1}.`);
                    }
                }
            }
            else {
                throw new Error(`В массиве монет игрока ${i} на столе отсутствует монета в позиции ${G.currentTavern}.`);
            }
        }
        else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
    }
    const counts = {};
    for (let i = 0; i < coinValues.length; i++) {
        const coinValue = coinValues[i];
        if (coinValue !== undefined) {
            counts[coinValue] = 1 + (counts[coinValue] || 0);
        }
        else {
            throw new Error(`В массиве значений монет отсутствует ${i}.`);
        }
    }
    for (const prop in counts) {
        if (Object.prototype.hasOwnProperty.call(counts, prop)) {
            const value = counts[prop];
            if (value !== undefined) {
                if (value <= 1) {
                    continue;
                }
            }
            else {
                throw new Error(`В массиве значений монет отсутствует ${prop}.`);
            }
            const tiePlayers = G.publicPlayers.filter((player) => { var _a; return ((_a = player.boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.value) === Number(prop) && player.priority.isExchangeable; });
            while (tiePlayers.length > 1) {
                const tiePlayersPriorities = tiePlayers.map((player) => player.priority.value), maxPriority = Math.max(...tiePlayersPriorities), minPriority = Math.min(...tiePlayersPriorities), maxIndex = G.publicPlayers.findIndex((player) => player.priority.value === maxPriority), minIndex = G.publicPlayers.findIndex((player) => player.priority.value === minPriority);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === maxPriority), 1);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
                const exchangeOrderMax = exchangeOrder[maxIndex], exchangeOrderMin = exchangeOrder[minIndex];
                if (exchangeOrderMax !== undefined && exchangeOrderMin !== undefined) {
                    [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrderMax, exchangeOrderMin];
                }
                else {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует ${exchangeOrder[maxIndex]} и/или ${exchangeOrder[minIndex]}.`);
                }
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