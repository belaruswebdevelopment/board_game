import type { CardsHasStackValidators, IMyGameState, IValidatorsConfig } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param card Карта.
 */
export const IsCanPickPickCampCardToStack = (G: IMyGameState, card: CardsHasStackValidators): boolean => {
    const validators: IValidatorsConfig | undefined = card.validators;
    let isValidMove = false;
    if (validators?.pickCampCardToStack !== undefined) {
        if (G.camp.length > 0) {
            isValidMove = true;
        }
    }
    return isValidMove;
};

/**
 * <h3>Действия, связанные с возможностью взятия карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из колоды сброса.</li>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param G
 * @param card Карта.
 */
export const IsCanPickPickDiscardCardToStack = (G: IMyGameState, card: CardsHasStackValidators): boolean => {
    const validators: IValidatorsConfig | undefined = card.validators;
    let isValidMove = false;
    if (validators?.pickDiscardCardToStack !== undefined) {
        if (G.discardCardsDeck.length > 0) {
            isValidMove = true;
        }
    }
    return isValidMove;
};
