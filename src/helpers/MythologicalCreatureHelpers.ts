import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, RusCardTypeNames, SuitNames, ValkyryBuffNames, ValkyryNames } from "../typescript/enums";
import type { BuffValueType, CanBeUndefType, IPublicPlayer, IValkyryCard, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType } from "../typescript/interfaces";
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
export const CheckIfRecruitedCardHasNotLeastRankOfChosenClass = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID, suit: SuitNames): boolean => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const chosenSuit: BuffValueType = GetBuffValue({ G, ctx, myPlayerID, ...rest }, BuffNames.SuitIdForOlrun);
    if (chosenSuit === true) {
        throw new Error(`У бафа с названием '${BuffNames.SuitIdForOlrun}' не может не быть выбрана фракция.`);
    }
    const recruitedCardRank: number = player.cards[suit].reduce(TotalRank, 0),
        chosenClassRank: number = player.cards[chosenSuit].reduce(TotalRank, 0);
    if (recruitedCardRank >= chosenClassRank) {
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
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
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
                throw new Error(`Нет такого бафа '${buffName}' у мифических существ типа '${RusCardTypeNames.Valkyry_Card}}'.`);
        }
        const valkyryCard: CanBeUndefType<IValkyryCard> =
            player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType):
                boolean => card.name === valkyryName) as CanBeUndefType<IValkyryCard>;
        if (valkyryCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' не удалось найти карту типа '${RusCardTypeNames.Valkyry_Card}' с названием '${valkyryName}'.`);
        }
        if (valkyryCard.strengthTokenNotch === null) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' у карты типа '${RusCardTypeNames.Valkyry_Card}' с названием '${valkyryCard.name}' не может не быть выставлен токен силы.`);
        }
        valkyryCard.strengthTokenNotch += 1;
    }
};
