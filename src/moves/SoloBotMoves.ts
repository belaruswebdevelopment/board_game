import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import type { CoinType, IMyGameState, IPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

// TODO Add all solo bot moves!
/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const SoloBotPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx): string | void => {
    // TODO Change `Stages.Default3` + Add Validation logic
    const isValidMove: boolean =
        ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default3);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const handCoins: CoinType[] = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: PublicPlayerCoinTypes | undefined = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        handCoins[i] = null;
    }
};
