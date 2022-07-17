import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { MixUpCoinsInPlayerHands, ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndef, CoinTypes, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монетой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndBidsPhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const isEveryPlayersHandCoinsEmpty: boolean =
            Object.values(G.publicPlayers).map((player: IPublicPlayer): IPublicPlayer =>
                player).every((player: IPublicPlayer, playerIndex: number): boolean => {
                    if ((G.solo && playerIndex === 1)
                        || (G.multiplayer && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                        const privatePlayer: CanBeUndef<IPlayer> = G.players[playerIndex];
                        if (privatePlayer === undefined) {
                            return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
                                playerIndex);
                        }
                        return privatePlayer.handCoins.every((coin: CoinTypes): boolean => {
                            return coin === null;
                        });
                    } else if ((G.solo && playerIndex === 0)
                        || (!G.multiplayer && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                        return player.handCoins.every((coin: PublicPlayerCoinTypes, coinIndex: number):
                            boolean => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${playerIndex}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                            }
                            return coin === null;
                        });
                    }
                    return true;
                });
        return isEveryPlayersHandCoinsEmpty;
    }
};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndBidsTurn = (G: IMyGameState, ctx: Ctx): true | void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if ((G.solo && ctx.currentPlayer === `1`) || G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const isEveryCoinsInHandsNull: boolean =
        handCoins.every((coin: PublicPlayerCoinTypes, index: number): boolean => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
            }
            return coin === null;
        });
    if (isEveryCoinsInHandsNull) {
        return true;
    }
};

/**
 * <h3>Действия при завершении фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Ставки'.</li>
 * </ol>
 *
 * @param G
 */
export const EndBidsActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при начале фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PreparationPhaseActions = (G: IMyGameState, ctx: Ctx): void => {
    G.currentTavern = -1;
    ReturnCoinsToPlayerHands(G, ctx);
    if (G.expansions.thingvellir.active) {
        RefillEmptyCampCards(G);
    }
    RefillTaverns(G, ctx);
    MixUpCoinsInPlayerHands(G, ctx);
    CheckPlayersBasicOrder(G, ctx);
};
