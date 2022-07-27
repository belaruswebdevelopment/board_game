import { BlacksmithDistinctionAwarding, ExplorerDistinctionAwarding, HunterDistinctionAwarding, MinerDistinctionAwarding, WarriorDistinctionAwarding } from "../helpers/DistinctionAwardingHelpers";
import { DistinctionAwardingFunctionNames } from "../typescript/enums";
/**
 * <h3>Начинает действие по получению преимущества по фракции дворфов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости получить преимущество по фракции дворфов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param action Объект действия.
 * @param params Параметры действия.
 */
export const StartDistinctionAwarding = (G, ctx, action, params) => {
    const actionDispatcher = DistinctionAwardingDispatcherSwitcher(action.name);
    if (action.params === undefined) {
        throw new Error(`Отсутствует обязательный параметр функции 'params'.`);
    }
    return actionDispatcher === null || actionDispatcher === void 0 ? void 0 : actionDispatcher(G, ctx, ...params);
};
/**
* <h3>Диспетчер всех действий по получению преимущества по фракции дворфов.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце 1 эпохи, когда получается преимущество по фракции дворфов.</li>
* </ol>
*
* @param actionName Название действия.
* @returns Действие.
*/
const DistinctionAwardingDispatcherSwitcher = (actionName) => {
    let action, _exhaustiveCheck;
    switch (actionName) {
        case DistinctionAwardingFunctionNames.BlacksmithDistinctionAwarding:
            action = BlacksmithDistinctionAwarding;
            break;
        case DistinctionAwardingFunctionNames.ExplorerDistinctionAwarding:
            action = ExplorerDistinctionAwarding;
            break;
        case DistinctionAwardingFunctionNames.HunterDistinctionAwarding:
            action = HunterDistinctionAwarding;
            break;
        case DistinctionAwardingFunctionNames.MinerDistinctionAwarding:
            action = MinerDistinctionAwarding;
            break;
        case DistinctionAwardingFunctionNames.WarriorDistinctionAwarding:
            action = WarriorDistinctionAwarding;
            break;
        default:
            _exhaustiveCheck = actionName;
            throw new Error(`Нет такого действия '${actionName}'.`);
            return _exhaustiveCheck;
    }
    return action;
};
//# sourceMappingURL=DistinctionAwardingDispatcher.js.map