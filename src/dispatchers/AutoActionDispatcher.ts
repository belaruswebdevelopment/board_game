import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import { AutoActionFunctionNames } from "../typescript/enums";
import type { AutoActionArgsType, AutoActionFunctionType, Ctx, IAction, IMyGameState } from "../typescript/interfaces";

/**
 * <h3>Диспетчер всех автоматических действий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при вызове каждого автоматического действия.</li>
 * </ol>
 *
 * @param actionName Название автоматического действия.
 * @returns Автоматическое действие.
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
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};

/**
 * <h3>Начинает автоматическое действие конкретной карты при его наличии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости активировать автоматическое действие карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param action Объект автоматического действия.
 * @returns
 */
export const StartAutoAction = (G: IMyGameState, ctx: Ctx,
    action?: IAction<AutoActionFunctionNames, AutoActionArgsType>): void => {
    if (action !== undefined) {
        const actionDispatcher: AutoActionFunctionType = AutoActionDispatcherSwitcher(action.name);
        if (action.params === undefined) {
            actionDispatcher?.(G, ctx);
        } else {
            actionDispatcher?.(G, ctx, ...action.params);
        }
    }
};
