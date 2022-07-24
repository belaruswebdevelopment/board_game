import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { HeroNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import { GetRanksValueMultiplier } from "./ScoreHelpers";
/**
* <h3>Получение победных очков по героям.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по героям.</li>
* </ol>
*
* @param player Игрок.
* @param heroName Название героя.
* @returns Количество очков по героям.
*/
export const HeroScoring = (player, heroName) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (heroName === undefined) {
        throw new Error(`Function param 'heroName' is undefined.`);
    }
    switch (heroName) {
        case HeroNames.Astrid:
            return AstridScoring(player);
        case HeroNames.Idunn:
            return IdunnScoring(player);
        default:
            throw new Error(`У карт с типом '${RusCardTypeNames.Hero_Card}}' отсутствует герой с названием '${heroName}'.`);
    }
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