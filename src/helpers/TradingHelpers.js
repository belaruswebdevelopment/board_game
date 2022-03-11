import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes } from "../typescript/enums";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
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
    if (player !== undefined) {
        const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
        if (boardCoinCurrentTavern !== undefined) {
            if (boardCoinCurrentTavern === null || boardCoinCurrentTavern === void 0 ? void 0 : boardCoinCurrentTavern.isTriggerTrading) {
                const tradingCoins = [];
                for (let i = G.tavernsNum; i < player.boardCoins.length; i++) {
                    const boardCoin = player.boardCoins[i];
                    if (boardCoin !== undefined) {
                        const coin = boardCoin;
                        if (IsCoin(coin)) {
                            tradingCoins.push(coin);
                        }
                    }
                    else {
                        throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
                    }
                }
                Trading(G, ctx, tradingCoins);
            }
        }
        else {
            throw new Error(`В массиве монет игрока отсутствует монета текущей таверны ${G.currentTavern}.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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
    if (player !== undefined) {
        const coinsValues = tradingCoins.map((coin) => coin.value), coinsMaxValue = Math.max(...coinsValues), coinsMinValue = Math.min(...coinsValues);
        let upgradingCoinId, upgradingCoin, coinMaxIndex = 0, coinMinIndex = 0, value;
        AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока ${player.nickname}.`);
        // TODO trading isInitial first or playerChoose?
        for (let i = 0; i < tradingCoins.length; i++) {
            const tradingCoin = tradingCoins[i];
            if (tradingCoin !== undefined) {
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
            else {
                throw new Error(`В массиве обменных монет игрока отсутствует монета ${i}.`);
            }
        }
        if (CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
            value = coinsMaxValue;
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            const minTradingCoin = tradingCoins[coinMinIndex];
            if (minTradingCoin !== undefined) {
                upgradingCoin = minTradingCoin;
                DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
            }
            else {
                throw new Error(`В массиве обменных монет игрока отсутствует минимальная монета ${coinMinIndex}.`);
            }
        }
        else {
            value = coinsMinValue;
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
            const maxTradingCoin = tradingCoins[coinMaxIndex];
            if (maxTradingCoin !== undefined) {
                upgradingCoin = maxTradingCoin;
            }
            else {
                throw new Error(`В массиве обменных монет игрока отсутствует максимальная монета ${coinMaxIndex}.`);
            }
        }
        UpgradeCoinAction(G, ctx, value, upgradingCoinId, CoinTypes.Board, upgradingCoin.isInitial);
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
//# sourceMappingURL=TradingHelpers.js.map