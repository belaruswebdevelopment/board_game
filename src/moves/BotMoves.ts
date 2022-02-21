import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { isCoin } from "../Coin";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import { CoinType, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
export const BotsPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinsOrder: number[]):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default3, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    for (let i = 0; i < player.boardCoins.length; i++) {
        const coinId: number =
            coinsOrder[i] || player.handCoins.findIndex((coin: CoinType): boolean => isCoin(coin));
        if (coinId !== -1) {
            player.boardCoins[i] = player.handCoins[coinId];
            player.handCoins[coinId] = null;
        } else {
            // TODO LogTypes.ERROR ?
        }
    }
};
