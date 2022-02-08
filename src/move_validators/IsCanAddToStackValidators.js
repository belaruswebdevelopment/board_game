/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const IsCanPickPickCampCardToStack = (G, card) => {
    const validators = card.validators;
    let isValidMove = false;
    if (validators !== undefined) {
        if (validators.pickCampCardToStack !== undefined) {
            if (G.camp.length > 0) {
                isValidMove = true;
            }
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
 * @param ctx
 */
export const IsCanPickPickDiscardCardToStack = (G, card) => {
    const validators = card.validators;
    let isValidMove = false;
    if (validators !== undefined) {
        if (validators.pickDiscardCardToStack !== undefined) {
            if (G.discardCardsDeck.length > 0) {
                isValidMove = true;
            }
        }
    }
    return isValidMove;
};
//# sourceMappingURL=IsCanAddToStackValidators.js.map