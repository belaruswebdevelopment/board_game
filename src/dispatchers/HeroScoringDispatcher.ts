import { AstridScoring, BasicHeroScoring, IdunnScoring } from "../score_helpers/HeroScoringHelpers";
import { HeroScoringFunctionNames } from "../typescript/enums";
import type { Action, HeroScoringArgsCanBeUndefType, HeroScoringFunction, MyFnContextWithMyPlayerID } from "../typescript/interfaces";

/**
 * <h3>Начинает действие по получению победных очков по герою.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по герою.</li>
 * </ol>
 *
 * @param context
 * @param action Объект действия.
 * @returns Количество победных очков по герою.
 */
export const StartHeroScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    action: Action<HeroScoringFunctionNames, HeroScoringArgsCanBeUndefType>): number => {
    const actionDispatcher: HeroScoringFunction = HeroScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        return actionDispatcher?.({ G, ctx, myPlayerID, ...rest });
    } else {
        return actionDispatcher?.({ G, ctx, myPlayerID, ...rest }, ...action.params);
    }
};

/**
* <h3>Диспетчер всех действий по получению победных очков по герою.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по герою.</li>
* </ol>
*
* @param actionName Название действия.
* @returns Действие.
*/
const HeroScoringDispatcherSwitcher = (actionName: HeroScoringFunctionNames): HeroScoringFunction => {
    let action: HeroScoringFunction,
        _exhaustiveCheck: never;
    switch (actionName) {
        case HeroScoringFunctionNames.BasicHeroScoring:
            action = BasicHeroScoring;
            break;
        case HeroScoringFunctionNames.AstridScoring:
            action = AstridScoring;
            break;
        case HeroScoringFunctionNames.IdunnScoring:
            action = IdunnScoring;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия.`);
            return _exhaustiveCheck;
    }
    return action;
};
