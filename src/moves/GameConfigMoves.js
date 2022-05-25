import { INVALID_MOVE } from "boardgame.io/core";
import { StackData } from "../data/StackData";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
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
        && IsValidMove(G, ctx, Stages.Default1, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameDifficultyLevel = level;
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getHeroesForSoloMode(level)]);
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
        && IsValidMove(G, ctx, Stages.ChooseHeroesForSoloMode, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroForDifficultyToSoloBotCards(G, ctx, hero);
    player.actionsNum--;
    if (player.actionsNum) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.getHeroesForSoloMode(player.actionsNum)]);
    }
};
//# sourceMappingURL=GameConfigMoves.js.map