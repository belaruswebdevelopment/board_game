import type { Ctx } from "boardgame.io";
import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import { AutoActionFunctionNames } from "../typescript/enums";
import type { AutoActionFunctionType, IAction, IMyGameState } from "../typescript/interfaces";

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
const AutoActionDispatcherSwitcher = (actionName: AutoActionFunctionNames): AutoActionFunctionType => {
    let action: AutoActionFunctionType,
        _exhaustiveCheck: never;
    switch (actionName) {
        case AutoActionFunctionNames.AddPickHeroAction:
            action = AddPickHeroAction;
            break;
        case AutoActionFunctionNames.DiscardTradingCoinAction:
            action = DiscardTradingCoinAction;
            break;
        case AutoActionFunctionNames.FinishOdroerirTheMythicCauldronAction:
            action = FinishOdroerirTheMythicCauldronAction;
            break;
        case AutoActionFunctionNames.GetClosedCoinIntoPlayerHandAction:
            action = GetClosedCoinIntoPlayerHandAction;
            break;
        case AutoActionFunctionNames.StartDiscardSuitCardAction:
            action = StartDiscardSuitCardAction;
            break;
        case AutoActionFunctionNames.StartVidofnirVedrfolnirAction:
            action = StartVidofnirVedrfolnirAction;
            break;
        case AutoActionFunctionNames.UpgradeMinCoinAction:
            action = UpgradeMinCoinAction;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия '${actionName}'.`);
            return _exhaustiveCheck;
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
        const actionDispatcher: AutoActionFunctionType = AutoActionDispatcherSwitcher(action.name);
        if (action.params !== undefined) {
            actionDispatcher?.(G, ctx, ...action.params);
        } else {
            actionDispatcher?.(G, ctx);
        }
    }
};
