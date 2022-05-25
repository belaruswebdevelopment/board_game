import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { MixUpCoinsInPlayerHands, ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckAndStartPlaceCoinsUlineOrPickCardsPhase } from "../helpers/GameHooksHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames } from "../typescript/enums";
import type { CanBeUndef, CoinTypes, IMyGameState, INext, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монетой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndPlaceCoinsPhase = (G: IMyGameState, ctx: Ctx): INext | void => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const isEveryPlayersHandCoinsEmpty: boolean =
            Object.values(G.publicPlayers).map((player: IPublicPlayer): IPublicPlayer =>
                player).every((player: IPublicPlayer, playerIndex: number): boolean => {
                    if ((G.solo && ctx.currentPlayer === `1`)
                        || (G.multiplayer && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                        const privatePlayer: CanBeUndef<IPlayer> = G.players[playerIndex];
                        if (privatePlayer === undefined) {
                            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${playerIndex}'.`);
                        }
                        return privatePlayer.handCoins.every((coin: CoinTypes): boolean => coin === null);
                    } else if ((G.solo && ctx.currentPlayer === `0`)
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
        if (isEveryPlayersHandCoinsEmpty) {
            return CheckAndStartPlaceCoinsUlineOrPickCardsPhase(G);
        }
    }
};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndPlaceCoinsTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
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
 * <h3>Действия при завершении фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 */
export const EndPlaceCoinsActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при начале фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'placeCoins'.</li>
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
    RefillTaverns(G);
    MixUpCoinsInPlayerHands(G, ctx);
    CheckPlayersBasicOrder(G, ctx);
};
