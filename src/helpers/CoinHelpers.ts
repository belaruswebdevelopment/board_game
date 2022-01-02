import { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/Actions";
import { AddDataToLog } from "../Logging";
import { ICoin } from "../typescript/coin_interfaces";
import { CoinType } from "../typescript/coin_types";
import { ActionTypes, LogTypes } from "../typescript/enums";
import { INumberValues, IPriority, IPublicPlayer, IResolveBoardCoins, IStack, MyGameState } from "../typescript/interfaces";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { AddActionsToStack } from "./StackHelpers";

// todo Add logging
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Активировался ли обмен монет.
 */
export const ActivateTrading = (G: MyGameState, ctx: Ctx): boolean => {
    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]?.isTriggerTrading) {
        const tradingCoins: ICoin[] = [];
        for (let i: number = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length;
            i++) {
            const coin: CoinType = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
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
 * <h3>Находит максимальную монету игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, если пикнут герой Astrid.</li>
 * <li>В конце игры, если получено преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Максимальная монета игрока.
 */
export const GetMaxCoinValue = (player: IPublicPlayer): number => (Math.max(...player.boardCoins
    .filter((coin: CoinType): boolean => Boolean(coin?.value))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((coin: CoinType): number => coin!.value),
    ...player.handCoins.filter((coin: CoinType): boolean => Boolean(coin?.value))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((coin: CoinType): number => coin!.value)));

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
export const ResolveBoardCoins = (G: MyGameState, ctx: Ctx): IResolveBoardCoins => {
    const playersOrder: number[] = [],
        coinValues: number[] = [],
        exchangeOrder: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const coin: CoinType = G.publicPlayers[i].boardCoins[G.currentTavern];
        if (coin !== null) {
            coinValues[i] = coin.value;
            playersOrder.push(i);
            exchangeOrder.push(i);
        }
        for (let j: number = playersOrder.length - 1; j > 0; j--) {
            const coin: CoinType = G.publicPlayers[playersOrder[j]].boardCoins[G.currentTavern],
                prevCoin: CoinType = G.publicPlayers[playersOrder[j - 1]].boardCoins[G.currentTavern];
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
    return { playersOrder, exchangeOrder };
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
export const Trading = (G: MyGameState, ctx: Ctx, tradingCoins: ICoin[]): void => {
    const coinsValues: number[] = tradingCoins.map((coin: ICoin): number => coin.value),
        coinsMaxValue: number = Math.max(...coinsValues),
        coinsMinValue: number = Math.min(...coinsValues);
    let stack: IStack[],
        upgradingCoinId: number,
        upgradingCoin: ICoin,
        coinMaxIndex = 0,
        coinMinIndex = 0;
    AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока ${G.publicPlayers[Number(ctx.currentPlayer)].nickname}.`);
    // TODO trading isInitial first or playerChoose?
    for (let i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
        if (tradingCoins[i].value === coinsMinValue) {
            coinMinIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin === `min`) {
        stack = [
            {
                action: {
                    name: UpgradeCoinAction.name,
                    type: ActionTypes.Action,
                },
                config: {
                    number: 1,
                    value: coinsMaxValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        upgradingCoin = tradingCoins[coinMinIndex];
    } else {
        stack = [
            {
                action: {
                    name: UpgradeCoinAction.name,
                    type: ActionTypes.Action,
                },
                config: {
                    number: 1,
                    value: coinsMinValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        upgradingCoin = tradingCoins[coinMaxIndex];
    }
    AddActionsToStack(G, ctx, stack);
    StartActionFromStackOrEndActions(G, ctx, false, upgradingCoinId, `board`,
        upgradingCoin.isInitial);
};
