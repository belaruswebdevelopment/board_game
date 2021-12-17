import { ICoin, Trading } from "../Coin";
import { MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IPriority } from "../Priority";
import { IPublicPlayer } from "../Player";
import { INumberValues } from "../data/SuitData";

// todo Add logging

/**
 * <h3>Интерфейс для резолвинга монет на столе.</h3>
 */
export interface IResolveBoardCoins {
    playersOrder: number[],
    exchangeOrder: number[],
}

/**
 * <h3>Находит максимальную монету игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, если пикнут герой Astrid.</li>
 * <li>В конце игры, если получено преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param {IPublicPlayer} player Игрок.
 * @returns {number} Максимальная монета игрока.
 * @constructor
 */
export const GetMaxCoinValue = (player: IPublicPlayer): number => {
    return Math.max(...player.boardCoins.filter((coin: ICoin | null): boolean => Boolean(coin?.value))
        .map((coin: ICoin | null): number => coin!.value),
        ...player.handCoins.filter((coin: ICoin | null): boolean => Boolean(coin?.value))
            .map((coin: ICoin | null): number => coin!.value));
};

/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {boolean} Активировался ли обмен монет.
 * @constructor
 */
export const ActivateTrading = (G: MyGameState, ctx: Ctx): boolean => {
    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]?.isTriggerTrading) {
        const tradingCoins: ICoin[] = [];
        for (let i: number = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            const coin: ICoin | null = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
            if (coin !== null) {
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {{playersOrder: number[], exchangeOrder: number[]}} Порядок ходов игроков & порядок изменения ходов игроками.
 * @constructor
 */
export const ResolveBoardCoins = (G: MyGameState, ctx: Ctx): IResolveBoardCoins => {
    const playersOrder: number[] = [],
        coinValues: number[] = [],
        exchangeOrder: number[] = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        const coin: ICoin | null = G.publicPlayers[i].boardCoins[G.currentTavern];
        if (coin !== null) {
            coinValues[i] = coin.value;
            playersOrder.push(i);
            exchangeOrder.push(i);
        }
        for (let j: number = playersOrder.length - 1; j > 0; j--) {
            const coin: ICoin | null = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern],
                prevCoin: ICoin | null = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
            if (coin !== null && prevCoin !== null) {
                if (coin.value > prevCoin.value) {
                    [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                } else if (coin.value === prevCoin.value) {
                    const priority: IPriority = G.publicPlayers[playersOrder[j]].priority,
                        prevPriority: IPriority = G.publicPlayers[playersOrder[j - 1]].priority;
                    if (priority.value > prevPriority.value) {
                        [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
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
            const tiePlayersPriorities: number[] =
                tiePlayers.map((player: IPublicPlayer): number => player.priority.value),
                maxPriority: number = Math.max(...tiePlayersPriorities),
                minPriority: number = Math.min(...tiePlayersPriorities),
                maxIndex: number =
                    G.publicPlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value === maxPriority),
                minIndex: number =
                    G.publicPlayers.findIndex((player: IPublicPlayer): boolean => player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === minPriority),
                1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === minPriority),
                1);
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
        }
    }
    return { playersOrder, exchangeOrder };
};
