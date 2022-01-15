import { Ctx } from "boardgame.io";
import { CheckPlayersBasicOrder } from "../Player";
import { HeroNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

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
                player.buffs.everyTurn === HeroNames.Uline);
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
