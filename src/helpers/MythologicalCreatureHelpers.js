import { ThrowMyError } from "../Error";
import { IsValkyryCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { CardTypeRusNames, CommonBuffNames, ErrorNames, ValkyryBuffNames, ValkyryNames } from "../typescript/enums";
import { CheckPlayerHasBuff, GetBuffValue } from "./BuffHelpers";
/**
 * <h3>Проверяет выполнение условия свойства валькирии Olrun.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при каждом действии, которое может выполнить условие свойства валькирии Olrun.</li>
 * </ol>
 *
 * @param context
 * @returns Может ли быть выполнено свойство валькирии Olrun.
 */
export const CheckIfRecruitedCardEqualSuitIdForOlrun = ({ G, ctx, myPlayerID, ...rest }, suit) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const chosenSuit = GetBuffValue({ G, ctx, myPlayerID, ...rest }, CommonBuffNames.SuitIdForOlrun);
    if (chosenSuit === true) {
        throw new Error(`У бафа с названием '${CommonBuffNames.SuitIdForOlrun}' не может не быть выбрана фракция.`);
    }
    if (suit === chosenSuit) {
        return true;
    }
    return false;
};
/**
 * <h3>Проверяет выполнение условия свойства валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при каждом действии, которое может выполнить условие свойства валькирии.</li>
 * </ol>
 *
 * @param context
 * @param buffName Баф.
 * @returns
 */
export const CheckValkyryRequirement = ({ G, ctx, myPlayerID, ...rest }, buffName) => {
    // TODO Check only if not maximum count!
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, buffName)) {
        let valkyryName, _exhaustiveCheck;
        switch (buffName) {
            case ValkyryBuffNames.CountBidWinnerAmount:
                valkyryName = ValkyryNames.Brynhildr;
                break;
            case ValkyryBuffNames.CountDistinctionAmount:
                valkyryName = ValkyryNames.Hildr;
                break;
            case ValkyryBuffNames.CountPickedCardClassRankAmount:
                valkyryName = ValkyryNames.Olrun;
                break;
            case ValkyryBuffNames.CountPickedHeroAmount:
                valkyryName = ValkyryNames.Sigrdrifa;
                break;
            case ValkyryBuffNames.CountBettermentAmount:
                valkyryName = ValkyryNames.Svafa;
                break;
            default:
                _exhaustiveCheck = buffName;
                throw new Error(`Нет такого бафа '${buffName}' у мифических существ типа '${CardTypeRusNames.ValkyryCard}}'.`);
                return _exhaustiveCheck;
        }
        const valkyryCard = player.mythologicalCreatureCards.find((card) => card.name === valkyryName);
        if (valkyryCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' не удалось найти карту типа '${CardTypeRusNames.ValkyryCard}' с названием '${valkyryName}'.`);
        }
        if (!IsValkyryCard(valkyryCard)) {
            throw new Error(`У игрока '${player.nickname}' не может присутствовать карта с типом '${valkyryCard.type}' с названием '${valkyryName}'.`);
        }
        if (valkyryCard.strengthTokenNotch === null) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' у карты типа '${CardTypeRusNames.ValkyryCard}' с названием '${valkyryCard.name}' не может не быть выставлен токен силы.`);
        }
        valkyryCard.strengthTokenNotch += 1;
    }
};
//# sourceMappingURL=MythologicalCreatureHelpers.js.map