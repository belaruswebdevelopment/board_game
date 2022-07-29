import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { BuffNames, ErrorNames, RusCardTypeNames, ValkyryNames } from "../typescript/enums";
import type { CanBeUndefType, IMyGameState, IPublicPlayer, IValkyryCard, MythologicalCreatureCommandZoneCardType } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

/**
 * <h3>Проверяет выполнение условия свойства валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при каждом действии, которое может выполнить условие свойства валькирии.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @param buffName Баф.
 */
export const CheckValkyryRequirement = (G: IMyGameState, ctx: Ctx, playerId: number, buffName: BuffNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (CheckPlayerHasBuff(player, buffName)) {
        let valkyryName: ValkyryNames;
        switch (buffName) {
            // TODO Fix all buffs!
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
