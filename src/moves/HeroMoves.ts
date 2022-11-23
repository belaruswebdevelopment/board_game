import { INVALID_MOVE } from "boardgame.io/core";
import { AddHeroToPlayerCardsAction, DiscardCardsFromPlayerBoardAction, PlaceMultiSuitCardAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { IsValidMove } from "../MoveValidator";
import { CommonStageNames, MoveTypeNames, PlaceYludDefaultStageNames, SuitNames } from "../typescript/enums";
import type { CanBeVoidType, InvalidMoveType, Move, MyFnContext } from "../typescript/interfaces";

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
export const ClickHeroCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, CommonStageNames.PickHero,
        MoveTypeNames.default, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction({ G, ctx, playerID, ...rest }, heroId);
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
export const DiscardCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, CommonStageNames.DiscardBoardCard,
        MoveTypeNames.default, {
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardCardsFromPlayerBoardAction({ G, ctx, playerID, ...rest }, suit, cardId);
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
export const PlaceMultiSuitCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, CommonStageNames.PlaceMultiSuitsCards,
        MoveTypeNames.default, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceMultiSuitCardAction({ G, ctx, playerID, ...rest }, suit);
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
export const PlaceThrudHeroMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, CommonStageNames.PlaceThrudHero,
        MoveTypeNames.default, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, playerID, ...rest }, suit);
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
export const PlaceYludHeroMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, PlaceYludDefaultStageNames.PlaceYludHero,
        MoveTypeNames.default, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, playerID, ...rest }, suit);
};
