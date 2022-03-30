import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsCardNotActionAndNotNull } from "../Card";
import { ButtonNames, MoveNames, MoveValidatorNames } from "../typescript/enums";
import type { DeckCardTypes, IMoveArgumentsStage, IMyGameState, IPublicPlayer, SuitTypes } from "../typescript/interfaces";
import { DrawButton, DrawCard } from "./ElementsUI";

export const ExplorerDistinctionProfit = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorNames | null,
    data?: BoardProps<IMyGameState>, boardCells?: JSX.Element[]): void | IMoveArgumentsStage<number[]>[`args`] => {
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card: DeckCardTypes | undefined = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
        }
        let suit: null | SuitTypes = null;
        if (IsCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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

export const StartEnlistmentMercenariesProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>,
    boardCells: JSX.Element[]): void => {
    for (let j = 0; j < 2; j++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (j === 0) {
            DrawButton(data, boardCells, ButtonNames.Start, player,
                MoveNames.StartEnlistmentMercenariesMove);
        } else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, ButtonNames.Pass, player,
                MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
