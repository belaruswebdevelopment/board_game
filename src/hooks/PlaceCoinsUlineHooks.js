import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { BuffNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoinsUline'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждой выкладке монеты на стол игрока в фазе 'placeCoinsUline'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckEndPlaceCoinsUlinePhase = (G) => {
    if (G.publicPlayersOrder.length) {
        const ulinePlayerIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
        if (ulinePlayerIndex !== -1) {
            return IsCoin(G.publicPlayers[ulinePlayerIndex].boardCoins[G.currentTavern + 1]);
        }
    }
};
/**
 * <h3>Проверяет порядок хода при начале фазы 'placeCoinsUline'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'placeCoinsUline'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckUlinePlaceCoinsOrder = (G, ctx) => CheckPlayersBasicOrder(G, ctx);
export const EndPlaceCoinsUlineActions = (G) => {
    G.publicPlayersOrder = [];
};
//# sourceMappingURL=PlaceCoinsUlineHooks.js.map