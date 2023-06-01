import { BlacksmithScoring, ExplorerScoring, HunterScoring, MinerScoring, WarriorScoring } from "../score_helpers/SuitScoringHelpers";
import { SuitScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Начинает действие по получению победных очков по фракции дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по фракции дворфа.</li>
 * </ol>
 *
 * @param action Объект действия.
 * @param params Параметры действия.
 * @returns Количество победных очков по фракции дворфа.
 */
export const StartSuitScoring = (action, params) => { var _a; return (_a = SuitScoringDispatcherSwitcher(action.name)) === null || _a === void 0 ? void 0 : _a(...params); };
/**
* <h3>Диспетчер всех действий по получению победных очков по фракции дворфа.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции дворфа.</li>
* </ol>
*
* @param actionName Название действия.
* @returns Действие.
*/
const SuitScoringDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
    switch (actionName) {
        case SuitScoringFunctionNames.BlacksmithScoring:
            action = BlacksmithScoring;
            break;
        case SuitScoringFunctionNames.ExplorerScoring:
            action = ExplorerScoring;
            break;
        case SuitScoringFunctionNames.HunterScoring:
            action = HunterScoring;
            break;
        case SuitScoringFunctionNames.MinerScoring:
            action = MinerScoring;
            break;
        case SuitScoringFunctionNames.WarriorScoring:
            action = WarriorScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия '${actionName}'.`);
            return _exhaustiveCheck;
    }
    return action;
};
//# sourceMappingURL=SuitScoringDispatcher.js.map