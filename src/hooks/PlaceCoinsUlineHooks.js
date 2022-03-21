import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { BuffNames, HeroNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoinsUline'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждой выкладке монеты на стол игрока в фазе 'placeCoinsUline'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndPlaceCoinsUlinePhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
        if (ulinePlayerIndex !== -1) {
            const ulinePlayer = G.publicPlayers[ulinePlayerIndex];
            if (ulinePlayer === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с бафом 'BuffNames.EveryTurn'.`);
            }
            if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
                const boardCoin = ulinePlayer.boardCoins[G.currentTavern + 1];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока на столе отсутствует монета для выкладки при наличии героя ${HeroNames.Uline}.`);
                }
                return IsCoin(boardCoin);
            }
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