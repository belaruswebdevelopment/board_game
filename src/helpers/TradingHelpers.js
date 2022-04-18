import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes } from "../typescript/enums";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { IsMultiplayer } from "./MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
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
    const multiplayer = IsMultiplayer(G), privatePlayer = G.players[Number(ctx.currentPlayer)], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if ((boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern))
        || (IsCoin(boardCoinCurrentTavern) && !boardCoinCurrentTavern.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsCoin(boardCoinCurrentTavern) && boardCoinCurrentTavern.isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < player.boardCoins.length; i++) {
            if (multiplayer) {
                const privateBoardCoin = privatePlayer.boardCoins[i];
                if (privateBoardCoin === undefined) {
                    throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${i}'.`);
                }
                if (!IsCoin(privateBoardCoin)) {
                    throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на поле не может не быть монеты с id '${i}'.`);
                }
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                player.boardCoins[i] = privateBoardCoin;
            }
            const boardCoin = player.boardCoins[i];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${i}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может не быть монеты с id '${i}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
            }
            if (IsCoin(boardCoin)) {
                if (!boardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(boardCoin, true);
                }
                tradingCoins.push(boardCoin);
            }
        }
        Trading(G, ctx, tradingCoins);
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
    const length = tradingCoins.length;
    if (length !== 2) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' должно быть ровно '2' монеты, а не '${length}'.`);
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const coinsValues = tradingCoins.map((coin) => coin.value), coinsMaxValue = Math.max(...coinsValues), coinsMinValue = Math.min(...coinsValues);
    let upgradingCoinId, coinMaxIndex = -1, coinMinIndex = -1, value;
    AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока '${player.nickname}'.`);
    for (let i = 0; i < tradingCoins.length; i++) {
        const tradingCoin = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' отсутствует монета с id '${i}'.`);
        }
        if (tradingCoin.value === coinsMaxValue && coinMaxIndex === -1) {
            coinMaxIndex = i;
        }
        else if (tradingCoin.value === coinsMinValue && coinMinIndex === -1) {
            coinMinIndex = i;
        }
    }
    if (coinMaxIndex === -1) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' не найдена максимальная монета с значением '${coinsMaxValue}'.`);
    }
    if (coinMinIndex === -1) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' не найдена максимальная монета с значением '${coinsMinValue}'.`);
    }
    const maxTradingCoin = tradingCoins[coinMaxIndex];
    if (maxTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' отсутствует максимальная монета с id '${coinMaxIndex}'.`);
    }
    const minTradingCoin = tradingCoins[coinMinIndex];
    if (minTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' отсутствует минимальная монета с id '${coinMinIndex}'.`);
    }
    if (coinsMinValue === coinsMaxValue && (maxTradingCoin.isInitial || minTradingCoin.isInitial)) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickConcreteCoinToUpgrade(coinsMaxValue, coinsMaxValue)]);
        DrawCurrentProfit(G, ctx);
    }
    else {
        if (CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
            value = coinsMaxValue;
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
        }
        else {
            value = coinsMinValue;
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
        }
        UpgradeCoinAction(G, ctx, true, value, upgradingCoinId, CoinTypes.Board);
    }
};
//# sourceMappingURL=TradingHelpers.js.map