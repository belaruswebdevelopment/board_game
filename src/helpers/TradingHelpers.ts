import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes } from "../typescript/enums";
import type { CoinType, ICoin, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
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
export const ActivateTrading = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (player.boardCoins[G.currentTavern]?.isTriggerTrading) {
            const tradingCoins: ICoin[] = [];
            for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
                const boardCoin: CoinType | undefined = player.boardCoins[i];
                if (boardCoin !== undefined) {
                    const coin: CoinType = boardCoin;
                    if (IsCoin(coin)) {
                        tradingCoins.push(coin);
                    }
                } else {
                    throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
                }
            }
            Trading(G, ctx, tradingCoins);
        }
    } else {
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
const Trading = (G: IMyGameState, ctx: Ctx, tradingCoins: ICoin[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const coinsValues: number[] = tradingCoins.map((coin: ICoin): number => coin.value),
            coinsMaxValue: number = Math.max(...coinsValues),
            coinsMinValue: number = Math.min(...coinsValues);
        let upgradingCoinId: number,
            upgradingCoin: ICoin,
            coinMaxIndex = 0,
            coinMinIndex = 0,
            value: number;
        AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока ${player.nickname}.`);
        // TODO trading isInitial first or playerChoose?
        for (let i = 0; i < tradingCoins.length; i++) {
            const tradingCoin: ICoin | undefined = tradingCoins[i];
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
            } else {
                throw new Error(`В массиве обменных монет игрока отсутствует монета ${i}.`);
            }
        }
        if (CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
            value = coinsMaxValue;
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            const minTradingCoin: ICoin | undefined = tradingCoins[coinMinIndex];
            if (minTradingCoin !== undefined) {
                upgradingCoin = minTradingCoin;
                DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
            } else {
                throw new Error(`В массиве обменных монет игрока отсутствует минимальная монета ${coinMinIndex}.`);
            }
        } else {
            value = coinsMinValue;
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
            const maxTradingCoin: ICoin | undefined = tradingCoins[coinMaxIndex];
            if (maxTradingCoin !== undefined) {
                upgradingCoin = maxTradingCoin;
            } else {
                throw new Error(`В массиве обменных монет игрока отсутствует максимальная монета ${coinMaxIndex
                    }.`);
            }
        }
        UpgradeCoinAction(G, ctx, value, upgradingCoinId, `board`, upgradingCoin.isInitial);
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
