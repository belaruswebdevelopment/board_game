import type { Ctx } from "boardgame.io";
import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import type { ActionFunctionTypes, IAction, IMyGameState } from "../typescript/interfaces";

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
const ActionDispatcherSwitcher = (actionName: string): ActionFunctionTypes => {
    let action: ActionFunctionTypes;
    switch (actionName) {
        case AddPickHeroAction.name:
            action = AddPickHeroAction;
            break;
        case DiscardTradingCoinAction.name:
            action = DiscardTradingCoinAction;
            break;
        case FinishOdroerirTheMythicCauldronAction.name:
            action = FinishOdroerirTheMythicCauldronAction;
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
        case UpgradeMinCoinAction.name:
            action = UpgradeMinCoinAction;
            break;
        default:
            throw new Error(`Нет такого действия '${actionName}'.`);
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
        const actionDispatcher: ActionFunctionTypes = ActionDispatcherSwitcher(action.name);
        if (action.params !== undefined) {
            actionDispatcher?.(G, ctx, ...action.params);
        } else {
            actionDispatcher?.(G, ctx);
        }
    }
};
