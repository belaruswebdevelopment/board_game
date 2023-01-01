import { INVALID_MOVE } from "boardgame.io/core";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { ButtonMoveNames, CardMoveNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeDefaultStageNames, ChooseDifficultySoloModeStageNames, ErrorNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
// TODO Move all playerID === `0` to validate!
/**
 * <h3>Выбор уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает уровень сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param context
 * @param level Уровень сложности в режиме соло игры.
 * @returns
 */
export const ChooseStrategyForSoloModeAndvariMove = ({ G, ctx, playerID, ...rest }, level) => {
    const isValidMove = playerID === `0` && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyForSoloModeAndvari, ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, level);
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
 * @param context
 * @param level Вариант уровня сложности в режиме соло игры.
 * @returns
 */
export const ChooseStrategyVariantForSoloModeAndvariMove = ({ G, ctx, playerID, ...rest }, level) => {
    const isValidMove = playerID === `0` && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyVariantForSoloModeAndvari, ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameAndvariStrategyVariantLevel = level;
    AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest }, [AllStackData.chooseStrategyLevelForSoloModeAndvari()]);
};
/**
 * <h3>Выбор уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает уровень сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param context
 * @param level Уровень сложности в режиме соло игры.
 * @returns
 */
export const ChooseDifficultyLevelForSoloModeMove = ({ G, ctx, playerID, ...rest }, level) => {
    const isValidMove = playerID === `0` && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, ChooseDifficultySoloModeDefaultStageNames.ChooseDifficultyLevelForSoloMode, ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameDifficultyLevel = level;
    AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest }, [AllStackData.getHeroesForSoloMode()]);
};
/**
 * <h3>Выбор героя для выбранного уровня сложности в режиме соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда игрок выбирает героя для выбранного уровня сложности в режиме соло игры.</li>
 * </ol>
 *
 * @param context
 * @param heroId Id героя.
 * @returns
 */
export const ChooseHeroForDifficultySoloModeMove = ({ G, ctx, playerID, ...rest }, heroId) => {
    const isValidMove = playerID === `0` && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, ChooseDifficultySoloModeStageNames.ChooseHeroForDifficultySoloMode, CardMoveNames.ChooseHeroForDifficultySoloModeMove, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
    if (hero === undefined) {
        throw new Error(`Не существует выбранная карта героя с id '${heroId}'.`);
    }
    AddHeroForDifficultyToSoloBotCards({ G, ctx, myPlayerID: playerID, ...rest }, hero);
    if (G.soloGameDifficultyLevel === null || G.soloGameDifficultyLevel === 0) {
        throw new Error(`Не может не быть возможности выбора героя для выбранного уровня сложности в режиме соло игры.`);
    }
    G.soloGameDifficultyLevel--;
    if (G.soloGameDifficultyLevel) {
        AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest }, [AllStackData.getHeroesForSoloMode()]);
    }
};
//# sourceMappingURL=GameConfigMoves.js.map