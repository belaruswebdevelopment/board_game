/**
 * <h3>Действия, связанные с возможностью взятия карт из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из лагеря.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Возможен ли выбор карты из лагеря.
 */
export const IsCanPickPickCampCardToStack = ({ G }, card) => {
    const validators = card.validators;
    let isValidMove = false;
    if ((validators === null || validators === void 0 ? void 0 : validators.pickCampCardToStack) !== undefined) {
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
 * @param context
 * @param card Карта.
 * @returns Возможен ли выбор карты из колоды сброса.
 */
export const IsCanPickPickDiscardCardToStack = ({ G }, card) => {
    const validators = card.validators;
    let isValidMove = false;
    if ((validators === null || validators === void 0 ? void 0 : validators.pickDiscardCardToStack) !== undefined) {
        if (G.discardCardsDeck.length > 0) {
            isValidMove = true;
        }
    }
    return isValidMove;
};
//# sourceMappingURL=IsCanAddToStackValidators.js.map