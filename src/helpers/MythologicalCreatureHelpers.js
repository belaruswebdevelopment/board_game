import { BuffNames, RusCardTypes, ValkyryNames } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
//TODO Move all logic in one func
export const CheckValkyryRequirement = (player, playerId, buffName) => {
    if (CheckPlayerHasBuff(player, buffName)) {
        let valkyryName;
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
        const valkyryCard = player.mythologicalCreatureCards.find((card) => card.name === valkyryName);
        if (valkyryCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' не удалось найти карту типа '${RusCardTypes.Valkyry}' с названием '${valkyryName}'.`);
        }
        if (valkyryCard.strengthTokenNotch === null) {
            throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' у карты типа '${RusCardTypes.Valkyry}' с названием '${valkyryCard.name}' не может не быть выставлен токен силы.`);
        }
        valkyryCard.strengthTokenNotch += 1;
    }
};
//# sourceMappingURL=MythologicalCreatureHelpers.js.map