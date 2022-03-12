import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
/**
 * <h3>Выкладка монет ботами.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда ботам нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 */
export const BotsPlaceAllCoinsMove = (G, ctx, coinsOrder) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default3, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const coinId = coinsOrder[i]
            || player.handCoins.findIndex((coin) => IsCoin(coin));
        if (coinId === -1) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета.`);
        }
        const handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
        }
        player.boardCoins[i] = handCoin;
        player.handCoins[coinId] = null;
    }
};
//# sourceMappingURL=BotMoves.js.map