import { DrawProfitCoinAction, UpgradeCoinActionCardAction } from "./CoinActions";
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
export const CoinActionDispatcher = (G, ctx, data, ...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action;
    switch (data.action.name) {
        case DrawProfitCoinAction.name:
            action = DrawProfitCoinAction;
            break;
        case UpgradeCoinActionCardAction.name:
            action = UpgradeCoinActionCardAction;
            break;
        default:
            action = null;
    }
    action === null || action === void 0 ? void 0 : action(G, ctx, data.config, ...args);
};
//# sourceMappingURL=CoinActionDispatcher.js.map