import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { godConfig } from "../data/MythologicalCreatureData";
import { ThrowMyError } from "../Error";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, RusCardTypeNames, StageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IGodData, IMyGameState, InvalidMoveType, IPublicPlayer, MythologicalCreatureCommandZoneCardType } from "../typescript/interfaces";

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
export const UseGodPowerMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    // TODO Check/Fix StageNames.default3
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default3, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const card: CanBeUndefType<MythologicalCreatureCommandZoneCardType> = player.mythologicalCreatureCards[cardId];
    if (card === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта с id '${cardId}'.`);
    }
    if (card.type !== RusCardTypeNames.God_Card) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне карта с id '${cardId}' должна быть с типом '${RusCardTypeNames.God_Card}', а не с типом '${card.type}'.`);
    }
    const godCard: CanBeUndefType<IGodData> =
        Object.values(godConfig).find((god: IGodData): boolean => god.name === card.name);
    if (godCard === undefined) {
        throw new Error(`Не удалось найти Бога '${card.name}'.`);
    }
    // TODO Use God power ability!?
    godCard.godPower();
};
