import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBuffToPlayer } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { ErrorNames, GameModeNames, HeroNames, PhaseNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, HeroCard, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет порядок хода при начале фазы 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const CheckChooseDifficultySoloModeOrder = ({ G, ctx, ...rest }: FnContext): void => {
    CheckPlayersBasicOrder({ G, ctx, ...rest });
};

/**
 * <h3>Проверяет необходимость завершения фазы 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndChooseDifficultySoloModePhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (ctx.currentPlayer === `0`) {
        if (G.mode !== GameModeNames.Solo) {
            return true;
        }
    } else if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                1);
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
 * @param context
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndChooseDifficultySoloModeTurn = ({ G, ctx }: FnContext): CanBeVoidType<boolean> => {
    if (ctx.currentPlayer === `0`) {
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
 * @param returns
 * @returns
 */
export const EndChooseDifficultySoloModeActions = ({ G }: FnContext): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnChooseDifficultySoloModeMove = ({ G, ctx, ...rest }: FnContext): void => {
    StartOrEndActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
};

/**
 * <h3>Действия при начале хода в фазе 'chooseDifficultySoloMode'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'chooseDifficultySoloMode'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnChooseDifficultySoloModeTurnBegin = ({ G, ctx, ...rest }: FnContext): void => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest },
            [AllStackData.getDifficultyLevelForSoloMode()]);
        DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
    } else if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                1);
        }
        soloBotPublicPlayer.heroes.forEach((hero: HeroCard): void => {
            AddBuffToPlayer({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, hero.buff);
            if (hero.name !== HeroNames.Thrud && hero.name !== HeroNames.Ylud) {
                AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, hero.stack?.soloBot,
                    hero);
                DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
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
 * @param context
 * @returns Фаза игры.
 */
export const StartChooseDifficultySoloModeAndvariOrBidsPhase = ({ G }: FnContext): PhaseNames => {
    if (G.mode === GameModeNames.SoloAndvari) {
        return PhaseNames.ChooseDifficultySoloModeAndvari;
    } else {
        return PhaseNames.Bids;
    }
};
