import { BasicArtefactScoring, DraupnirScoring, HrafnsmerkiScoring, MjollnirScoring, OdroerirTheMythicCauldronScoring, SvalinnScoring } from "../score_helpers/ArtefactScoringHelpers";
import { ArtefactScoringFunctionNames } from "../typescript/enums";
import type { IAction, IArtefactScoringFunction, MyFnContextWithMyPlayerID, ScoringArgsType } from "../typescript/interfaces";

/**
 * <h3>Начинает действие по получению победных очков по артефакту.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить победные очки по артефакту.</li>
 * </ol>
 *
 * @param G
 * @param action Объект действия.
 * @returns Количество победных очков по артефакту.
 */
export const StartArtefactScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    action: IAction<ArtefactScoringFunctionNames, ScoringArgsType>): number => {
    const actionDispatcher: IArtefactScoringFunction = ArtefactScoringDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        return actionDispatcher?.({ G, ctx, myPlayerID, ...rest });
    } else {
        return actionDispatcher?.({ G, ctx, myPlayerID, ...rest }, ...action.params);
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
const ArtefactScoringDispatcherSwitcher = (actionName: ArtefactScoringFunctionNames): IArtefactScoringFunction => {
    let action: IArtefactScoringFunction,
        _exhaustiveCheck: never;
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
