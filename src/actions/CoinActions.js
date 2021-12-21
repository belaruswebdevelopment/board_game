import { DrawCurrentProfit } from "../helpers/ActionHelpers";
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
export const DrawProfitCoinAction = (G, ctx, config) => {
    DrawCurrentProfit(G, ctx, config);
};
/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li><li>При выборе карт, улучшающих монеты.</li></li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
// export const UpgradeCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
//     UpgradeCurrentCoin(G, ctx, config, ...args);
// };