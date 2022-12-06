import { ThrowMyError } from "../Error";
import { ErrorNames, SuitNames } from "../typescript/enums";
import { GetRanksValueMultiplier } from "./ScoreHelpers";
/**
 * <h3>Получение победных очков по Мифическому животному, не имеющему специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Мифическому животному, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному мифическому животному.
 */
export const BasicMythicalAnimalScoring = ({ G, ctx, ...rest }, value) => {
    if (value === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionParamIsUndefined, `value`);
    }
    return value;
};
/**
 * <h3>Получение победных очков по мифическому существу Garm.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Garm.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному мифическому животному.
 */
export const GarmScoring = ({ G, ctx, myPlayerID, ...rest }) => GetRanksValueMultiplier({ G, ctx, myPlayerID, ...rest }, SuitNames.explorer, 1);
/**
 * <h3>Получение победных очков по мифическому существу Nidhogg.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Nidhogg.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному мифическому животному.
 */
export const NidhoggScoring = ({ G, ctx, myPlayerID, ...rest }) => GetRanksValueMultiplier({ G, ctx, myPlayerID, ...rest }, SuitNames.warrior, 2);
//# sourceMappingURL=MythicalAnimalScoringHelpers.js.map