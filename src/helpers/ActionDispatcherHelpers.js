import { AddPickHeroAction, DiscardTradingCoinAction, GetClosedCoinIntoPlayerHandAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "../actions/AutoActions";
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
// eslint-disable-next-line @typescript-eslint/ban-types
const ActionDispatcherSwitcher = (actionName) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action;
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
export const StartAutoAction = (G, ctx, action) => {
    if (action !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const actionDispatcher = ActionDispatcherSwitcher(action.name);
        // TODO Check need to add param Stack[0]!?
        actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, action.params);
    }
};
//# sourceMappingURL=ActionDispatcherHelpers.js.map