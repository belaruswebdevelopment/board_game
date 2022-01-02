import { Ctx } from "boardgame.io";
import { DrawCurrentProfit, PickCurrentHero, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern } from "../Tavern";
import { LogTypes } from "../typescript/enums";
import { MyGameState, IConfig } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";

/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
  AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту из таверны:`
  );
  DiscardCardFromTavern(G, cardId);
  EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с отрисовкой профита от игровых моментов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
  DrawCurrentProfit(G, ctx, config);
};

/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PassEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx): void => {
  AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} пасанул во время фазы 'Enlistment Mercenaries'.`);
  EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
  PickCurrentHero(G, ctx, config);
};

/**
 * <h3>Действия, связанные с улучшением монет при игровых моментах.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
  UpgradeCurrentCoin(G, ctx, config, ...args);
};
