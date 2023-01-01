import { CardTypeRusNames, ValkyryNames } from "../typescript/enums";
import type { CanBeUndefType, IValkyryScoringFunction } from "../typescript/interfaces";

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
export const BrynhildrScoring: IValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints = [0, 3, 6, 10, 16],
        strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch,
        value: CanBeUndefType<number> = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${CardTypeRusNames.Valkyry_Card}' '${ValkyryNames.Brynhildr}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
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
export const HildrScoring: IValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints = [0, 8, 16, 0],
        strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch,
        value: CanBeUndefType<number> = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${CardTypeRusNames.Valkyry_Card}' '${ValkyryNames.Hildr}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
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
export const OlrunScoring: IValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints = [0, 3, 6, 10, 16],
        strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch,
        value: CanBeUndefType<number> = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${CardTypeRusNames.Valkyry_Card}' '${ValkyryNames.Olrun}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
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
export const SigrdrifaScoring: IValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints = [0, 0, 8, 16],
        strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch,
        value: CanBeUndefType<number> = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${CardTypeRusNames.Valkyry_Card}' '${ValkyryNames.Sigrdrifa}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
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
export const SvafaScoring: IValkyryScoringFunction = (strengthTokenNotch: number): number => {
    const strengthTokenNotchPoints = [0, 4, 8, 16],
        strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
            strengthTokenNotchPoints.length - 1 : strengthTokenNotch,
        value: CanBeUndefType<number> = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${CardTypeRusNames.Valkyry_Card}' '${ValkyryNames.Svafa}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
};
