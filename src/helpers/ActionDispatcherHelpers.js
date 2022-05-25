import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
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
const ActionDispatcherSwitcher = (actionName) => {
    let action;
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
export const StartAutoAction = (G, ctx, action) => {
    if (action !== undefined) {
        console.log(action.name);
        const actionDispatcher = ActionDispatcherSwitcher(action.name);
        if (action.params !== undefined) {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, ...action.params);
        }
        else {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx);
        }
    }
};
//# sourceMappingURL=ActionDispatcherHelpers.js.map