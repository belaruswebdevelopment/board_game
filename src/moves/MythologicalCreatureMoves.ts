import type { Ctx, Move } from "boardgame.io";
import { godConfig } from "../data/MythologicalCreatureData";
import { ThrowMyError } from "../Error";
import { IsGodCard } from "../MythologicalCreature";
import { ErrorNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndef, IGodData, IMyGameState, IPublicPlayer, MythologicalCreatureCommandZoneCardTypes } from "../typescript/interfaces";

/**
 * <h3>Использование способности карты Бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при применении игроком способности карты выбранного Бога.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты Бога.
 * @returns
 */
export const UseGodPowerMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const card: MythologicalCreatureCommandZoneCardTypes | undefined = player.mythologicalCreatureCards[cardId];
    if (card === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта с id '${cardId}'.`);
    } else if (!IsGodCard(card)) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне карта с id '${cardId}' должна быть с типом '${RusCardTypeNames.God}', а не с типом '${card.type}'.`);
    }
    const godCard: CanBeUndef<IGodData> =
        Object.values(godConfig).find((god: IGodData): boolean =>
            god.name === card.name);
    if (godCard === undefined) {
        throw new Error(`Не удалось найти Бога '${card.name}'.`);
    }
    // TODO Use God power ability!?
    godCard.godPower();
};