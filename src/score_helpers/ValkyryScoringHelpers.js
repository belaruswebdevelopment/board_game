import { AssertStrengthTokenNotchLongMax, AssertStrengthTokenNotchShortMax } from "../is_helpers/AssertionTypeHelpers";
// TODO Add strengthTokenNotch type and do it can't be more then max strengthTokenNotch value!
// TODO Add all types here as 0 | 3 | 6 | 10 | 16 ...?
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
export const BrynhildrScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 3, 6, 10, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertStrengthTokenNotchLongMax(strengthTokenNotchFinalValue);
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
export const HildrScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 8, 16, 0], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertStrengthTokenNotchShortMax(strengthTokenNotchFinalValue);
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
export const OlrunScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 3, 6, 10, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertStrengthTokenNotchLongMax(strengthTokenNotchFinalValue);
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
export const SigrdrifaScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 0, 8, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertStrengthTokenNotchShortMax(strengthTokenNotchFinalValue);
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
export const SvafaScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 4, 8, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch;
    AssertStrengthTokenNotchShortMax(strengthTokenNotchFinalValue);
    return strengthTokenNotchPoints[strengthTokenNotchFinalValue];
};
//# sourceMappingURL=ValkyryScoringHelpers.js.map