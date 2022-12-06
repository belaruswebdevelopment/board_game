import { ThrowMyError } from "../Error";
import { IsCanPickPickCampCardToStack, IsCanPickPickDiscardCardToStack } from "../move_validators/IsCanAddToStackValidators";
import { ErrorNames, PickCardValidatorNames } from "../typescript/enums";
import type { CanBeUndefType, CardsHasStackType, IPublicPlayer, IStack, MyFnContextWithMyPlayerID, PickCardValidatorNamesKeyofTypeofType, ValidatorsConfigType } from "../typescript/interfaces";

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
 * @returns
 */
export const AddActionsToStack = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, stack?: IStack[],
    card?: CardsHasStackType): void => {
    let isValid = false;
    if (stack !== undefined) {
        if (card !== undefined && `validators` in card) {
            const validators: CanBeUndefType<ValidatorsConfigType> = card.validators;
            if (validators !== undefined) {
                let validator: PickCardValidatorNamesKeyofTypeofType,
                    _exhaustiveCheck: never;
                for (validator in validators) {
                    if (validator === PickCardValidatorNames.pickDiscardCardToStack) {
                        isValid =
                            IsCanPickPickDiscardCardToStack({ G, ctx, myPlayerID, ...rest }, card);
                    } else if (validator === PickCardValidatorNames.pickCampCardToStack) {
                        isValid = IsCanPickPickCampCardToStack({ G, ctx, myPlayerID, ...rest }, card);
                    } else {
                        _exhaustiveCheck = validator;
                        throw new Error(`Отсутствует валидатор для выбора карты.`);
                        return _exhaustiveCheck;
                    }
                }
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
        if (isValid) {
            for (let i = 0; i < stack.length; i++) {
                const stackI: CanBeUndefType<IStack> = stack[i];
                if (stackI === undefined) {
                    throw new Error(`В массиве стека новых действий отсутствует действие с id '${i}'.`);
                }
                stackI.priority = stackI.priority ?? 0;
                const playerId: number = stackI.playerId ?? Number(ctx.currentPlayer),
                    player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        myPlayerID);
                }
                let stackIndex: number;
                if (stackI.priority === 3) {
                    stackIndex = player.stack.findIndex((stackP: IStack, index: number): boolean =>
                        index !== 0 && stackP.priority === stackI.priority);
                    stackIndex = stackIndex === -1 ? player.stack.length : stackIndex;
                } else {
                    if (stackI.priority !== 1) {
                        stackIndex =
                            FindLastIndex(player.stack, (stackP: IStack, index: number): boolean => {
                                if (stackI.priority === undefined) {
                                    throw new Error(`В массиве стека новых действий отсутствует действие с названием 'priority'.`);
                                }
                                if (stackP.priority === undefined) {
                                    throw new Error(`В массиве стека действий отсутствует действие с названием 'priority'.`);
                                }
                                return index !== 0 && stackP.priority <= stackI.priority;
                            });
                        stackIndex = stackIndex === -1 ? 1 : stackIndex;
                    } else {
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
* @param predicate Find calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
*/
const FindLastIndex = <T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number => {
    let l: number = array.length;
    while (l--) {
        const element: CanBeUndefType<T> = array[l];
        if (element === undefined) {
            throw new Error(`В массиве отсутствует элемент с id ${l}.`);
        }
        if (predicate(element, l, array))
            return l;
    }
    return -1;
};
