import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import { AddMythologyCreatureCardsSkymirAction } from "../actions/MythologicalCreatureAutoActions";
import { AutoActionFunctionNames } from "../typescript/enums";
import type { AutoActionArgsType, AutoActionFunctionType, IAction, IActionFunctionWithoutParams, MyFnContextWithMyPlayerID } from "../typescript/interfaces";

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
        case AutoActionFunctionNames.AddMythologyCreatureCardsSkymirAction:
            action = AddMythologyCreatureCardsSkymirAction;
            break;
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
export const StartAutoAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    action?: IAction<AutoActionFunctionNames, AutoActionArgsType>): void => {
    if (action !== undefined) {
        const actionDispatcher: AutoActionFunctionType = AutoActionDispatcherSwitcher(action.name);
        // TODO Rework!?
        if (action.params === undefined) {
            (actionDispatcher as IActionFunctionWithoutParams)?.({ G, ctx, myPlayerID, ...rest });
        } else {
            actionDispatcher?.({ G, ctx, myPlayerID, ...rest }, ...action.params);
        }
    }
};
