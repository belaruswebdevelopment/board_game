import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import { AutoActionFunctionNames } from "../typescript/enums";
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
const AutoActionDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
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
export const StartAutoAction = (G, ctx, action) => {
    if (action !== undefined) {
        const actionDispatcher = AutoActionDispatcherSwitcher(action.name);
        if (action.params !== undefined) {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, ...action.params);
        }
        else {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx);
        }
    }
};
//# sourceMappingURL=ActionDispatcherHelpers.js.map