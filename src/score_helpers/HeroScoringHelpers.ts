import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { ErrorNames, SuitNames } from "../typescript/enums";
import type { BasicHeroScoringType, HeroScoringFunction, MyFnContextWithMyPlayerID, RoyalCoinValueType } from "../typescript/interfaces";
import { GetRanksValueMultiplier } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по герою, не имеющему специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param context
 * @param value Значение.
 * @returns Количество очков по конкретному герою.
 */
export const BasicHeroScoring: HeroScoringFunction = ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
    value?: BasicHeroScoringType): BasicHeroScoringType => {
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
 * @param context
 * @returns Количество очков по конкретному герою.
 */
export const AstridScoring: HeroScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    RoyalCoinValueType => GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });

/**
 * <h3>Получение победных очков по герою Idunn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Idunn.</li>
 * </ol>
 *
 * @param context
 * @returns Количество очков по конкретному герою.
 */
export const IdunnScoring: HeroScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => GetRanksValueMultiplier({ G, ctx, myPlayerID, ...rest }, SuitNames.explorer, 2);
