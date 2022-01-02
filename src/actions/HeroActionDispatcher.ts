import { Ctx } from "boardgame.io";
import { MyGameState, IStack } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";
import { AddBuffToPlayerHeroAction, AddHeroToCardsAction, CheckDiscardCardsFromPlayerBoardAction, CheckPickCampCardAction, CheckPickDiscardCardHeroAction, DrawProfitHeroAction, DiscardCardsFromPlayerBoardAction, GetClosedCoinIntoPlayerHandAction, PickDiscardCardHeroAction, PickHeroWithConditionsAction, PlaceCardsAction, PlaceHeroAction, UpgradeCoinHeroAction } from "./HeroActions";

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
export const HeroActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action: Function | null;
    switch (data.action.name) {
        case AddBuffToPlayerHeroAction.name:
            action = AddBuffToPlayerHeroAction;
            break;
        case AddHeroToCardsAction.name:
            action = AddHeroToCardsAction;
            break;
        case CheckDiscardCardsFromPlayerBoardAction.name:
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case CheckPickCampCardAction.name:
            action = CheckPickCampCardAction;
            break;
        case CheckPickDiscardCardHeroAction.name:
            action = CheckPickDiscardCardHeroAction;
            break;
        case DrawProfitHeroAction.name:
            action = DrawProfitHeroAction;
            break;
        case DiscardCardsFromPlayerBoardAction.name:
            action = DiscardCardsFromPlayerBoardAction;
            break;
        case GetClosedCoinIntoPlayerHandAction.name:
            action = GetClosedCoinIntoPlayerHandAction;
            break;
        case PickDiscardCardHeroAction.name:
            action = PickDiscardCardHeroAction;
            break;
        case PickHeroWithConditionsAction.name:
            action = PickHeroWithConditionsAction;
            break;
        case PlaceCardsAction.name:
            action = PlaceCardsAction;
            break;
        case PlaceHeroAction.name:
            action = PlaceHeroAction;
            break;
        case UpgradeCoinHeroAction.name:
            action = UpgradeCoinHeroAction;
            break;
        default:
            action = null;
    }
    action?.(G, ctx, data.config, ...args);
};
