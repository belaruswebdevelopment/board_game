import { BlacksmithScoring, ExplorerScoring, HunterScoring, MinerScoring, WarriorScoring } from "../score_helpers/SuitScoringHelpers";
import { SuitScoringFunctionNames } from "../typescript/enums";
import type { Action, SuitScoringArgsType, SuitScoringFunction } from "../typescript/interfaces";

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
export const StartSuitScoring = (action: Action<SuitScoringFunctionNames>, params: SuitScoringArgsType): number => {
    const actionDispatcher: SuitScoringFunction = SuitScoringDispatcherSwitcher(action.name);
    return actionDispatcher?.(...params);
};

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
const SuitScoringDispatcherSwitcher = (actionName: SuitScoringFunctionNames): SuitScoringFunction => {
    let action: SuitScoringFunction,
        _exhaustiveCheck: never;
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
