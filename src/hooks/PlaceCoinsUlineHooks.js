import { isCoin } from "../Coin";
import { CheckPlayersBasicOrder } from "../Player";
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
        const ulinePlayerIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.everyTurn !== undefined)));
        if (ulinePlayerIndex !== -1) {
            return isCoin(G.publicPlayers[ulinePlayerIndex].boardCoins[G.currentTavern + 1]);
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