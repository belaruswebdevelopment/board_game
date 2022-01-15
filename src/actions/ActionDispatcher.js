import { DiscardCardFromTavernAction, DrawProfitAction, PassEnlistmentMercenariesAction, PickHeroAction, UpgradeCoinAction } from "./Actions";
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
export const ActionDispatcher = (G, ctx, data, ...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action;
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
    action === null || action === void 0 ? void 0 : action(G, ctx, data.config, ...args);
};
//# sourceMappingURL=ActionDispatcher.js.map