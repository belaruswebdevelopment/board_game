"use strict";
exports.__esModule = true;
exports.GetMjollnirProfit = exports.DiscardSuitCardFromPlayerBoard = exports.DiscardCardFromPlayerBoard = exports.DiscardCard2Players = exports.ClickCampCardHolda = exports.ClickCampCard = void 0;
var MoveValidator_1 = require("../MoveValidator");
var core_1 = require("boardgame.io/core");
var StackHelpers_1 = require("../helpers/StackHelpers");
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
var ClickCampCard = function (G, ctx, cardId) {
    var buff = G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp;
    var isValidMove = false;
    if (buff) {
        isValidMove = (0, MoveValidator_1.IsValidMove)({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
            && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
            (!G.campPicked && buff));
    }
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.AddActionsToStack)(G, ctx, G.camp[cardId].stack);
    (0, StackHelpers_1.StartActionFromStackOrEndActions)(G, ctx, false, cardId);
};
exports.ClickCampCard = ClickCampCard;
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
var ClickCampCardHolda = function (G, ctx, cardId) {
    var buff = G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    var isValidMove = false;
    if (buff) {
        isValidMove = (0, MoveValidator_1.IsValidMove)({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] }) && buff;
    }
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    var campCard = G.camp[cardId];
    if (campCard) {
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, campCard.stack, cardId);
    }
};
exports.ClickCampCardHolda = ClickCampCardHolda;
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
var DiscardCard2Players = function (G, ctx, cardId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], cardId);
};
exports.DiscardCard2Players = DiscardCard2Players;
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
var DiscardCardFromPlayerBoard = function (G, ctx, suitId, cardId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId, cardId);
};
exports.DiscardCardFromPlayerBoard = DiscardCardFromPlayerBoard;
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
var DiscardSuitCardFromPlayerBoard = function (G, ctx, suitId, playerId, cardId) {
    var isValidMove = false;
    if (typeof ctx.playerID === "string") {
        isValidMove = playerId !== Number(ctx.currentPlayer) && playerId === Number(ctx.playerID);
    }
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.StartActionForChosenPlayer)(G, ctx, playerId, suitId, playerId, cardId);
};
exports.DiscardSuitCardFromPlayerBoard = DiscardSuitCardFromPlayerBoard;
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
var GetMjollnirProfit = function (G, ctx, suitId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
};
exports.GetMjollnirProfit = GetMjollnirProfit;
