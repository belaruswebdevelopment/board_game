import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes } from "../typescript/enums";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { IsMultiplayer } from "./MultiplayerHelpers";
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ActivateTrading = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока отсутствует монета текущей таверны ${G.currentTavern}.`);
    }
    if (boardCoinCurrentTavern === null || boardCoinCurrentTavern === void 0 ? void 0 : boardCoinCurrentTavern.isTriggerTrading) {
        const multiplayer = IsMultiplayer(G), tradingCoins = [];
        for (let i = G.tavernsNum; i < player.boardCoins.length; i++) {
            const boardCoin = player.boardCoins[i];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
            }
            const coin = boardCoin;
            if (IsCoin(coin)) {
                tradingCoins.push(coin);
            }
        }
        Trading(G, ctx, tradingCoins);
        if (multiplayer) {
            for (let i = G.tavernsNum; i < player.boardCoins.length; i++) {
                player.boardCoins[i] = {};
            }
        }
    }
};
/**
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param tradingCoins Монеты для обмена.
 */
const Trading = (G, ctx, tradingCoins) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const coinsValues = tradingCoins.map((coin) => coin.value), coinsMaxValue = Math.max(...coinsValues), coinsMinValue = Math.min(...coinsValues);
    let upgradingCoinId, upgradingCoin, coinMaxIndex = 0, coinMinIndex = 0, value;
    AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока ${player.nickname}.`);
    // TODO trading isInitial first or playerChoose?
    for (let i = 0; i < tradingCoins.length; i++) {
        const tradingCoin = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока отсутствует монета ${i}.`);
        }
        if (tradingCoin.value === coinsMaxValue) {
            coinMaxIndex = i;
            // if (tradingCoin.isInitial) {
            //     break;
            // }
        }
        if (tradingCoin.value === coinsMinValue) {
            coinMinIndex = i;
            // if (tradingCoin.isInitial) {
            //     break;
            // }
        }
    }
    if (CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
        value = coinsMaxValue;
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        const minTradingCoin = tradingCoins[coinMinIndex];
        if (minTradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока отсутствует минимальная монета ${coinMinIndex}.`);
        }
        upgradingCoin = minTradingCoin;
        DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
    }
    else {
        value = coinsMinValue;
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        const maxTradingCoin = tradingCoins[coinMaxIndex];
        if (maxTradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока отсутствует максимальная монета ${coinMaxIndex}.`);
        }
        upgradingCoin = maxTradingCoin;
    }
    UpgradeCoinAction(G, ctx, value, upgradingCoinId, CoinTypes.Board, upgradingCoin.isInitial);
};
//# sourceMappingURL=TradingHelpers.js.map