import { AssertOneOrTwoOrThreeOrFour, AssertZeroOrOneOrTwoOrThree } from "../is_helpers/AssertionTypeHelpers";
import type { StrengthTokenFiveNotchPointsType, StrengthTokenFourNotchPointsType, ValkyryScoringFunction } from "../typescript/interfaces";

/**
 * <h3>Получение победных очков по мифическому существу Brynhildr.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Brynhildr.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по мифическому существу Brynhildr.
 */
export const BrynhildrScoring: ValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints: StrengthTokenFiveNotchPointsType = [0, 3, 6, 10, 16],
        strengthTokenNotchFinalValue: number = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertOneOrTwoOrThreeOrFour(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};

/**
 * <h3>Получение победных очков по мифическому существу Hildr.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Hildr.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по мифическому существу Hildr.
 */
export const HildrScoring: ValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints: StrengthTokenFourNotchPointsType = [0, 8, 16, 0],
        strengthTokenNotchFinalValue: number = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertZeroOrOneOrTwoOrThree(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};

/**
 * <h3>Получение победных очков по мифическому существу Olrun.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Olrun.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по мифическому существу Olrun.
 */
export const OlrunScoring: ValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints: StrengthTokenFiveNotchPointsType = [0, 3, 6, 10, 16],
        strengthTokenNotchFinalValue: number = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertOneOrTwoOrThreeOrFour(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};

/**
 * <h3>Получение победных очков по мифическому существу Sigrdrifa.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Sigrdrifa.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по мифическому существу Sigrdrifa.
 */
export const SigrdrifaScoring: ValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints: StrengthTokenFourNotchPointsType = [0, 0, 8, 16],
        strengthTokenNotchFinalValue: number = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertZeroOrOneOrTwoOrThree(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};

/**
 * <h3>Получение победных очков по мифическому существу Svafa.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Svafa.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по мифическому существу Svafa.
 */
export const SvafaScoring: ValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints: StrengthTokenFourNotchPointsType = [0, 4, 8, 16],
        strengthTokenNotchFinalValue: number = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertZeroOrOneOrTwoOrThree(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};
