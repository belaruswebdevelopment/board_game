import { AstridScoring, BasicHeroScoring, IdunnScoring } from "../score_helpers/HeroScoringHelpers";
import { HeroScoringFunctionNames } from "../typescript/enums";
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
export const StartHeroScoring = (player, action) => {
    const actionDispatcher = HeroScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(player);
    }
    else {
        return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(player, ...action.params);
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
const HeroScoringDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
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
//# sourceMappingURL=HeroScoringDispatcher.js.map