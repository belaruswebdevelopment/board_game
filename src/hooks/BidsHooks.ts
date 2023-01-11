import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { MixUpCoinsInPlayerHands, ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { ErrorNames, GameModeNames, HeroBuffNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, CoinType, FnContext, Player, PublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монетой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndBidsPhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const isEveryPlayersHandCoinsEmpty: boolean =
            Object.values(G.publicPlayers).map((player: PublicPlayer): PublicPlayer =>
                player).every((player: PublicPlayer, playerIndex: number): boolean => {
                    if ((G.mode === GameModeNames.Solo && playerIndex === 1)
                        || (G.mode === GameModeNames.SoloAndvari && playerIndex === 1)
                        || (G.mode === GameModeNames.Multiplayer
                            && !CheckPlayerHasBuff({ G, ctx, myPlayerID: String(playerIndex), ...rest },
                                HeroBuffNames.EveryTurn))) {
                        const privatePlayer: CanBeUndefType<Player> = G.players[playerIndex];
                        if (privatePlayer === undefined) {
                            return ThrowMyError({ G, ctx, ...rest },
                                ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerIndex);
                        }
                        return privatePlayer.handCoins.every((coin: CoinType): boolean => coin === null);
                    } else if ((G.mode === GameModeNames.Solo && playerIndex === 0)
                        || (G.mode === GameModeNames.SoloAndvari && playerIndex === 0)
                        || (G.mode === GameModeNames.Basic
                            && !CheckPlayerHasBuff({ G, ctx, myPlayerID: String(playerIndex), ...rest },
                                HeroBuffNames.EveryTurn))) {
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
 * @param context
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndBidsTurn = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<true> => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinType[];
    if ((G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`)
        || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)
        || G.mode === GameModeNames.Multiplayer) {
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
 * @param context
 * @returns
 */
export const EndBidsActions = ({ G }: FnContext): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при начале фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Ставки'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const PreparationPhaseActions = ({ G, ctx, random, ...rest }: FnContext): void => {
    G.round++;
    G.currentTavern = 0;
    if (G.round !== 0) {
        ReturnCoinsToPlayerHands({ G, ctx, random, ...rest });
    }
    if (G.expansions.Thingvellir.active) {
        RefillEmptyCampCards({ G, ctx, random, ...rest });
    }
    RefillTaverns({ G, ctx, random, ...rest });
    MixUpCoinsInPlayerHands({ G, ctx, random, ...rest });
    CheckPlayersBasicOrder({ G, ctx, random, ...rest });
};
