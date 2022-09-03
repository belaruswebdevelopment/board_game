import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import type { IHeroScoringFunction, IPublicPlayer } from "../typescript/interfaces";
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
export const BasicHeroScoring: IHeroScoringFunction = (player: IPublicPlayer, value?: number): number => {
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
 * @returns Количество очков по конкретному герою.
 */
export const AstridScoring: IHeroScoringFunction = (player: IPublicPlayer): number => GetMaxCoinValue(player);

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
export const IdunnScoring: IHeroScoringFunction = (player: IPublicPlayer): number =>
    GetRanksValueMultiplier(player, SuitNames.explorer, 2);
