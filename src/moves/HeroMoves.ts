import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardCardsFromPlayerBoardAction, PlaceMultiSuitCardAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { StageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IHeroCard, IMyGameState, SuitKeyofType } from "../typescript/interfaces";

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
export const ClickHeroCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    CanBeVoidType<string> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickHero, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero: CanBeUndefType<IHeroCard> = G.heroes[heroId];
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
export const DiscardCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: SuitKeyofType, cardId: number):
    CanBeVoidType<string> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.DiscardBoardCard, {
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
export const PlaceMultiSuitCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: SuitKeyofType):
    CanBeVoidType<string> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PlaceMultiSuitsCards, suit);
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
export const PlaceThrudHeroMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: SuitKeyofType):
    CanBeVoidType<string> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PlaceThrudHero, suit);
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
export const PlaceYludHeroMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: SuitKeyofType):
    CanBeVoidType<string> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction(G, ctx, suit);
};
