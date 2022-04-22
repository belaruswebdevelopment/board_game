import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckAndStartPlaceCoinsUlineOrPickCardsPhase } from "../helpers/GameHooksHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames } from "../typescript/enums";
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
export const CheckEndPlaceCoinsPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const multiplayer = IsMultiplayer(G);
        let isEveryPlayersHandCoinsEmpty = false;
        if (multiplayer) {
            isEveryPlayersHandCoinsEmpty =
                Object.values(G.publicPlayers).map((player) => player).every((player, index) => {
                    if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                        const privatePlayer = G.players[index];
                        if (privatePlayer === undefined) {
                            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${index}'.`);
                        }
                        return privatePlayer.handCoins.every((coin) => coin === null);
                    }
                    return true;
                });
        }
        else {
            isEveryPlayersHandCoinsEmpty =
                Object.values(G.publicPlayers).map((player) => player)
                    .every((player, playerIndex) => {
                    if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                        return player.handCoins.every((coin, coinIndex) => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${playerIndex}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                            }
                            return coin === null;
                        });
                    }
                    return true;
                });
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
export const CheckEndPlaceCoinsTurn = (G, ctx) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins;
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const isEveryCoinsInHandsNull = handCoins.every((coin, index) => {
        if (coin !== null && !IsCoin(coin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
        }
        return coin === null;
    });
    if (isEveryCoinsInHandsNull) {
        return true;
    }
};
export const OnPlaceCoinsTurnEnd = (G) => {
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
export const PreparationPhaseActions = (G, ctx) => {
    G.currentTavern = -1;
    if (ctx.turn !== 0) {
        ReturnCoinsToPlayerHands(G, ctx);
        if (G.expansions.thingvellir.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
    }
    CheckPlayersBasicOrder(G, ctx);
};
//# sourceMappingURL=PlaceCoinsHooks.js.map