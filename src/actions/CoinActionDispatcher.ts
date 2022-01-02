import { Ctx } from "boardgame.io";
import { MyGameState, IStack } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";
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
export const CoinActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action: Function | null;
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
    action?.(G, ctx, data.config, ...args);
};
