import { INVALID_MOVE } from "boardgame.io/core";
import { ThrowMyError } from "../Error";
import { IsValidMove } from "../MoveValidator";
import { AllStackData } from "../data/StackData";
import { AddHeroForDifficultyToSoloBotCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertAllHeroesForDifficultySoloModePossibleCardId } from "../is_helpers/AssertionTypeHelpers";
import { ButtonMoveNames, CardMoveNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeDefaultStageNames, ChooseDifficultySoloModeStageNames, ErrorNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, HeroCard, InvalidMoveType, Move, MyFnContext, PublicPlayer, SoloGameAndvariStrategyVariantLevelType, SoloGameDifficultyLevelArgType } from "../typescript/interfaces";

// TODO level: SoloGameAndvariStrategyNames => string and asserts it value if no other strings can be valid in moves!?
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
export const ChooseStrategyForSoloModeAndvariMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    level: SoloGameAndvariStrategyNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyForSoloModeAndvari,
        ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameAndvariStrategyLevel = level;
};

// TODO level: SoloGameAndvariStrategyVariantLevelType => string and asserts it value if no other strings can be valid in moves!?
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
export const ChooseStrategyVariantForSoloModeAndvariMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    level: SoloGameAndvariStrategyVariantLevelType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        ChooseDifficultySoloModeAndvariDefaultStageNames.ChooseStrategyVariantForSoloModeAndvari,
        ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove, level);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.soloGameAndvariStrategyVariantLevel = level;
    AddActionsToStack({ G, ctx, myPlayerID: playerID, ...rest },
        [AllStackData.chooseStrategyLevelForSoloModeAndvari()]);
};

// TODO level: SoloGameDifficultyLevelArgType => string and asserts it value if no other strings can be valid in moves!?
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
export const ChooseDifficultyLevelForSoloModeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    level: SoloGameDifficultyLevelArgType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        ChooseDifficultySoloModeDefaultStageNames.ChooseDifficultyLevelForSoloMode,
        ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove, level);
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
export const ChooseHeroForDifficultySoloModeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    AssertAllHeroesForDifficultySoloModePossibleCardId(heroId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        ChooseDifficultySoloModeStageNames.ChooseHeroForDifficultySoloMode,
        CardMoveNames.ChooseHeroForDifficultySoloModeMove, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (G.heroesForSoloGameDifficultyLevel === null) {
        throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
    }
    const hero: CanBeUndefType<HeroCard> = G.heroesForSoloGameDifficultyLevel.splice(heroId, 1)[0];
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
