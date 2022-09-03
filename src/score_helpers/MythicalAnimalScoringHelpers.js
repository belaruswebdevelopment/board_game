import { SuitNames } from "../typescript/enums";
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
export const BasicMythicalAnimalScoring = (player, value) => {
    if (value === undefined) {
        throw new Error(`Function param 'value' is undefined.`);
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
export const GarmScoring = (player) => GetRanksValueMultiplier(player, SuitNames.explorer, 1);
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
export const NidhoggScoring = (player) => GetRanksValueMultiplier(player, SuitNames.warrior, 2);
//# sourceMappingURL=MythicalAnimalScoringHelpers.js.map