import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
// todo Add logging
/**
 * Выбор героя.
 * Применения:
 * 1) При необходимости выбора героя.
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns {string|*}
 * @constructor
 */
export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, G.heroes[heroId].stack);
};

/**
 * Расположение героя или зависимых карт героя на планшет игрока.
 * Применения:
 * 1) При выборе героя со способностью выкладки карт на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
export const PlaceCard = (G, ctx, suitId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * Сброс карты с верха планшета игрока при выборе героя.
 * Применения:
 * 1) При выборе героя со способностью сброса карт с планшета игрока.
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
export const DiscardCard = (G, ctx, suitId, cardId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

