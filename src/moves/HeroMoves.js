import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardCardsFromPlayerBoardAction, PlaceOlwinCardsAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddHeroToCards } from "../helpers/HeroMovesHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
// TODO Add logging
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
    const isValidMove = IsValidMove(G, ctx, Stages.PickHero, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToCards(G, ctx, G.heroes[heroId]);
    AddActionsToStackAfterCurrent(G, ctx, G.heroes[heroId].stack, G.heroes[heroId]);
    StartAutoAction(G, ctx, G.heroes[heroId].actions);
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
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardMove = (G, ctx, suit, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.DiscardBoardCard, {
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
 * @param suit Название фракции.
 */
export const PlaceOlwinCardMove = (G, ctx, suit) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PlaceOlwinCards, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceOlwinCardsAction(G, ctx, suit);
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
 * @param suit Название фракции.
 */
export const PlaceThrudHeroMove = (G, ctx, suit) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PlaceThrudHero, suit);
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
 * @param suit Название фракции.
 */
export const PlaceYludHeroMove = (G, ctx, suit) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction(G, ctx, suit);
};
//# sourceMappingURL=HeroMoves.js.map