import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { ErrorNames, SuitNames } from "../typescript/enums";
import { GetRanksValueMultiplier } from "./ScoreHelpers";
/**
 * <h3>Получение победных очков по герою, не имеющему специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному герою.
 */
export const BasicHeroScoring = ({ G, ctx, ...rest }, value) => {
    if (value === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionParamIsUndefined, `value`);
    }
    return value;
};
/**
 * <h3>Получение победных очков по герою Astrid.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Astrid.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному герою.
 */
export const AstridScoring = ({ G, ctx, myPlayerID, ...rest }) => GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });
/**
 * <h3>Получение победных очков по герою Idunn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Idunn.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному герою.
 */
export const IdunnScoring = ({ G, ctx, myPlayerID, ...rest }) => GetRanksValueMultiplier({ G, ctx, myPlayerID, ...rest }, SuitNames.explorer, 2);
//# sourceMappingURL=HeroScoringHelpers.js.map