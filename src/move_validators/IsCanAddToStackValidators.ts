import type { CanBeUndefType, CardsHasStackValidatorsType, IMyGameState, IValidatorsConfig } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с возможностью взятия карт из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из лагеря.</li>
 * </ol>
 *
 * @param G
 * @param card Карта.
 * @returns
 */
export const IsCanPickPickCampCardToStack = (G: IMyGameState, card: CardsHasStackValidatorsType): boolean => {
    const validators: CanBeUndefType<IValidatorsConfig> = card.validators;
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
 * <li>При выборе конкретных карт лагеря, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param G
 * @param card Карта.
 * @returns
 */
export const IsCanPickPickDiscardCardToStack = (G: IMyGameState, card: CardsHasStackValidatorsType): boolean => {
    const validators: CanBeUndefType<IValidatorsConfig> = card.validators;
    let isValidMove = false;
    if (validators?.pickDiscardCardToStack !== undefined) {
        if (G.discardCardsDeck.length > 0) {
            isValidMove = true;
        }
    }
    return isValidMove;
};
