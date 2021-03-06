import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardCardsFromPlayerBoardAction, PlaceMultiSuitCardAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { StageNames } from "../typescript/enums";
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickHero, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero = G.heroes[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroToPlayerCards(G, ctx, hero);
    AddActionsToStack(G, ctx, hero.stack, hero);
    StartAutoAction(G, ctx, hero.actions);
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.DiscardBoardCard, {
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PlaceMultiSuitsCards, suit);
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PlaceThrudHero, suit);
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction(G, ctx, suit);
};
//# sourceMappingURL=HeroMoves.js.map