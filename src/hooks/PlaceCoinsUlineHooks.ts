import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { CheckPlayersBasicOrder } from "../Player";
import type { IBuffs, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndPlaceCoinsUlinePhase = (G: IMyGameState): boolean | void => {
    if (G.publicPlayersOrder.length) {
        const ulinePlayerIndex: number =
            G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                Boolean(player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)));
        if (ulinePlayerIndex !== - 1) {
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
export const CheckUlinePlaceCoinsOrder = (G: IMyGameState, ctx: Ctx): void => CheckPlayersBasicOrder(G, ctx);

export const EndPlaceCoinsUlineActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};
