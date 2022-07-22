import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, StageNames } from "../typescript/enums";
import type { CanBeUndefType, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

// TODO Add Bot place all coins for human player opened in solo game
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
 * @returns
 */
export const BotsPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinsOrder: number[]):
    string | void => {
    // TODO Check it bot can't play in multiplayer now...
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default3, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const coinId: number = coinsOrder[i]
            || handCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean => {
                if (coin !== null && !IsCoin(coin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${index}'.`);
                }
                if (IsCoin(coin) && coin.isOpened) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                }
                return IsCoin(coin);
            });
        if (coinId !== -1) {
            const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinId];
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
            }
            if (handCoin !== null && !IsCoin(handCoin)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            if (IsCoin(handCoin) && handCoin.isOpened) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
            }
            if (G.multiplayer) {
                privatePlayer.boardCoins[i] = handCoin;
                player.boardCoins[i] = {};
                player.handCoins[i] = null;
            } else {
                if (G.solo) {
                    if (handCoin !== null) {
                        ChangeIsOpenedCoinStatus(handCoin, true);
                    }
                }
                player.boardCoins[i] = handCoin;
            }
            handCoins[coinId] = null;
        }
    }
};
