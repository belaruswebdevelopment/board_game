import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { IsMultiplayer } from "./MultiplayerHelpers";
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
export const GetMaxCoinValue = (G, playerId) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    let handCoins;
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    return Math.max(...player.boardCoins.filter((coin) => IsCoin(coin)).map((coin) => coin.value), ...handCoins.filter((coin) => IsCoin(coin)).map((coin) => coin.value));
};
export const OpenClosedCoinsOnPlayerBoard = (G, playerId) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    for (let j = 0; j < player.boardCoins.length; j++) {
        const privateBoardCoin = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerId}' на поле отсутствует монета с id '${j}'.`);
        }
        if (multiplayer) {
            if (IsCoin(privateBoardCoin)) {
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                player.boardCoins[j] = privateBoardCoin;
            }
        }
        const publicBoardCoin = player.boardCoins[j];
        if (publicBoardCoin === undefined) {
            throw new Error(`В массиве монет публичного игрока с id '${playerId}' на поле отсутствует монета с id '${j}'.`);
        }
        if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
            throw new Error(`В массиве монет публичного игрока с id '${playerId}' на поле не может быть закрыта монета с id '${j}'.`);
        }
        if (IsCoin(publicBoardCoin)) {
            if (!publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
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
 * @returns Порядок ходов игроков & порядок изменения ходов игроками.
 */
export const ResolveBoardCoins = (G, ctx) => {
    var _a;
    const playersOrderNumbers = [], coinValues = [], exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        const coin = playerI.boardCoins[G.currentTavern];
        if (coin !== undefined) {
            exchangeOrder.push(i);
            if (IsCoin(coin)) {
                coinValues[i] = coin.value;
                playersOrderNumbers.push(i);
            }
            for (let j = playersOrderNumbers.length - 1; j > 0; j--) {
                const playersOrderNumberCur = playersOrderNumbers[j], playersOrderNumberPrev = playersOrderNumbers[j - 1];
                if (playersOrderNumberCur === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует текущий с id '${j}'.`);
                }
                if (playersOrderNumberPrev === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует предыдущий с id '${j - 1}'.`);
                }
                const playerCur = G.publicPlayers[playersOrderNumberCur], playerPrev = G.publicPlayers[playersOrderNumberPrev];
                if (playerCur === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок с id '${playersOrderNumberCur}'.`);
                }
                if (playerPrev === undefined) {
                    throw new Error(`В массиве игроков отсутствует предыдущий игрок с id '${playersOrderNumberPrev}'.`);
                }
                const coin = playerCur.boardCoins[G.currentTavern], prevCoin = playerPrev.boardCoins[G.currentTavern];
                if (coin === undefined) {
                    throw new Error(`В массиве монет текущего игрока с id '${playersOrderNumberCur}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
                }
                if (prevCoin === undefined) {
                    throw new Error(`В массиве монет предыдущего игрока с id '${playersOrderNumberPrev}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
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
            throw new Error(`В массиве монет игрока с id '${i}' на столе отсутствует монета в позиции с id '${G.currentTavern}'.`);
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
                throw new Error(`В массиве значений монет отсутствует с id '${prop}'.`);
            }
            if (value <= 1) {
                continue;
            }
            const tiePlayers = Object.values(G.publicPlayers).filter((player, index) => {
                const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
                if (boardCoinCurrentTavern === undefined) {
                    throw new Error(`В массиве монет игрока с id '${index}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
                }
                return (boardCoinCurrentTavern === null || boardCoinCurrentTavern === void 0 ? void 0 : boardCoinCurrentTavern.value) === Number(prop) && player.priority.isExchangeable;
            });
            while (tiePlayers.length > 1) {
                const tiePlayersPriorities = tiePlayers.map((player) => player.priority.value), maxPriority = Math.max(...tiePlayersPriorities), minPriority = Math.min(...tiePlayersPriorities), maxIndex = Object.values(G.publicPlayers).findIndex((player) => player.priority.value === maxPriority), minIndex = Object.values(G.publicPlayers).findIndex((player) => player.priority.value === minPriority);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === maxPriority), 1);
                tiePlayers.splice(tiePlayers.findIndex((player) => player.priority.value === minPriority), 1);
                const exchangeOrderMax = exchangeOrder[maxIndex], exchangeOrderMin = exchangeOrder[minIndex];
                if (exchangeOrderMax === undefined) {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует максимальная '${exchangeOrder[maxIndex]}' с id '${maxIndex}'.`);
                }
                if (exchangeOrderMin === undefined) {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует минимальная '${exchangeOrder[minIndex]}'  с id '${minIndex}'.`);
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
export const ReturnCoinsToPlayerBoard = (G, playerId) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    let handCoins;
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            const tempCoinId = player.boardCoins.indexOf(null);
            if (tempCoinId !== -1) {
                if (multiplayer) {
                    privatePlayer.boardCoins[tempCoinId] = handCoin;
                }
                player.boardCoins[tempCoinId] = handCoin;
                handCoins[i] = null;
            }
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
 * @param G
 * @param ctx
 */
export const ReturnCoinsToPlayerHands = (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
            for (let j = 0; j < player.handCoins.length; j++) {
                const handCoin = player.handCoins[j];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${i}' в руке отсутствует монета с id '${j}'.`);
                }
                if (IsCoin(handCoin) && handCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(handCoin, false);
                }
            }
        }
        for (let j = 0; j < player.boardCoins.length; j++) {
            const isCoinReturned = ReturnCoinToPlayerHands(G, i, j, true);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Все монеты вернулись в руки игроков.`);
};
/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id игрока.
 * @param coinId Id монеты.
 * @param close Нужно ли закрыть монету.
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = (G, playerId, coinId, close) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    let handCoins;
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const tempCoinId = handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    const coin = player.boardCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока с id '${playerId}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    if (IsCoin(coin)) {
        if (close && coin.isOpened) {
            ChangeIsOpenedCoinStatus(coin, false);
        }
        handCoins[tempCoinId] = coin;
    }
    else {
        if (multiplayer) {
            const privateBoardCoin = privatePlayer.boardCoins[coinId];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${playerId}' на поле отсутствует монета с id '${coinId}'.`);
            }
            if (IsCoin(privateBoardCoin)) {
                if (privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, false);
                }
                handCoins[tempCoinId] = privateBoardCoin;
            }
        }
    }
    if (multiplayer) {
        privatePlayer.boardCoins[coinId] = null;
    }
    player.boardCoins[coinId] = null;
    return true;
};
//# sourceMappingURL=CoinHelpers.js.map