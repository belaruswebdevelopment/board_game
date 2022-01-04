import { Ctx } from "boardgame.io";
import { IStack } from "../typescript/action_interfaces";
import { MyGameState } from "../typescript/game_data_interfaces";
import { ArgsTypes } from "../typescript/types";
import { AddBuffToPlayerCampAction, AddCampCardToCardsAction, AddCoinToPouchAction, CheckPickDiscardCardCampAction, DrawProfitCampAction, DiscardAnyCardFromPlayerBoardAction, DiscardSuitCardAction, DiscardTradingCoinAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PickDiscardCardCampAction, PickHeroCampAction, PlaceEnlistmentMercenariesAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction, UpgradeCoinCampAction, UpgradeCoinVidofnirVedrfolnirAction } from "./CampActions";

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
export const CampActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action: Function | null;
    switch (data.action.name) {
        case AddBuffToPlayerCampAction.name:
            action = AddBuffToPlayerCampAction;
            break;
        case AddCampCardToCardsAction.name:
            action = AddCampCardToCardsAction;
            break;
        case AddCoinToPouchAction.name:
            action = AddCoinToPouchAction;
            break;
        case CheckPickDiscardCardCampAction.name:
            action = CheckPickDiscardCardCampAction;
            break;
        case DrawProfitCampAction.name:
            action = DrawProfitCampAction;
            break;
        case DiscardAnyCardFromPlayerBoardAction.name:
            action = DiscardAnyCardFromPlayerBoardAction;
            break;
        case DiscardSuitCardAction.name:
            action = DiscardSuitCardAction;
            break;
        case DiscardTradingCoinAction.name:
            action = DiscardTradingCoinAction;
            break;
        case GetEnlistmentMercenariesAction.name:
            action = GetEnlistmentMercenariesAction;
            break;
        case GetMjollnirProfitAction.name:
            action = GetMjollnirProfitAction;
            break;
        case PickDiscardCardCampAction.name:
            action = PickDiscardCardCampAction;
            break;
        case PickHeroCampAction.name:
            action = PickHeroCampAction;
            break;
        case PlaceEnlistmentMercenariesAction.name:
            action = PlaceEnlistmentMercenariesAction;
            break;
        case StartDiscardSuitCardAction.name:
            action = StartDiscardSuitCardAction;
            break;
        case StartVidofnirVedrfolnirAction.name:
            action = StartVidofnirVedrfolnirAction;
            break;
        case UpgradeCoinCampAction.name:
            action = UpgradeCoinCampAction;
            break;
        case UpgradeCoinVidofnirVedrfolnirAction.name:
            action = UpgradeCoinVidofnirVedrfolnirAction;
            break;
        default:
            action = null;
    }
    action?.(G, ctx, data.config, ...args);
};
