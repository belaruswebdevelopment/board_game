import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { ThrowMyError } from "../Error";
import { ButtonNames, ErrorNames, MoveNames, MoveValidatorNames, RusCardTypeNames, StageNames } from "../typescript/enums";
import type { BasicVidofnirVedrfolnirUpgradeValueType, CanBeNullType, CanBeUndefType, CanBeVoidType, DeckCardTypes, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, IStack, SuitKeyofType, VidofnirVedrfolnirUpgradeValueType } from "../typescript/interfaces";
import { DrawButton, DrawCard } from "./ElementsUI";

/**
 * <h3>Отрисовка для выбора уровня сложности соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле для выбора уровня сложности соло игры.
 */
export const ChooseDifficultyLevelForSoloModeProfit = (G: IMyGameState, ctx: Ctx,
    validatorName: CanBeNullType<MoveValidatorNames>, data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    CanBeVoidType<IMoveArgumentsStage<number[]>[`args`]> => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < 6; j++) {
            if (data !== undefined && boardCells !== undefined) {
                DrawButton(data, boardCells, String(j + 1), player,
                    MoveNames.ChooseDifficultyLevelForSoloModeMove, j + 1);
            } else if (validatorName === MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) {
                moveMainArgs.push(j);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

/**
 * <h3>Отрисовка поля для выбора значения улучшения монеты по артефакту 'Vidofnir Vedrfolnir'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки выбора значения улучшения монеты по артефакту 'Vidofnir Vedrfolnir'.
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit = (G: IMyGameState, ctx: Ctx,
    validatorName: CanBeNullType<MoveValidatorNames>, data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    CanBeVoidType<IMoveArgumentsStage<number[]>[`args`]> => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    const values: CanBeUndefType<VidofnirVedrfolnirUpgradeValueType> = stack.valueArray;
    if (values === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр 'valueArray'.`);
    }
    for (let j = 0; j < values.length; j++) {
        const value: CanBeUndefType<BasicVidofnirVedrfolnirUpgradeValueType> = values[j];
        if (value === undefined) {
            throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' в параметре 'valueArray' отсутствует значение параметра  id '${j}'.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawButton(data, boardCells, String(value), player,
                MoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, value);
        } else if (validatorName === MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) {
            moveMainArgs.push(value);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

/**
 * <h3>Отрисовка поля для получения профита по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки получения профита по фракции разведчиков.
 */
export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    CanBeVoidType<IMoveArgumentsStage<number[]>[`args`]> => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card: CanBeUndefType<DeckCardTypes> = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
        }
        let suit: CanBeNullType<SuitKeyofType> = null;
        if (card.type === RusCardTypeNames.Dwarf_Card) {
            suit = card.suit;
        }
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit,
                MoveNames.ClickCardToPickDistinctionMove, j);
        } else if (validatorName === MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        } else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

/**
 * <h3>Отрисовка всех героев для выбора сложности соло игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Поле героев для выбора сложности соло игры.
 */
export const PickHeroesForSoloModeProfit = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNullType<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    CanBeVoidType<IMoveArgumentsStage<number[]>[`args`]> => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let i = 0; i < 1; i++) {
        if (G.heroesForSoloGameDifficultyLevel === null) {
            throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
        }
        for (let j = 0; j < G.heroesForSoloGameDifficultyLevel.length; j++) {
            const hero: CanBeUndefType<IHeroCard> = G.heroesForSoloGameDifficultyLevel[j];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев для выбора сложности соло игры отсутствует герой с id '${j}'.`);
            }
            if (hero.active && Number(ctx.currentPlayer) === 0
                && ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.ChooseHeroesForSoloMode) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                if (data !== undefined && boardCells !== undefined) {
                    DrawCard(data, boardCells, hero, j, player, null,
                        MoveNames.ChooseHeroForDifficultySoloModeMove, j);
                } else if (validatorName === MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator && hero.active) {
                    moveMainArgs.push(j);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};

/**
 * <h3>Отрисовка поля для старта фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @returns Игровое поле для отрисовки старта фазы 'enlistmentMercenaries'.
 */
export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    for (let j = 0; j < 2; j++) {
        if (j === 0) {
            DrawButton(data, boardCells, ButtonNames.Start, player,
                MoveNames.StartEnlistmentMercenariesMove);
        } else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, ButtonNames.Pass, player,
                MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
