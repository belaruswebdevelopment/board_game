import { BuffNames, RusCardTypes, ValkyryNames } from "../typescript/enums";
import type { BuffTypes, IPublicPlayer, IValkyryCard, MythologicalCreatureCommandZoneCardTypes } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

//TODO Move all logic in one func
export const CheckValkyryRequirement = (player: IPublicPlayer, playerId: number, buffName: BuffTypes): void => {
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
                throw new Error(`Нет такого бафа '${buffName}' у мифических существ типа '${RusCardTypes.Valkyry}}'.`);
        }
        const valkyryCard: IValkyryCard | undefined =
            player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardTypes):
                boolean => card.name === valkyryName) as IValkyryCard | undefined;
        if (valkyryCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' не удалось найти карту типа '${RusCardTypes.Valkyry}' с названием '${valkyryName}'.`);
        }
        if (valkyryCard.strengthTokenNotch === null) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' у карты типа '${RusCardTypes.Valkyry}' с названием '${valkyryCard.name}' не может не быть выставлен токен силы.`);
        }
        valkyryCard.strengthTokenNotch += 1;
    }
};
