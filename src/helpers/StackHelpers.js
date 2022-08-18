import { ThrowMyError } from "../Error";
import { IsCanPickPickCampCardToStack, IsCanPickPickDiscardCardToStack } from "../move_validators/IsCanAddToStackValidators";
import { ErrorNames, PickCardValidatorNames } from "../typescript/enums";
/**
 * <h3>Добавляет действия в стек действий конкретного игрока после текущего.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости добавить действия в стек действий после текущего.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param stack Стэк действий.
 * @param card Карта.
 */
export const AddActionsToStack = (G, ctx, stack, card) => {
    var _a, _b;
    let isValid = false;
    if (stack !== undefined) {
        if (card !== undefined && `validators` in card) {
            const validators = card.validators;
            if (validators !== undefined) {
                let validator, _exhaustiveCheck;
                for (validator in validators) {
                    if (validator === PickCardValidatorNames.pickDiscardCardToStack) {
                        isValid = IsCanPickPickDiscardCardToStack(G, card);
                    }
                    else if (validator === PickCardValidatorNames.pickCampCardToStack) {
                        isValid = IsCanPickPickCampCardToStack(G, card);
                    }
                    else {
                        _exhaustiveCheck = validator;
                        throw new Error(`Отсутствует валидатор для выбора карты.`);
                        return _exhaustiveCheck;
                    }
                }
            }
            else {
                isValid = true;
            }
        }
        else {
            isValid = true;
        }
        if (isValid) {
            for (let i = 0; i < stack.length; i++) {
                const stackI = stack[i];
                if (stackI === undefined) {
                    throw new Error(`В массиве стека новых действий отсутствует действие с id '${i}'.`);
                }
                stackI.priority = (_a = stackI.priority) !== null && _a !== void 0 ? _a : 0;
                const playerId = (_b = stackI.playerId) !== null && _b !== void 0 ? _b : Number(ctx.currentPlayer), player = G.publicPlayers[playerId];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
                }
                let stackIndex;
                if (stackI.priority === 3) {
                    stackIndex = player.stack.findIndex((stackP, index) => index !== 0 && stackP.priority === stackI.priority);
                    stackIndex = stackIndex === -1 ? player.stack.length : stackIndex;
                }
                else {
                    if (stackI.priority !== 1) {
                        stackIndex =
                            FindLastIndex(player.stack, (stackP, index) => index !== 0 && stackP.priority <= stackI.priority);
                        stackIndex = stackIndex === -1 ? 1 : stackIndex;
                    }
                    else {
                        stackIndex = 0;
                    }
                }
                player.stack.splice(stackIndex, 0, stackI);
            }
        }
    }
};
/**
* <h3>Returns the index of the last element in the array where predicate is true, and -1 otherwise.</h3>
* <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости найти в стеке действий последний вариант по условию поиска.</li>
 * </ol>
 *
* @param array The source array to search in
* @param predicate find calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
*/
const FindLastIndex = (array, predicate) => {
    let l = array.length;
    while (l--) {
        const element = array[l];
        if (element === undefined) {
            throw new Error(`В массиве отсутствует элемент с id ${l}.`);
        }
        if (predicate(element, l, array))
            return l;
    }
    return -1;
};
//# sourceMappingURL=StackHelpers.js.map