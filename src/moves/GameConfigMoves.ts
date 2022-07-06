import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, StageNames } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
        && IsValidMove(G, ctx, StageNames.Default1, level);
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
export const ChooseHeroForDifficultySoloModeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    string | void => {
    const isValidMove: boolean = ctx.playerID === `0` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.ChooseHeroesForSoloMode, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero: CanBeUndef<IHeroCard> = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroForDifficultyToSoloBotCards(G, ctx, hero);
    player.actionsNum--;
    if (player.actionsNum) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.getHeroesForSoloMode(player.actionsNum)]);
    }
};
