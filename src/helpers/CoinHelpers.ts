// todo Add logging
import {ICoin, Trading} from "../Coin";
import {MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {IPriority} from "../Priority";
import {IPublicPlayer} from "../Player";
import {INumberValues} from "../data/SuitData";

/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {boolean} Активировался ли обмен монет.
 * @constructor
 */
export const ActivateTrading = (G: MyGameState, ctx: Ctx): boolean => {
    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]?.isTriggerTrading) {
        const tradingCoins: ICoin[] = [];
        for (let i: number = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            const coin: ICoin | null = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
            if (coin) {
                tradingCoins.push(coin);
            }
        }
        Trading(G, ctx, tradingCoins);
        return true;
    } else {
        return false;
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
 * @returns {{playersOrder: *[], exchangeOrder: *[]}} Массив порядка ходов игроков и порядок обмена кристаллов приоритета.
 * @constructor
 */
export const ResolveBoardCoins = (G: MyGameState, ctx: Ctx): { playersOrder: number[], exchangeOrder: number[] } => {
    const playersOrder: number[] = [],
        coinValues: number[] = [],
        exchangeOrder: number[] = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        if (G.publicPlayers[i].boardCoins[G.currentTavern]) {
            const coin: ICoin | null = G.publicPlayers[i].boardCoins[G.currentTavern];
            if (coin) {
                coinValues[i] = coin.value;
            }
            playersOrder.push(i);
        }
        exchangeOrder.push(i);
        for (let j: number = playersOrder.length - 1; j > 0; j--) {
            const coin: ICoin | null = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern],
                prevCoin: ICoin | null = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
            if (coin && prevCoin) {
                if (coin.value > prevCoin.value) {
                    // [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                    let temp = playersOrder[j - 1];
                    playersOrder[j - 1] = playersOrder[j];
                    playersOrder[j] = temp;
                } else if (coin.value === prevCoin.value) {
                    const priority: IPriority = G.publicPlayers[playersOrder[j]].priority,
                        prevPriority: IPriority = G.publicPlayers[playersOrder[j - 1]].priority;
                    if (priority.value > prevPriority.value) {
                        // [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                        let temp: number = playersOrder[j - 1];
                        playersOrder[j - 1] = playersOrder[j];
                        playersOrder[j] = temp;
                    }
                } else {
                    break;
                }
            }
        }
    }
    const counts: INumberValues = {};
    for (let i: number = 0; i < coinValues.length; i++) {
        counts[coinValues[i]] = 1 + (counts[coinValues[i]] || 0);
    }
    for (let prop in counts) {
        if (counts[prop] <= 1) {
            continue;
        }
        const tiePlayers: IPublicPlayer[] = G.publicPlayers.filter((player: IPublicPlayer): boolean =>
            player.boardCoins[G.currentTavern]?.value === Number(prop) && player.priority.isExchangeable);
        while (tiePlayers.length > 1) {
            const tiePlayersPriorities: number[] = tiePlayers.map((player: IPublicPlayer): number => player.priority.value),
                maxPriority: number = Math.max(...tiePlayersPriorities),
                minPriority: number = Math.min(...tiePlayersPriorities),
                maxIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value
                    === maxPriority),
                minIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value
                    === minPriority);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value
                    === maxPriority),
                1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value
                    === minPriority),
                1);
            // [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
            let temp: number = exchangeOrder[minIndex];
            exchangeOrder[minIndex] = exchangeOrder[maxIndex];
            exchangeOrder[maxIndex] = temp;
        }
    }
    return {playersOrder, exchangeOrder};
};