import { BasicGiantScoring, GymirScoring, SurtScoring } from "../score_helpers/GiantScoringHelpers";
import { GiantScoringFunctionNames } from "../typescript/enums";
import type { Action, GiantScoringArgsCanBeUndefType, GiantScoringFunction, MyFnContextWithMyPlayerID } from "../typescript/interfaces";

/**
 * <h3>Начинает действие по получению победных очков по Гиганту.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по Гиганту.</li>
 * </ol>
 *
 * @param context
 * @param action Объект действия.
 * @returns Количество победных очков по Гиганту.
 */
export const StartGiantScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    action: Action<GiantScoringFunctionNames, GiantScoringArgsCanBeUndefType>): number => {
    const actionDispatcher: GiantScoringFunction = GiantScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        throw new Error(`Отсутствует обязательный параметр функции 'params'.`);
    }
    return actionDispatcher?.({ G, ctx, myPlayerID, ...rest }, ...action.params);
};

/**
* <h3>Диспетчер всех действий по получению победных очков по Гиганту.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по Гиганту.</li>
* </ol>
*
* @param actionName Название действия.
* @returns Действие.
*/
const GiantScoringDispatcherSwitcher = (actionName: GiantScoringFunctionNames): GiantScoringFunction => {
    let action: GiantScoringFunction,
        _exhaustiveCheck: never;
    switch (actionName) {
        case GiantScoringFunctionNames.BasicGiantScoring:
            action = BasicGiantScoring;
            break;
        case GiantScoringFunctionNames.GymirScoring:
            action = GymirScoring;
            break;
        case GiantScoringFunctionNames.SurtScoring:
            action = SurtScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};
