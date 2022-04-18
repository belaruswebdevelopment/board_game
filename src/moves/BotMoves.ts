import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import type { IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

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
    // TODO Check it bot can't play in multiplayer now...
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default3, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer: boolean = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const coinId: number = coinsOrder[i]
            || handCoins.findIndex((coin: PublicPlayerCoinTypes, index: number): boolean => {
                if (coin !== null && !IsCoin(coin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${index}'.`);
                }
                if (IsCoin(coin) && coin.isOpened) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                }
                return IsCoin(coin);
            });
        if (coinId !== -1) {
            const handCoin: PublicPlayerCoinTypes | undefined = handCoins[coinId];
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
            }
            if (handCoin !== null && !IsCoin(handCoin)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            if (IsCoin(handCoin) && handCoin.isOpened) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
            }
            if (multiplayer) {
                privatePlayer.boardCoins[i] = handCoin;
                player.boardCoins[i] = {};
                player.handCoins[i] = null;
            } else {
                player.boardCoins[i] = handCoin;
            }
            handCoins[coinId] = null;
        }
    }
};
