import { SuitNames } from "../typescript/enums";
import type { IMythicalAnimalScoringFunction, IPublicPlayer } from "../typescript/interfaces";
import { GetRanksValueMultiplier } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по Мифическому животному, не имеющему специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Мифическому животному, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns
 */
export const BasicMythicalAnimalScoring: IMythicalAnimalScoringFunction = (player: IPublicPlayer, value?: number): number => {
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
 * @returns Количество очков по мифическому существу Garm.
 */
export const GarmScoring: IMythicalAnimalScoringFunction = (player: IPublicPlayer): number =>
    GetRanksValueMultiplier(player, SuitNames.explorer, 1);

/**
 * <h3>Получение победных очков по мифическому существу Nidhogg.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Nidhogg.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по мифическому существу Nidhogg.
 */
export const NidhoggScoring: IMythicalAnimalScoringFunction = (player: IPublicPlayer): number =>
    GetRanksValueMultiplier(player, SuitNames.warrior, 2);
