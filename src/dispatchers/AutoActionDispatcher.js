import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampAutoActions";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction, UpgradeMinCoinAction } from "../actions/HeroAutoActions";
import { AddMythologyCreatureCardsSkymirAction } from "../actions/MythologicalCreatureAutoActions";
import { AutoActionFunctionNames } from "../typescript/enums";
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
const AutoActionDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
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
export const StartAutoAction = ({ G, ctx, myPlayerID, ...rest }, action) => {
    if (action !== undefined) {
        const actionDispatcher = AutoActionDispatcherSwitcher(action.name);
        // TODO Rework!?
        if (action.params === undefined) {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher({ G, ctx, myPlayerID, ...rest });
        }
        else {
            actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher({ G, ctx, myPlayerID, ...rest }, ...action.params);
        }
    }
};
//# sourceMappingURL=AutoActionDispatcher.js.map