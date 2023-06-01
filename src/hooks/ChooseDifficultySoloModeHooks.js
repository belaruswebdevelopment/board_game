import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBuffToPlayer } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { CheckPlayersBasicOrder } from "../helpers/PlayerHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { ErrorNames, GameModeNames, HeroNames, PhaseNames, PlayerIdForSoloGameNames } from "../typescript/enums";
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
export const CheckChooseDifficultySoloModeOrder = ({ G, ctx, ...rest }) => {
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
export const CheckEndChooseDifficultySoloModePhase = ({ G, ctx, ...rest }) => {
    if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
        if (G.mode !== GameModeNames.Solo) {
            return true;
        }
    }
    else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
        const soloBotPublicPlayer = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
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
export const CheckEndChooseDifficultySoloModeTurn = ({ G, ctx }) => {
    if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
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
export const EndChooseDifficultySoloModeActions = ({ G }) => {
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
export const OnChooseDifficultySoloModeMove = ({ G, ctx, ...rest }) => {
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
export const OnChooseDifficultySoloModeTurnBegin = ({ G, ctx, ...rest }) => {
    if (ctx.currentPlayer === PlayerIdForSoloGameNames.HumanPlayerId) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, [AllStackData.getDifficultyLevelForSoloMode()]);
        DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
    }
    else if (ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId) {
        const soloBotPublicPlayer = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
        soloBotPublicPlayer.heroes.forEach((hero) => {
            var _a;
            AddBuffToPlayer({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, hero.buff);
            if (hero.name !== HeroNames.Thrud && hero.name !== HeroNames.Ylud) {
                AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, (_a = hero.stack) === null || _a === void 0 ? void 0 : _a.soloBot, hero);
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
export const StartChooseDifficultySoloModeAndvariOrBidsPhase = ({ G }) => {
    if (G.mode === GameModeNames.SoloAndvari) {
        return PhaseNames.ChooseDifficultySoloModeAndvari;
    }
    else {
        return PhaseNames.Bids;
    }
};
//# sourceMappingURL=ChooseDifficultySoloModeHooks.js.map