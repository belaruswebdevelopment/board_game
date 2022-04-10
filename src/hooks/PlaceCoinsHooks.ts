import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckAndStartPlaceCoinsUlineOrPickCardsPhase } from "../helpers/GameHooksHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames } from "../typescript/enums";
import type { CoinType, IMyGameState, INext, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монетой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndPlaceCoinsPhase = (G: IMyGameState, ctx: Ctx): void | INext => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const multiplayer = IsMultiplayer(G);
        let isEveryPlayersHandCoinsEmpty = false;
        if (multiplayer) {
            isEveryPlayersHandCoinsEmpty =
                Object.values(G.publicPlayers).filter((player: IPublicPlayer): boolean =>
                    !CheckPlayerHasBuff(player, BuffNames.EveryTurn))
                    .every((player: IPublicPlayer, index: number): boolean => {
                        const privatePlayer: IPlayer | undefined = G.players[index];
                        if (privatePlayer === undefined) {
                            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${index}'.`);
                        }
                        return privatePlayer.handCoins.every((coin: CoinType): boolean => coin === null);
                    });
        } else {
            isEveryPlayersHandCoinsEmpty =
                Object.values(G.publicPlayers).filter((player: IPublicPlayer): boolean =>
                    !CheckPlayerHasBuff(player, BuffNames.EveryTurn))
                    .every((player: IPublicPlayer, playerIndex: number): boolean =>
                        player.handCoins.every((coin: PublicPlayerCoinTypes, coinIndex: number): boolean => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${playerIndex}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                            }
                            return coin === null;
                        }));
        }
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
    const multiplayer = IsMultiplayer(G),
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
    if (handCoins.every((coin: PublicPlayerCoinTypes, index: number): boolean => {
        if (coin !== null && !IsCoin(coin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
        }
        return coin === null;
    })) {
        return true;
    }
};

export const OnPlaceCoinsTurnEnd = (G: IMyGameState): void => {
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
    if (ctx.turn !== 0) {
        ReturnCoinsToPlayerHands(G, ctx);
        if (G.expansions.thingvellir?.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
    }
    CheckPlayersBasicOrder(G, ctx);
};
