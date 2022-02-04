import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardCardsFromPlayerBoardAction, PlaceCardsAction } from "../actions/HeroActions";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddHeroToCards } from "../helpers/HeroMovesHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";

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
export const ClickHeroCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.PickHero, heroId);
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
export const DiscardCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string, cardId: number):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.DiscardBoardCard, {
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
 * <li>При выборе героя со способностью выкладки карт на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.PlaceCards, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceCardsAction(G, ctx, suit);
};
