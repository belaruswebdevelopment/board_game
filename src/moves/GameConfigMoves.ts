import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import type { IHeroCard, IMyGameState } from "../typescript/interfaces";

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
export const ChooseDifficultyLevelForSoloModeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, level: number):
    string | void => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, Stages.Default1, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameDifficultyLevel = level;
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
    string | void => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, Stages.ChooseHeroesForSoloMode, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero: IHeroCard | undefined = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroForDifficultyToSoloBotCards(G, ctx, hero);
};
