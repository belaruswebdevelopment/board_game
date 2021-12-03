"use strict";
exports.__esModule = true;
exports.DiscardCard = exports.PlaceCard = exports.ClickHeroCard = void 0;
var MoveValidator_1 = require("../MoveValidator");
var core_1 = require("boardgame.io/core");
var StackHelpers_1 = require("../helpers/StackHelpers");
// todo Add logging
/**
 * <h3>Выбор героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns {string|*}
 * @constructor
 */
var ClickHeroCard = function (G, ctx, heroId) {
    var isValidMove = (0, MoveValidator_1.IsValidMove)({ obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length] });
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, G.heroes[heroId].stack);
};
exports.ClickHeroCard = ClickHeroCard;
/**
 * <h3>Расположение героя или зависимых карт героя на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя со способностью выкладки карт на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceCard = function (G, ctx, suitId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
};
exports.PlaceCard = PlaceCard;
/**
 * <h3>Сброс карты с верха планшета игрока при выборе героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя со способностью сброса карт с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var DiscardCard = function (G, ctx, suitId, cardId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId, cardId);
};
exports.DiscardCard = DiscardCard;
