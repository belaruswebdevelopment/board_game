import { INVALID_MOVE } from "boardgame.io/core";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { AddBuffToPlayer } from "../helpers/BuffHelpers";
import { PickCardOrActionCardActions } from "../helpers/CardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { BuffNames, ErrorNames, LogTypeNames, StageNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Выбор фракции карты Olrun.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Фракция дворфов.
 * @returns
 */
export const ChooseSuitOlrunMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = IsValidMove({ G, ctx, playerID, ...rest }, StageNames.chooseSuitOlrun, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    AddBuffToPlayer({ G, ctx, playerID, ...rest }, {
        name: BuffNames.SuitIdForOlrun,
    }, suit);
};
/**
 * <h3>Выбор карты мифического существа Skymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе игроком карты Olrun.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты Мифического существа.
 * @returns
 */
export const GetMythologyCardMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    const isValidMove = IsValidMove({ G, ctx, playerID, ...rest }, StageNames.getMythologyCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.mythologicalCreatureDeckForSkymir === null) {
        throw new Error(`Массив всех карт мифических существ для Skymir не может не быть заполнен картами.`);
    }
    const mythologyCard = G.mythologicalCreatureDeckForSkymir[cardId];
    if (mythologyCard === undefined) {
        throw new Error(`В массиве карт мифических существ для Skymir отсутствует мифическое существо с id '${cardId}'.`);
    }
    const isAdded = PickCardOrActionCardActions({ G, ctx, playerID, ...rest }, mythologyCard);
    if (isAdded && `suit` in mythologyCard) {
        const player = G.publicPlayers[Number(playerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
        }
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${mythologyCard.type}' '${mythologyCard.name}' во фракцию '${suitsConfig[mythologyCard.suit].suitName}'.`);
    }
    if (G.mythologicalCreatureDeckForSkymir.length === 4) {
        AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.getMythologyCardSkymir(3)]);
    }
};
//# sourceMappingURL=MythologicalCreatureMoves.js.map