import { ReturnCoinsToPlayerHands } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { CheckAndStartPlaceCoinsUlineOrPickCardsPhase } from "../helpers/GameHooksHelpers";
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
        const isEveryPlayersHandCoinsEmpty = G.publicPlayers.filter((player) => !CheckPlayerHasBuff(player, BuffNames.EveryTurn))
            .every((player) => player.handCoins.every((coin) => coin === null));
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    if (player.handCoins.every((coin) => coin === null)) {
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
    var _a;
    G.currentTavern = -1;
    if (ctx.turn !== 0) {
        ReturnCoinsToPlayerHands(G);
        if ((_a = G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
    }
    CheckPlayersBasicOrder(G, ctx);
};
//# sourceMappingURL=PlaceCoinsHooks.js.map