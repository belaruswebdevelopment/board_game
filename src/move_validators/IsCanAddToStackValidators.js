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
    var _a;
    if (((_a = card.validators) === null || _a === void 0 ? void 0 : _a.pickCampCardToStack) !== undefined) {
        if (G.camp.length > 0) {
            return true;
        }
    }
    return false;
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
    var _a;
    if (((_a = card.validators) === null || _a === void 0 ? void 0 : _a.pickDiscardCardToStack) !== undefined) {
        if (G.discardCardsDeck.length > 0) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=IsCanAddToStackValidators.js.map