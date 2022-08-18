import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { MixUpCoinsInPlayerHands, ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames, ErrorNames, GameModeNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, CoinType, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

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
export const CheckEndBidsPhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const isEveryPlayersHandCoinsEmpty: boolean =
            Object.values(G.publicPlayers).map((player: IPublicPlayer): IPublicPlayer =>
                player).every((player: IPublicPlayer, playerIndex: number): boolean => {
                    if ((G.mode === GameModeNames.Solo1 && playerIndex === 1) || (G.mode === GameModeNames.Multiplayer
                        && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                        const privatePlayer: CanBeUndefType<IPlayer> = G.players[playerIndex];
                        if (privatePlayer === undefined) {
                            return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
                                playerIndex);
                        }
                        return privatePlayer.handCoins.every((coin: CoinType): boolean => coin === null);
                    } else if ((G.mode === GameModeNames.Solo1 && playerIndex === 0) || (G.mode === GameModeNames.Basic
                        && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                        return player.handCoins.every((coin: PublicPlayerCoinType, coinIndex: number):
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
export const CheckEndBidsTurn = (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinType[];
    if ((G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `1`) || G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const isEveryCoinsInHandsNull: boolean =
        handCoins.every((coin: PublicPlayerCoinType, index: number): boolean => {
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
    G.currentTavern = 0;
    ReturnCoinsToPlayerHands(G, ctx);
    if (G.expansions.thingvellir.active) {
        RefillEmptyCampCards(G);
    }
    RefillTaverns(G, ctx);
    MixUpCoinsInPlayerHands(G, ctx);
    CheckPlayersBasicOrder(G, ctx);
};
