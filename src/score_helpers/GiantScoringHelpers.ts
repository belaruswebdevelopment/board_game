import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import type { IGiantScoringFunction, IPublicPlayer } from "../typescript/interfaces";
import { GetRanksValueMultiplier } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по Гиганту, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns
 */
export const BasicGiantScoring: IGiantScoringFunction = (player: IPublicPlayer, value?: number): number => {
    if (value === undefined) {
        throw new Error(`Function param 'value' is undefined.`);
    }
    return value;
};

/**
 * <h3>Получение победных очков по Гиганту Gymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Gymir.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по Гиганту Gymir.
 */
export const GymirScoring = (player: IPublicPlayer): number =>
    GetRanksValueMultiplier(player, SuitNames.explorer, 3);

/**
 * <h3>Получение победных очков по Гиганту Surt.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Surt.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по Гиганту Surt.
 */
export const SurtScoring = (player: IPublicPlayer): number => GetMaxCoinValue(player);
