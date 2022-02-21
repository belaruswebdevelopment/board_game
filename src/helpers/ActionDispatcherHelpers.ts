import { Ctx } from "boardgame.io";
import { AddPickHeroAction, DiscardTradingCoinAction, GetClosedCoinIntoPlayerHandAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "../actions/AutoActions";
import { IAction, IActionFunctionTypes, IMyGameState } from "../typescript/interfaces";

/**
 * <h3>Диспетчер всех автоматических действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при вызове каждого автоматического действия.</li>
 * </ol>
 *
 * @param actionName Название автоматических действий.
 * @returns Автоматические действие.
 */
const ActionDispatcherSwitcher = (actionName: string): IActionFunctionTypes => {
    let action: IActionFunctionTypes;
    switch (actionName) {
        case AddPickHeroAction.name:
            action = AddPickHeroAction;
            break;
        case DiscardTradingCoinAction.name:
            action = DiscardTradingCoinAction;
            break;
        case GetClosedCoinIntoPlayerHandAction.name:
            action = GetClosedCoinIntoPlayerHandAction;
            break;
        case StartDiscardSuitCardAction.name:
            action = StartDiscardSuitCardAction;
            break;
        case StartVidofnirVedrfolnirAction.name:
            action = StartVidofnirVedrfolnirAction;
            break;
        case UpgradeCoinAction.name:
            action = UpgradeCoinAction;
            break;
        default:
            action = null;
    }
    return action;
};

/**
 * <h3>Начинает автоматические действия конкретной карты при их наличии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости активировать автоматические действия карт.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param action Объект автоматических действий.
 */
export const StartAutoAction = (G: IMyGameState, ctx: Ctx, action?: IAction): void => {
    if (action !== undefined) {
        const actionDispatcher: IActionFunctionTypes = ActionDispatcherSwitcher(action.name);
        if (action.params !== undefined) {
            actionDispatcher?.(G, ctx, ...action.params);
        } else {
            actionDispatcher?.(G, ctx);
        }
    }
};
