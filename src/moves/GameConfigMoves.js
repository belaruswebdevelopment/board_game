import { INVALID_MOVE } from "boardgame.io/core";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, SoloGameAndvariStrategyNames, StageNames } from "../typescript/enums";
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
export const ChooseStrategyForSoloModeAndvariMove = (G, ctx, level) => {
    const isValidMove = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
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
export const ChooseStrategyVariantForSoloModeAndvariMove = (G, ctx, level) => {
    const isValidMove = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
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
export const ChooseDifficultyLevelForSoloModeMove = (G, ctx, level) => {
    const isValidMove = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
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
export const ChooseHeroForDifficultySoloModeMove = (G, ctx, heroId) => {
    const isValidMove = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.chooseHeroesForSoloMode, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
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
//# sourceMappingURL=GameConfigMoves.js.map