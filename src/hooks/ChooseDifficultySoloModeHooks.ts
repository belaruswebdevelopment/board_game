import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBuffToPlayer } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import type { IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет порядок хода при начале фазы 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckChooseDifficultySoloModeOrder = (G: IMyGameState, ctx: Ctx): void => CheckPlayersBasicOrder(G, ctx);

/**
 * <h3>Проверяет необходимость завершения фазы 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndChooseDifficultySoloModePhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: IPublicPlayer | undefined = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
        }
        return !soloBotPublicPlayer.stack.length;
    }
};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndChooseDifficultySoloModeTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (ctx.currentPlayer === `0`) {
        const soloBotPublicPlayer: IPublicPlayer | undefined = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
        }
        return G.soloGameDifficultyLevel !== null && G.soloGameDifficultyLevel === soloBotPublicPlayer.heroes.length;
    }
};

/**
 * <h3>Действия при завершении фазы 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 */
export const EndChooseDifficultySoloModeActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnChooseDifficultySoloModeMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

/**
 * <h3>Действия при начале хода в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnChooseDifficultySoloModeTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.getDifficultyLevelForSoloMode()]);
        AddActionsToStackAfterCurrent(G, ctx, [StackData.getHeroesForSoloMode()]);
    } else if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: IPublicPlayer | undefined = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
        }
        soloBotPublicPlayer.heroes.forEach((hero: IHeroCard): void => {
            AddBuffToPlayer(G, ctx, hero.buff);
            AddActionsToStackAfterCurrent(G, ctx, hero.stack, hero);
        });
    }
    DrawCurrentProfit(G, ctx);
};
