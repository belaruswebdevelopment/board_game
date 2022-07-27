import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import { GetRanksValueMultiplier } from "./ScoreHelpers";
/**
 * <h3>Получение победных очков по герою, не имеющему специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns
 */
export const BasicHeroScoring = (player, value) => {
    if (value === undefined) {
        throw new Error(`Function param 'value' is undefined.`);
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
 * @returns Количество очков по герою Astrid.
 */
export const AstridScoring = (player) => GetMaxCoinValue(player);
/**
 * <h3>Получение победных очков по герою Idunn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Idunn.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по герою Idunn.
 */
export const IdunnScoring = (player) => GetRanksValueMultiplier(player, SuitNames.explorer, 2);
//# sourceMappingURL=HeroScoringHelpers.js.map