import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {Ctx, Move} from "boardgame.io";
import {MyGameState} from "../GameSetup";
// todo Add logging

/**
 * <h3>Выбор героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} heroId Id героя.
 * @returns {string | void}
 * @constructor
 */
export const ClickHeroCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, heroId: number): string | void => {
    const isValidMove: boolean = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx, G.heroes[heroId].stack);
};

/**
 * <h3>Расположение героя или зависимых карт героя на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя со способностью выкладки карт на планшет игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @constructor
 */
export const PlaceCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * <h3>Сброс карты с верха планшета игрока при выборе героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя со способностью сброса карт с планшета игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @param {number} cardId Id карты.
 * @constructor
 */
export const DiscardCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number, cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};
