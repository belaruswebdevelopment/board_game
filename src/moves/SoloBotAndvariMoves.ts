import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { PickCardToPickDistinctionAction } from "../actions/Actions";
import { AddHeroToPlayerCardsAction } from "../actions/HeroActions";
import { PlaceAllCoinsInCurrentOrderForSoloBot, PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBot } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { StageNames } from "../typescript/enums";
import type { CanBeVoidType, IMyGameState, InvalidMoveType } from "../typescript/interfaces";

/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const SoloBotAndvariClickCardToPickDistinctionMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx,
    cardId: number): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickDistinctionCardSoloBotAndvari, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Pick 1st card from 2 tier deck OR BY STRATEGY!?
    PickCardToPickDistinctionAction(G, ctx, cardId);
};

/**
 * <h3>Выбор героя соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 */
export const SoloBotAndvariClickHeroCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickHeroSoloBotAndvari, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction(G, ctx, heroId);
};

/**
 * <h3>Выкладка монет соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotAndvariPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinsOrder: number[]):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default4, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.tierToEnd === 2) {
        PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBot(G, ctx);
    } else if (G.tierToEnd === 1) {
        PlaceAllCoinsInCurrentOrderForSoloBot(G, ctx);
    }
};
