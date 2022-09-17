import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBuffToPlayer } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { ErrorNames, GameModeNames, HeroNames, PhaseNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, Ctx, IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndChooseDifficultySoloModePhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (ctx.currentPlayer === `0`) {
        if (G.mode !== GameModeNames.Solo) {
            return true;
        }
    } else if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
        return G.heroesForSoloGameDifficultyLevel === null && !soloBotPublicPlayer.stack.length;
    }
};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndChooseDifficultySoloModeTurn = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (ctx.currentPlayer === `0`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
        return G.soloGameDifficultyLevel !== null && G.soloGameDifficultyLevel === 0;
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
 * @returns
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
 * @returns
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
 * @returns
 */
export const OnChooseDifficultySoloModeTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack(G, ctx, [StackData.getDifficultyLevelForSoloMode()]);
        DrawCurrentProfit(G, ctx);
    } else if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
        soloBotPublicPlayer.heroes.forEach((hero: IHeroCard): void => {
            AddBuffToPlayer(G, ctx, hero.buff);
            if (hero.name !== HeroNames.Thrud && hero.name !== HeroNames.Ylud) {
                AddActionsToStack(G, ctx, hero.stack?.soloBot, hero);
                DrawCurrentProfit(G, ctx);
            }
        });
        G.heroesForSoloGameDifficultyLevel = null;
    }
};

/**
 * <h3>Проверяет необходимость начала фазы 'Ставки' или фазы 'ChooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки' или фаза 'ChooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @returns Фаза игры.
 */
export const StartChooseDifficultySoloModeAndvariOrBidsPhase = (G: IMyGameState): PhaseNames => {
    if (G.mode === GameModeNames.SoloAndvari) {
        return PhaseNames.ChooseDifficultySoloModeAndvari;
    } else {
        return PhaseNames.Bids;
    }
};
