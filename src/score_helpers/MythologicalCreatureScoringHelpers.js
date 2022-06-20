import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { GiantNames, MythicalAnimalNames, RusCardTypes, SuitNames, ValkyryNames } from "../typescript/enums";
import { GetRanksValueMultiplier } from "./ScoreHelpers";
/**
 * <h3>Получение победных очков по валькириям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по валькириям.</li>
 * </ol>
 *
 * @param strengthTokenNotch Значение токена силы.
 * @returns Количество очков по валькириям.
 */
export const ValkyryScoring = (strengthTokenNotch, valkyryName) => {
    switch (valkyryName) {
        case ValkyryNames.Brynhildr:
            return BrynhildrScoring(strengthTokenNotch);
        case ValkyryNames.Hildr:
            return HildrScoring(strengthTokenNotch);
        case ValkyryNames.Olrun:
            return OlrunScoring(strengthTokenNotch);
        case ValkyryNames.Sigrdrifa:
            return SigrdrifaScoring(strengthTokenNotch);
        case ValkyryNames.Svafa:
            return SvafaScoring(strengthTokenNotch);
        default:
            throw new Error(`У мифических существ типа '${RusCardTypes.Valkyry}}' отсутствует существо с названием '${valkyryName}'.`);
    }
};
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
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch, value = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${RusCardTypes.Valkyry}' '${ValkyryNames.Brynhildr}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
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
export const HildrScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 8, 16, 0], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch, value = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${RusCardTypes.Valkyry}' '${ValkyryNames.Hildr}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
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
export const OlrunScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 3, 6, 10, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch, value = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${RusCardTypes.Valkyry}' '${ValkyryNames.Olrun}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
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
export const SigrdrifaScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 0, 8, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch, value = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${RusCardTypes.Valkyry}' '${ValkyryNames.Sigrdrifa}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
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
export const SvafaScoring = (strengthTokenNotch) => {
    const strengthTokenNotchPoints = [0, 4, 8, 16], strengthTokenNotchFinalValue = strengthTokenNotch > (strengthTokenNotchPoints.length - 1) ?
        strengthTokenNotchPoints.length - 1 : strengthTokenNotch, value = strengthTokenNotchPoints[strengthTokenNotchFinalValue];
    if (value === undefined) {
        throw new Error(`В массиве значений количества очков у карты типа '${RusCardTypes.Valkyry}' '${ValkyryNames.Svafa}' отсутствует отсутствует значение токена силы на отметке '${strengthTokenNotch}'.`);
    }
    return value;
};
/**
 * <h3>Получение победных очков по мифическим животным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическим животным.</li>
 * </ol>
 *
 * @param player Игрок.
 * @param suit Фракция мистического животного.
 * @param mythicalAnimalName Название мистического животного.
 * @returns Количество очков по мифическим животным.
 */
export const MythicalAnimalScoring = (player, mythicalAnimalName) => {
    switch (mythicalAnimalName) {
        case MythicalAnimalNames.Garm:
            return GarmScoring(player);
        case MythicalAnimalNames.Nidhogg:
            return NidhoggScoring(player);
        default:
            throw new Error(`У карт с типом '${RusCardTypes.Mythical_Animal}' отсутствует ${RusCardTypes.Mythical_Animal} с названием '${mythicalAnimalName}'.`);
    }
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
export const GarmScoring = (player) => GetRanksValueMultiplier(player, SuitNames.Explorer, 1);
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
export const NidhoggScoring = (player) => GetRanksValueMultiplier(player, SuitNames.Warrior, 2);
/**
* <h3>Получение победных очков по гигантам.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по гигантам.</li>
* </ol>
*
* @param player Игрок.
* @param giantName Название гиганта.
* @returns Количество очков по гигантам.
*/
export const GiantScoring = (player, giantName) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (giantName === undefined) {
        throw new Error(`Function param 'giantName' is undefined.`);
    }
    switch (giantName) {
        case GiantNames.Gymir:
            return GymirScoring(player);
        case GiantNames.Surt:
            return SurtScoring(player);
        default:
            throw new Error(`У карт с типом '${RusCardTypes.Giant}' отсутствует ${RusCardTypes.Giant} с названием '${giantName}'.`);
    }
};
/**
 * <h3>Получение победных очков по мифическому существу Gymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Gymir.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по мифическому существу Gymir.
 */
export const GymirScoring = (player) => GetRanksValueMultiplier(player, SuitNames.Explorer, 3);
/**
 * <h3>Получение победных очков по мифическому существу Surt.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по мифическому существу Surt.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по мифическому существу Surt.
 */
export const SurtScoring = (player) => GetMaxCoinValue(player);
//# sourceMappingURL=MythologicalCreatureScoringHelpers.js.map