import { BasicArtefactScoring, DraupnirScoring, HrafnsmerkiScoring, MjollnirScoring, OdroerirTheMythicCauldronScoring, SvalinnScoring } from "../score_helpers/ArtefactScoringHelpers";
import { ArtefactScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Начинает действие по получению победных очков по артефакту.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по артефакту.</li>
 * </ol>
 *
 * @param context
 * @param action Объект действия.
 * @param isFinal Происходит ли подсчёт очков в конце игры.
 * @returns Количество победных очков по артефакту.
 */
export const StartArtefactScoring = ({ G, ctx, myPlayerID, ...rest }, action, isFinal = false) => {
    const actionDispatcher = ArtefactScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher({ G, ctx, myPlayerID, ...rest }, isFinal);
    }
    else {
        return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher({ G, ctx, myPlayerID, ...rest }, isFinal, ...action.params);
    }
};
/**
* <h3>Диспетчер всех действий по получению победных очков по артефакту.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по артефакту.</li>
* </ol>
*
* @param actionName Название действия.
* @returns Действие.
*/
const ArtefactScoringDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
    switch (actionName) {
        case ArtefactScoringFunctionNames.BasicArtefactScoring:
            action = BasicArtefactScoring;
            break;
        case ArtefactScoringFunctionNames.DraupnirScoring:
            action = DraupnirScoring;
            break;
        case ArtefactScoringFunctionNames.HrafnsmerkiScoring:
            action = HrafnsmerkiScoring;
            break;
        case ArtefactScoringFunctionNames.MjollnirScoring:
            action = MjollnirScoring;
            break;
        case ArtefactScoringFunctionNames.OdroerirTheMythicCauldronScoring:
            action = OdroerirTheMythicCauldronScoring;
            break;
        case ArtefactScoringFunctionNames.SvalinnScoring:
            action = SvalinnScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};
//# sourceMappingURL=ArtefactScoringDispatcher.js.map