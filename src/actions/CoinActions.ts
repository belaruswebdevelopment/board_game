import { Ctx } from "boardgame.io";
import { DrawCurrentProfit, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { MyGameState, IConfig } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";

/**
 * <h3>Действия, связанные с отрисовкой профита от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    DrawCurrentProfit(G, ctx, config);
};

/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinActionCardAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
};
