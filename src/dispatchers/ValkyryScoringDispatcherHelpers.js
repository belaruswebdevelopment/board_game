import { BrynhildrScoring, HildrScoring, OlrunScoring, SigrdrifaScoring, SvafaScoring } from "../score_helpers/ValkyryScoringHelpers";
import { ValkyryScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Начинает действие по получению победных очков по Валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по Валькирии.</li>
 * </ol>
 *
 * @param action Объект действия.
 * @param params Параметры действия.
 * @returns Количество победных очков по Валькирии.
 */
export const StartValkyryScoring = (action, params) => { var _a; return (_a = ValkyryScoringDispatcherSwitcher(action.name)) === null || _a === void 0 ? void 0 : _a(...params); };
/**
 * <h3>Диспетчер всех действий по получению победных очков по валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по валькирии.</li>
 * </ol>
 *
 * @param actionName Название действия.
 * @returns Действие.
 */
const ValkyryScoringDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
    switch (actionName) {
        case ValkyryScoringFunctionNames.BrynhildrScoring:
            action = BrynhildrScoring;
            break;
        case ValkyryScoringFunctionNames.HildrScoring:
            action = HildrScoring;
            break;
        case ValkyryScoringFunctionNames.OlrunScoring:
            action = OlrunScoring;
            break;
        case ValkyryScoringFunctionNames.SigrdrifaScoring:
            action = SigrdrifaScoring;
            break;
        case ValkyryScoringFunctionNames.SvafaScoring:
            action = SvafaScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};
//# sourceMappingURL=ValkyryScoringDispatcherHelpers.js.map