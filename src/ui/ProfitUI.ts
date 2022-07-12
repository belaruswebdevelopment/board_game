import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { ButtonNames, ErrorNames, MoveNames, MoveValidatorNames, StageNames } from "../typescript/enums";
import type { CanBeNull, CanBeUndef, DeckCardTypes, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, SuitTypes } from "../typescript/interfaces";
import { DrawButton, DrawCard } from "./ElementsUI";

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
export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNull<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): IMoveArgumentsStage<number[]>[`args`] | void => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card: CanBeUndef<DeckCardTypes> = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
        }
        let suit: CanBeNull<SuitTypes> = null;
        if (IsDwarfCard(card)) {
            suit = card.suit;
        }
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
export const DrawDifficultyLevelForSoloModeUI = (G: IMyGameState, ctx: Ctx,
    validatorName: CanBeNull<MoveValidatorNames>, data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]):
    IMoveArgumentsStage<number[]>[`args`] | void => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
        player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
export const DrawHeroesForSoloModeUI = (G: IMyGameState, ctx: Ctx, validatorName: CanBeNull<MoveValidatorNames>,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): IMoveArgumentsStage<number[]>[`args`] | void => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let i = 0; i < 1; i++) {
        if (G.heroesForSoloGameDifficultyLevel === null) {
            throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
        }
        for (let j = 0; j < G.heroesForSoloGameDifficultyLevel.length; j++) {
            const hero: CanBeUndef<IHeroCard> = G.heroesForSoloGameDifficultyLevel[j];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев для выбора сложности соло игры отсутствует герой с id '${j}'.`);
            }
            if (hero.active && Number(ctx.currentPlayer) === 0
                && ctx.activePlayers?.[Number(ctx.currentPlayer)] === StageNames.ChooseHeroesForSoloMode) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
