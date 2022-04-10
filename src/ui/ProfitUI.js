import { IsCardNotActionAndNotNull } from "../Card";
import { ButtonNames, MoveNames, MoveValidatorNames } from "../typescript/enums";
import { DrawButton, DrawCard } from "./ElementsUI";
export const ExplorerDistinctionProfit = (G, ctx, validatorName, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.explorerDistinctionCards.length; j++) {
        const card = G.explorerDistinctionCards[j];
        if (card === undefined) {
            throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
        }
        let suit = null;
        if (IsCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit, MoveNames.ClickCardToPickDistinctionMove, j);
        }
        else if (validatorName === MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (j === 0) {
            DrawButton(data, boardCells, ButtonNames.Start, player, MoveNames.StartEnlistmentMercenariesMove);
        }
        else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, ButtonNames.Pass, player, MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
//# sourceMappingURL=ProfitUI.js.map