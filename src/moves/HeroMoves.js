import { IsValidMove } from "../MoveValidator";
import { INVALID_MOVE } from "boardgame.io/core";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
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
 * @returns
 */
export const ClickHeroCardMove = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({ obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length] });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx, G.heroes[heroId].stack);
};
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
 */
export const DiscardCardMove = (G, ctx, suitId, cardId) => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};
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
 */
export const PlaceCardMove = (G, ctx, suitId) => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
