import { IsValidMove } from "../MoveValidator";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddActionsToStack, EndActionFromStackAndAddNew, StartActionForChosenPlayer, StartActionFromStackOrEndActions, } from "../helpers/StackHelpers";
// todo Add logging
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
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export var ClickCampCard = function (G, ctx, cardId) {
    var isValidMove = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
        (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    var card = G.camp[cardId];
    if (card) {
        AddActionsToStack(G, ctx, card.stack);
        StartActionFromStackOrEndActions(G, ctx, false, cardId);
    }
};
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
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export var ClickCampCardHolda = function (G, ctx, cardId) {
    var isValidMove = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] }) &&
        Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    var campCard = G.camp[cardId];
    if (campCard) {
        EndActionFromStackAndAddNew(G, ctx, campCard.stack, cardId);
    }
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
 * @constructor
 */
export var DiscardCard2Players = function (G, ctx, cardId) {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
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
 * @constructor
 */
export var DiscardCardFromPlayerBoard = function (G, ctx, suitId, cardId) {
    EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
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
 * @constructor
 */
export var DiscardSuitCardFromPlayerBoard = function (G, ctx, suitId, playerId, cardId) {
    var isValidMove = false;
    if (typeof ctx.playerID === "string") {
        isValidMove = playerId !== Number(ctx.currentPlayer) && playerId === Number(ctx.playerID);
    }
    if (!isValidMove) {
        return INVALID_MOVE;
    }
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
 * @returns {*}
 * @constructor
 */
export var GetMjollnirProfit = function (G, ctx, suitId) {
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
