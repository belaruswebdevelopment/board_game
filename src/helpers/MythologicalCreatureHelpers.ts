import { BuffNames, RusCardTypeNames, ValkyryNames } from "../typescript/enums";
import type { CanBeUndefType, IPublicPlayer, IValkyryCard, MythologicalCreatureCommandZoneCardType } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

export const CheckValkyryRequirement = (player: IPublicPlayer, playerId: number, buffName: BuffNames): void => {
    if (CheckPlayerHasBuff(player, buffName)) {
        let valkyryName: ValkyryNames;
        switch (buffName) {
            // case BuffNames.CountDistinctionAmount:
            //     valkyryName = ValkyryNames.Brynhildr;
            //     break;
            case BuffNames.CountDistinctionAmount:
                valkyryName = ValkyryNames.Hildr;
                break;
            // case BuffNames.CountPickedHeroAmount:
            //     valkyryName = ValkyryNames.Olrun;
            //     break;
            case BuffNames.CountPickedHeroAmount:
                valkyryName = ValkyryNames.Sigrdrifa;
                break;
            // case BuffNames.CountPickedHeroAmount:
            //     valkyryName = ValkyryNames.Svafa;
            //     break;
            default:
                throw new Error(`Нет такого бафа '${buffName}' у мифических существ типа '${RusCardTypeNames.Valkyry_Card}}'.`);
        }
        const valkyryCard: CanBeUndefType<IValkyryCard> =
            player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType):
                boolean => card.name === valkyryName) as CanBeUndefType<IValkyryCard>;
        if (valkyryCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' не удалось найти карту типа '${RusCardTypeNames.Valkyry_Card}' с названием '${valkyryName}'.`);
        }
        if (valkyryCard.strengthTokenNotch === null) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' у карты типа '${RusCardTypeNames.Valkyry_Card}' с названием '${valkyryCard.name}' не может не быть выставлен токен силы.`);
        }
        valkyryCard.strengthTokenNotch += 1;
    }
};
