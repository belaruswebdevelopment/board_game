import { AstridScoring, BasicHeroScoring, IdunnScoring } from "../score_helpers/HeroScoringHelpers";
import { HeroScoringFunctionNames } from "../typescript/enums";
import type { IAction, IHeroScoringFunction, IPublicPlayer, ScoringArgsType } from "../typescript/interfaces";

/**
 * <h3>Начинает действие по получению победных очков по герою.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по герою.</li>
 * </ol>
 *
 * @param player Игрок.
 * @param action Объект действия.
 * @returns Количество победных очков по герою.
 */
export const StartHeroScoring = (player: IPublicPlayer, action: IAction<HeroScoringFunctionNames, ScoringArgsType>):
    number => {
    const actionDispatcher: IHeroScoringFunction = HeroScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        return actionDispatcher?.(player);
    } else {
        return actionDispatcher?.(player, ...action.params);
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
const HeroScoringDispatcherSwitcher = (actionName: HeroScoringFunctionNames): IHeroScoringFunction => {
    let action: IHeroScoringFunction,
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
            throw new Error(`Нет такого действия '${actionName}'.`);
            return _exhaustiveCheck;
    }
    return action;
};
