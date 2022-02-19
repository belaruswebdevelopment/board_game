import { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { CoinType, IBuffs, ICoin, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player.boardCoins[G.currentTavern]?.isTriggerTrading) {
        const tradingCoins: ICoin[] = [];
        for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
            const coin: CoinType = player.boardCoins[i];
            if (coin !== null) {
                tradingCoins.push(coin);
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
const Trading = (G: IMyGameState, ctx: Ctx, tradingCoins: ICoin[]): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        coinsValues: number[] = tradingCoins.map((coin: ICoin): number => coin.value),
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
    if (player.buffs.find((buff: IBuffs): boolean =>
        buff.upgradeNextCoin !== undefined)) {
        value = coinsMaxValue;
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        upgradingCoin = tradingCoins[coinMinIndex];
    } else {
        value = coinsMinValue;
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        upgradingCoin = tradingCoins[coinMaxIndex];
    }
    UpgradeCoinAction(G, ctx, value, upgradingCoinId, `board`, upgradingCoin.isInitial);
};
