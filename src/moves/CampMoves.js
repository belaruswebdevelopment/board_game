import { IsValidMove } from "../MoveValidator";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddActionsToStack, EndActionFromStackAndAddNew, StartActionForChosenPlayer, StartActionFromStackOrEndActions } from "../helpers/StackHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
// todo Add logging
/**
 * <h3>Выбор карты из кэмпа по действию персонажа Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns
 */
export const ClickCampCardHoldaMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
        && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const campCard = G.camp[cardId];
    if (campCard !== null) {
        EndActionFromStackAndAddNew(G, ctx, campCard.stack, cardId);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
};
/**
 * <h3>Выбор карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns
 */
export const ClickCampCardMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card = G.camp[cardId];
    if (card !== null) {
        AddActionsToStack(G, ctx, card.stack);
        StartActionFromStackOrEndActions(G, ctx, false, cardId);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
};
/**
 * <h3>Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCardFromPlayerBoardMove = (G, ctx, suitId, cardId) => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};
/**
 * <h3>Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCard2PlayersMove = (G, ctx, cardId) => {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
};
/**
 * <h3>Сбрасывает карту конкретной фракции в дискард по выбору игрока при действии артефакта Hofud.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты конкретной фракции в дискард при взятии артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardFromPlayerBoardMove = (G, ctx, suitId, playerId, cardId) => {
    // TODO Uncomment it for players and fix it for bots
    /*let isValidMove: boolean = false;
    if (ctx.playerID !== undefined) {
        isValidMove = playerId !== Number(ctx.currentPlayer) && playerId === Number(ctx.playerID);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
    }
    if (!isValidMove) {
        return INVALID_MOVE;
    }*/
    StartActionForChosenPlayer(G, ctx, playerId, suitId, playerId, cardId);
};
/**
 * <h3>Выбирает фракцию для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 */
export const GetMjollnirProfitMove = (G, ctx, suitId) => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
