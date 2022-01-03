import { UpgradeCoinAction } from "../actions/Actions";
import { AddDataToLog } from "../Logging";
import { LogTypes, ActionTypes } from "../typescript/enums";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { AddActionsToStack } from "./StackHelpers";
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
export const ActivateTrading = (G, ctx) => {
    var _a;
    if ((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
            const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i];
            if (coin !== null) {
                tradingCoins.push(coin);
            }
        }
        Trading(G, ctx, tradingCoins);
        return true;
    }
    else {
        return false;
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
    const coinsValues = tradingCoins.map((coin) => coin.value), coinsMaxValue = Math.max(...coinsValues), coinsMinValue = Math.min(...coinsValues);
    let stack, upgradingCoinId, upgradingCoin, coinMaxIndex = 0, coinMinIndex = 0;
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
    }
    else {
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
    StartActionFromStackOrEndActions(G, ctx, false, upgradingCoinId, `board`, upgradingCoin.isInitial);
};
