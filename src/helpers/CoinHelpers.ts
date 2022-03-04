import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import type { CoinType, ICoin, IMyGameState, INumberValues, IPriority, IPublicPlayer, IResolveBoardCoins } from "../typescript/interfaces";

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
export const GetMaxCoinValue = (player: IPublicPlayer): number =>
(Math.max(...player.boardCoins.filter((coin: CoinType): boolean =>
    IsCoin(coin)).map((coin: CoinType): number => (coin as ICoin).value),
    ...player.handCoins.filter((coin: CoinType): boolean =>
        IsCoin(coin)).map((coin: CoinType): number => (coin as ICoin).value)));

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
export const ResolveBoardCoins = (G: IMyGameState, ctx: Ctx): IResolveBoardCoins => {
    const playersOrderNumbers: number[] = [],
        coinValues: number[] = [],
        exchangeOrder: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const coin: CoinType = G.publicPlayers[i].boardCoins[G.currentTavern];
        if (IsCoin(coin)) {
            coinValues[i] = coin.value;
            playersOrderNumbers.push(i);
            exchangeOrder.push(i);
        }
        for (let j: number = playersOrderNumbers.length - 1; j > 0; j--) {
            const coin: CoinType = G.publicPlayers[playersOrderNumbers[j]].boardCoins[G.currentTavern],
                prevCoin: CoinType = G.publicPlayers[playersOrderNumbers[j - 1]].boardCoins[G.currentTavern];
            if (IsCoin(coin) && IsCoin(prevCoin)) {
                if (coin.value > prevCoin.value) {
                    [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumbers[j - 1], playersOrderNumbers[j]];
                } else if (coin.value === prevCoin.value) {
                    const priority: IPriority = G.publicPlayers[playersOrderNumbers[j]].priority,
                        prevPriority: IPriority = G.publicPlayers[playersOrderNumbers[j - 1]].priority;
                    if (priority.value > prevPriority.value) {
                        [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumbers[j - 1], playersOrderNumbers[j]];
                    }
                } else {
                    break;
                }
            }
        }
    }
    const counts: INumberValues = {};
    for (let i = 0; i < coinValues.length; i++) {
        counts[coinValues[i]] = 1 + (counts[coinValues[i]] || 0);
    }
    for (const prop in counts) {
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
                maxIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                    player.priority.value === maxPriority),
                minIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                    player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === minPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === minPriority), 1);
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
        }
    }
    const playersOrder = playersOrderNumbers.map((index: number): string => String(index));
    return {
        playersOrder,
        exchangeOrder,
    };
};
