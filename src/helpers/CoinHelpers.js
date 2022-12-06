import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames, ValkyryBuffNames } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { CheckValkyryRequirement } from "./MythologicalCreatureHelpers";
/**
 * <h3>Сброс обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции охотников (обмен '0' на '3').</li>
 * <li>Действия, связанные со сбросом обменной монеты по карте лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Тип и индекс сбрасываемой обменной монеты.
 */
export const DiscardTradingCoin = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    let tradingCoinIndex = player.boardCoins.findIndex((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading)), type = CoinTypeNames.Board;
    if (tradingCoinIndex === -1 && G.mode === GameModeNames.Multiplayer) {
        tradingCoinIndex = privatePlayer.boardCoins.findIndex((coin, index) => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${index}'.`);
            }
            return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading);
        });
    }
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && tradingCoinIndex === -1
        && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        tradingCoinIndex = handCoins.findIndex((coin, index) => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${index}'.`);
            }
            return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading);
        });
        if (tradingCoinIndex === -1) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
        }
        type = CoinTypeNames.Hand;
        handCoins.splice(tradingCoinIndex, 1, null);
        if (G.mode === GameModeNames.Multiplayer) {
            player.handCoins.splice(tradingCoinIndex, 1, null);
        }
    }
    else {
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока с id '${myPlayerID}' на столе не может отсутствовать обменная монета.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            privatePlayer.boardCoins.splice(tradingCoinIndex, 1, null);
        }
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    return [type, tradingCoinIndex];
};
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
export const GetMaxCoinValue = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    return Math.max(...player.boardCoins.filter(IsCoin).map((coin, index) => {
        if (!coin.isOpened) {
            throw new Error(`В массиве монет игрока '${player.nickname}' на поле не может быть ранее не открыта монета с id '${index}'.`);
        }
        return coin.value;
    }));
};
/**
 * <h3>Открывает закрытые монеты на столе игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда нужно открыть все закрытые монеты всех игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OpenClosedCoinsOnPlayerBoard = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    for (let j = 0; j < player.boardCoins.length; j++) {
        const privateBoardCoin = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            if (IsCoin(privateBoardCoin)) {
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                player.boardCoins[j] = privateBoardCoin;
            }
        }
        const publicBoardCoin = player.boardCoins[j];
        if (publicBoardCoin === undefined) {
            throw new Error(`В массиве монет публичного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
        }
        if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
            throw new Error(`В массиве монет публичного игрока с id '${myPlayerID}' на поле не может быть закрыта монета с id '${j}'.`);
        }
        if (IsCoin(publicBoardCoin)) {
            if (!publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
    }
};
/**
 * <h3>Открывает закрытые монеты текущей таверны на столе игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент игры, когда нужно открыть все закрытые монеты текущей таверны всех игроков в фазу 'Смотр войск'.</li>
 * <li>В момент игры, когда нужно открыть все закрытые монеты текущей таверны всех игроков в фазу 'Ставки Улина'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OpenCurrentTavernClosedCoinsOnPlayerBoard = ({ G, ctx, ...rest }) => {
    Object.values(G.publicPlayers).forEach((player, index) => {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && index === 1)
            || (G.mode === GameModeNames.SoloAndvari && index === 1)) {
            const privatePlayer = G.players[index];
            if (privatePlayer === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, index);
            }
            const privateBoardCoin = privatePlayer.boardCoins[G.currentTavern];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${index}' в руке отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (privateBoardCoin !== null && !privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[G.currentTavern] = privateBoardCoin;
        }
        else {
            const publicBoardCoin = player.boardCoins[G.currentTavern];
            if (publicBoardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${index}' в руке отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                throw new Error(`В массиве монет игрока с id '${index}' в руке не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (publicBoardCoin !== null && !publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
    });
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
export const ResolveBoardCoins = ({ G, ctx, ...rest }) => {
    var _a;
    const playersOrderNumbers = [], coinValues = [], exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
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
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playersOrderNumberCur);
                }
                if (playerPrev === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playersOrderNumberPrev);
                }
                const coin = playerCur.boardCoins[G.currentTavern], prevCoin = playerPrev.boardCoins[G.currentTavern];
                if (coin === undefined) {
                    throw new Error(`В массиве монет текущего игрока с id '${playersOrderNumberCur}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
                }
                if (prevCoin === undefined) {
                    throw new Error(`В массиве монет предыдущего игрока с id '${playersOrderNumberPrev}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
                }
                if (IsCoin(coin) && IsCoin(prevCoin)) {
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
            if (boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern)) {
                throw new Error(`В массиве монет игрока с id '${index}' не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
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
    const playersOrder = playersOrderNumbers.map((index) => String(index));
    if (G.expansions.Idavoll.active) {
        const firstPlayer = playersOrder[0];
        if (firstPlayer === undefined) {
            throw new Error(`В массиве порядка хода игроков не может отсутствовать победивший первый игрок.`);
        }
        CheckValkyryRequirement({ G, ctx, myPlayerID: firstPlayer, ...rest }, ValkyryBuffNames.CountBidWinnerAmount);
    }
    return {
        playersOrder,
        exchangeOrder,
    };
};
/**
 * <h3>Возвращает все монеты игрока из руки на стол при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const ReturnCoinsToPlayerBoard = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            const tempCoinId = player.boardCoins.indexOf(null);
            if (tempCoinId !== -1) {
                if (!handCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(handCoin, true);
                }
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.boardCoins[tempCoinId] = handCoin;
                    player.handCoins[i] = null;
                }
                player.boardCoins[tempCoinId] = handCoin;
                handCoins[i] = null;
            }
        }
    }
};
// TODO Do coins return to Solo Bot hands in private and closed for all!
/**
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const ReturnCoinsToPlayerHands = ({ G, ctx, ...rest }) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i], privatePlayer = G.players[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (privatePlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, i);
        }
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest }, HeroBuffNames.EveryTurn)) {
            for (let j = 0; j < player.handCoins.length; j++) {
                const handCoin = player.handCoins[j];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${i}' в руке отсутствует монета с id '${j}'.`);
                }
                if (IsCoin(handCoin) && handCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(handCoin, false);
                }
                if (G.mode === GameModeNames.Multiplayer) {
                    if (IsCoin(handCoin)) {
                        player.handCoins[j] = {};
                        privatePlayer.handCoins[j] = handCoin;
                    }
                }
            }
        }
        for (let j = 0; j < player.boardCoins.length; j++) {
            const isCoinReturned = ReturnCoinToPlayerHands({ G, ctx, myPlayerID: String(i), ...rest }, j, true);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Все монеты вернулись в руки игроков.`);
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
 * @param ctx
 * @param coinId Id монеты.
 * @param close Нужно ли закрыть монету.
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = ({ G, ctx, myPlayerID, ...rest }, coinId, close) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
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
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    if (IsCoin(coin)) {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
            if (!coin.isOpened) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть ранее не открыта монета с id '${coinId}'.`);
            }
        }
        if (close && coin.isOpened) {
            ChangeIsOpenedCoinStatus(coin, false);
        }
        handCoins[tempCoinId] = coin;
    }
    else {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
            const privateBoardCoin = privatePlayer.boardCoins[coinId];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${coinId}'.`);
            }
            if (IsCoin(privateBoardCoin)) {
                if (close && privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, false);
                }
                handCoins[tempCoinId] = privateBoardCoin;
            }
        }
    }
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
        if (close) {
            player.handCoins[tempCoinId] = {};
        }
        else {
            player.handCoins[tempCoinId] = coin;
        }
        privatePlayer.boardCoins[coinId] = null;
    }
    player.boardCoins[coinId] = null;
    return true;
};
/**
 * <h3>Рандомизирует монеты в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент подготовки к новому раунду.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
const MixUpCoins = ({ G, ctx, myPlayerID, random, ...rest }) => {
    const privatePlayer = G.players[Number(myPlayerID)];
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, random, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    privatePlayer.handCoins = random.Shuffle(privatePlayer.handCoins);
};
/**
 * <h3>Начинает рандомизацию монет в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент подготовки к новому раунду.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const MixUpCoinsInPlayerHands = ({ G, ctx, random, ...rest }) => {
    if (G.mode === GameModeNames.Multiplayer) {
        for (let p = 0; p < ctx.numPlayers; p++) {
            MixUpCoins({ G, ctx, myPlayerID: String(p), random, ...rest });
        }
    }
    else if (G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) {
        MixUpCoins({ G, ctx, myPlayerID: `1`, random, ...rest });
    }
};
//# sourceMappingURL=CoinHelpers.js.map