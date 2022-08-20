import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { PickCardToPickDistinctionAction } from "../actions/Actions";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { StageNames } from "../typescript/enums";
import type { CanBeVoidType, HeroesForSoloGameArrayType, IMyGameState, IndexOf, InvalidMoveType } from "../typescript/interfaces";

// TODO Add all solo bot moves!
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const SoloBotClickCardToPickDistinctionMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickDistinctionCardSoloBot, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction(G, ctx, cardId);
};

/**
 * <h3>Выбор героя соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotClickHeroCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickHeroSoloBot, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    AddHeroCardToPlayerHeroCards(G, ctx, G.heroesForSoloBot[heroId as IndexOf<HeroesForSoloGameArrayType>]);
};

/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinsOrder: number[]):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default4, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceAllCoinsInCurrentOrderForSoloBot(G, ctx);
};
