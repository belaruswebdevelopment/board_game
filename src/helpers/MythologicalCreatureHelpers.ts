import { ThrowMyError } from "../Error";
import { IsValkyryCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { CardTypeRusNames, CommonBuffNames, ErrorNames, SuitNames, ValkyryBuffNames, ValkyryNames } from "../typescript/enums";
import type { BuffValueType, CanBeUndefType, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType, PublicPlayer } from "../typescript/interfaces";
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
export const CheckIfRecruitedCardEqualSuitIdForOlrun = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID, suit: SuitNames): boolean => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const chosenSuit: BuffValueType =
        GetBuffValue({ G, ctx, myPlayerID, ...rest }, CommonBuffNames.SuitIdForOlrun);
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
export const CheckValkyryRequirement = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    buffName: ValkyryBuffNames): void => {
    // TODO Check only if not maximum count!
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, buffName)) {
        let valkyryName: ValkyryNames;
        // TODO Add _exhaustiveCheck and rework all buffs for diff ValkyryBuffNames etc.!
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
                throw new Error(`Нет такого бафа '${buffName}' у мифических существ типа '${CardTypeRusNames.ValkyryCard}}'.`);
        }
        const valkyryCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
            player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType):
                boolean => card.name === valkyryName);
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
