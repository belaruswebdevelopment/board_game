import { Ctx } from "boardgame.io";
import { MyGameState, IStack } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";
import { DrawProfitAction, DiscardCardFromTavernAction, PassEnlistmentMercenariesAction, PickHeroAction, UpgradeCoinAction } from "./Actions";

/**
 * <h3>Диспетчер действий при их активации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев выполняются последовательно их действия.</li>
 * <li>При выборе конкретных карт кэмпа выполняются последовательно их действия.</li>
 * <li>При выборе карт улучшения монет выполняются их действия.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Стэк.
 * @param args Дополнительные аргументы.
 */
export const ActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let action: Function | null;
  switch (data.action.name) {
    case DrawProfitAction.name:
      action = DrawProfitAction;
      break;
    case DiscardCardFromTavernAction.name:
      action = DiscardCardFromTavernAction;
      break;
    case PassEnlistmentMercenariesAction.name:
      action = PassEnlistmentMercenariesAction;
      break;
    case PickHeroAction.name:
      action = PickHeroAction;
      break;
    case UpgradeCoinAction.name:
      action = UpgradeCoinAction;
      break;
    default:
      action = null;
  }
  action?.(G, ctx, data.config, ...args);
};
