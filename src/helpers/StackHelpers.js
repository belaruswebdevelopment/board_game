import { IsCanPickPickCampCardToStack, IsCanPickPickDiscardCardToStack } from "../move_validators/IsCanAddToStackValidators";
import { ValidatorNames } from "../typescript/enums";
/**
 * <h3>Добавляет действия в стэк действий конкретного игрока после текущего.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости добавить действия в стэк действий после текущего.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param stack Стэк действий.
 * @param card Карта.
 */
export const AddActionsToStackAfterCurrent = (G, ctx, stack, card) => {
    var _a, _b;
    let isValid = false;
    if (stack !== undefined) {
        if (card !== undefined && `validators` in card) {
            const validators = card.validators;
            if (validators !== undefined) {
                for (const validator in validators) {
                    if (Object.prototype.hasOwnProperty.call(validators, validator)) {
                        switch (validator) {
                            case ValidatorNames.PickDiscardCardToStack:
                                isValid = IsCanPickPickDiscardCardToStack(G, card);
                                break;
                            case ValidatorNames.PickCampCardToStack:
                                isValid = IsCanPickPickCampCardToStack(G, card);
                                break;
                            default:
                                isValid = true;
                                break;
                        }
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
            for (let i = stack.length - 1; i >= 0; i--) {
                const playerId = (_b = (_a = stack[i]) === null || _a === void 0 ? void 0 : _a.playerId) !== null && _b !== void 0 ? _b : Number(ctx.currentPlayer), player = G.publicPlayers[playerId];
                if (player !== undefined) {
                    const stackI = stack[i];
                    if (stackI !== undefined) {
                        player.stack.splice(1, 0, stackI);
                    }
                    else {
                        throw new Error(`В массиве новых действий отсутствует стэк ${i}.`);
                    }
                }
                else {
                    throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
                }
            }
        }
    }
};
//# sourceMappingURL=StackHelpers.js.map