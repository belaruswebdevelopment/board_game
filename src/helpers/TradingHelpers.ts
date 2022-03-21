import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes } from "../typescript/enums";
import type { ICoin, IMyGameState, IPublicPlayer, PublicPlayerBoardCoinTypes } from "../typescript/interfaces";
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
export const ActivateTrading = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const boardCoinCurrentTavern: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока отсутствует монета текущей таверны ${G.currentTavern}.`);
    }
    if (boardCoinCurrentTavern?.isTriggerTrading) {
        const multiplayer: boolean = IsMultiplayer(G),
            tradingCoins: ICoin[] = [];
        for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
            const boardCoin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[i];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
            }
            const coin: PublicPlayerBoardCoinTypes = boardCoin;
            if (IsCoin(coin)) {
                tradingCoins.push(coin);
            }
        }
        Trading(G, ctx, tradingCoins);
        if (multiplayer) {
            for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
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
const Trading = (G: IMyGameState, ctx: Ctx, tradingCoins: ICoin[]): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
        const minTradingCoin: ICoin | undefined = tradingCoins[coinMinIndex];
        if (minTradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока отсутствует минимальная монета ${coinMinIndex}.`);
        }
        upgradingCoin = minTradingCoin;
        DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
    } else {
        value = coinsMinValue;
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        const maxTradingCoin: ICoin | undefined = tradingCoins[coinMaxIndex];
        if (maxTradingCoin === undefined) {
            throw new Error(`В массиве обменных монет игрока отсутствует максимальная монета ${coinMaxIndex
                }.`);
        }
        upgradingCoin = maxTradingCoin;
    }
    UpgradeCoinAction(G, ctx, value, upgradingCoinId, CoinTypes.Board, upgradingCoin.isInitial);
};
