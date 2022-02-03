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
 */
export const AddActionsToStackAfterCurrent = (G, ctx, stack, card) => {
    var _a;
    let isValid = false;
    if (stack !== undefined) {
        if (card !== undefined && `validators` in card) {
            const validators = card.validators;
            for (const validator in validators) {
                if (Object.prototype.hasOwnProperty.call(validators, validator)) {
                    switch (validator) {
                        case ValidatorNames.PickDiscardCardToStack:
                            isValid = IsCanPickPickCampCardToStack(G, card);
                            break;
                        case ValidatorNames.PickCampCardToStack:
                            isValid = IsCanPickPickDiscardCardToStack(G, card);
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
        if (isValid) {
            for (let i = stack.length - 1; i >= 0; i--) {
                const playerId = (_a = stack[i].playerId) !== null && _a !== void 0 ? _a : Number(ctx.currentPlayer);
                G.publicPlayers[playerId].stack.splice(1, 0, stack[i]);
            }
        }
    }
};
/**
 * <h3>Завершает действие из стэка действий указанного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Выполняется при необходимости завершить действие в стэке действий указанного игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 */
export const EndActionForChosenPlayer = (G, ctx, playerId) => {
    G.publicPlayers[playerId].stack = [];
    let activePlayers = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const activePlayersKey in ctx.activePlayers) {
        activePlayers++;
    }
    if (activePlayers === 1) {
        // TODO Check: G.publicPlayers[Number(ctx.currentPlayer)].stack = [];
        G.publicPlayers[Number(ctx.currentPlayer)].stack.shift();
    }
};
//# sourceMappingURL=StackHelpers.js.map