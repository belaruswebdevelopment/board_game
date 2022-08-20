import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, SoloGameAndvariStrategyNames, StageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IHeroCard, IMyGameState, InvalidMoveType, IPublicPlayer, SoloGameAndvariStrategyVariantLevelType, SoloGameDifficultyLevelArgType } from "../typescript/interfaces";

/**
 * <h3>Выбор уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает уровень сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param level Уровень сложности в режиме соло игры.
 * @returns
 */
export const ChooseStrategyForSoloModeAndvariMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx,
    level: SoloGameAndvariStrategyNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default2, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameAndvariStrategyLevel = level;
};

/**
 * <h3>Выбор варианта уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает вариант уровня сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param level Вариант уровня сложности в режиме соло игры.
 * @returns
 */
export const ChooseStrategyVariantForSoloModeAndvariMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx,
    level: SoloGameAndvariStrategyVariantLevelType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default1, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameAndvariStrategyVariantLevel = level;
    AddActionsToStack(G, ctx, [StackData.chooseStrategyLevelForSoloModeAndvari()]);
};

/**
 * <h3>Выбор уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает уровень сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param level Уровень сложности в режиме соло игры.
 * @returns
 */
export const ChooseDifficultyLevelForSoloModeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx,
    level: SoloGameDifficultyLevelArgType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default1, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameDifficultyLevel = level;
    AddActionsToStack(G, ctx, [StackData.getHeroesForSoloMode()]);
};

/**
 * <h3>Выбор героя для выбранного уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает героя для выбранного уровня сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns
 */
export const ChooseHeroForDifficultySoloModeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.chooseHeroesForSoloMode, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero: CanBeUndefType<IHeroCard> = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
    if (hero === undefined) {
        throw new Error(`Не существует выбранная карта героя с id '${heroId}'.`);
    }
    AddHeroForDifficultyToSoloBotCards(G, ctx, hero);
    if (G.soloGameDifficultyLevel === null || G.soloGameDifficultyLevel === 0) {
        throw new Error(`Не может не быть возможности выбора героя для выбранного уровня сложности в режиме соло игры.`);
    }
    G.soloGameDifficultyLevel--;
    if (G.soloGameDifficultyLevel) {
        AddActionsToStack(G, ctx, [StackData.getHeroesForSoloMode()]);
    }
};
