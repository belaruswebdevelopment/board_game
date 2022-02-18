import { Ctx } from "boardgame.io";
import { CheckPlayersBasicOrder } from "../Player";
import { IBuffs } from "../typescript_interfaces/player_buff_interfaces";
import { IMyGameState } from "../typescript_interfaces/game_data_interfaces";
import { IPublicPlayer } from "../typescript_interfaces/player_interfaces";

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
        return G.publicPlayers[ulinePlayerIndex].boardCoins[G.currentTavern + 1] !== null;
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
