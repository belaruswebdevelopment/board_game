import { Ctx } from "boardgame.io";
import { IsCanPickPickCampCardToStack, IsCanPickPickDiscardCardToStack } from "../move_validators/IsCanAddToStackValidators";
import { IStack } from "../typescript/action_interfaces";
import { CardsHasStack } from "../typescript/card_types";
import { ValidatorNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IValidatorsConfig } from "../typescript/hero_validator_interfaces";

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
export const AddActionsToStackAfterCurrent = (G: IMyGameState, ctx: Ctx, stack?: IStack[], card?: CardsHasStack):
    void => {
    let isValid = false;
    if (stack !== undefined) {
        if (card !== undefined && `validators` in card) {
            const validators: IValidatorsConfig | undefined = card.validators;
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
        } else {
            isValid = true;
        }
        if (isValid) {
            for (let i: number = stack.length - 1; i >= 0; i--) {
                const playerId: number = stack[i].playerId ?? Number(ctx.currentPlayer);
                G.publicPlayers[playerId].stack.splice(1, 0, stack[i]);
            }
        }
    }
};
