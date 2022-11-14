import { BasicMythicalAnimalScoring, GarmScoring, NidhoggScoring } from "../score_helpers/MythicalAnimalScoringHelpers";
import { MythicalAnimalScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Начинает действие по получению победных очков по мифическому животному.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по мифическому животному.</li>
 * </ol>
 *
 * @param player Игрок.
 * @param action Объект действия.
 * @returns Количество победных очков по мифическому животному.
 */
export const StartMythicalAnimalScoring = ({ G, ctx, playerID, ...rest }, action) => {
    const actionDispatcher = MythicalAnimalScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        throw new Error(`Отсутствует обязательный параметр функции 'params'.`);
    }
    return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher({ G, ctx, playerID, ...rest }, ...action.params);
};
/**
 * <h3>Диспетчер всех действий по получению победных очков по мифическому животному.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому животному.</li>
 * </ol>
 *
 * @param actionName Название действия.
 * @returns Действие.
 */
const MythicalAnimalScoringDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
    switch (actionName) {
        case MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring:
            action = BasicMythicalAnimalScoring;
            break;
        case MythicalAnimalScoringFunctionNames.GarmScoring:
            action = GarmScoring;
            break;
        case MythicalAnimalScoringFunctionNames.NidhoggScoring:
            action = NidhoggScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};
//# sourceMappingURL=MythicalAnimalDispatcher.js.map