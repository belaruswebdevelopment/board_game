import { INVALID_MOVE } from "boardgame.io/core";
import { AddHeroToPlayerCardsAction, DiscardCardsFromPlayerBoardAction, PlaceMultiSuitCardAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { IsValidMove } from "../MoveValidator";
import { StageNames, SuitNames } from "../typescript/enums";
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
 */
export const ClickHeroCardMove = (G, ctx, heroId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.pickHero, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction(G, ctx, heroId);
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
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 * @returns
 */
export const DiscardCardMove = (G, ctx, suit, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.discardBoardCard, {
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardCardsFromPlayerBoardAction(G, ctx, suit, cardId);
};
/**
 * <h3>Расположение героя или зависимых карт героя на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Ольвин со способностью выкладки карт на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceMultiSuitCardMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.placeMultiSuitsCards, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceMultiSuitCardAction(G, ctx, suit);
};
/**
 * <h3>Расположение героя на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Труд со способностью перемещения на планшете игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceThrudHeroMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.placeThrudHero, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction(G, ctx, suit);
};
/**
 * <h3>Расположение героя на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Илуд со способностью размещения на планшете игрока в конце эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceYludHeroMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction(G, ctx, suit);
};
//# sourceMappingURL=HeroMoves.js.map