import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { BuffNames, HeroNames } from "../typescript/enums";
import type { CoinType, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndPlaceCoinsUlinePhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        const ulinePlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.EveryTurn));
        if (ulinePlayerIndex !== - 1) {
            const ulinePlayer: IPublicPlayer | undefined = G.publicPlayers[ulinePlayerIndex];
            if (ulinePlayer === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с бафом 'BuffNames.EveryTurn'.`);
            }
            if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
                const boardCoin: CoinType | undefined = ulinePlayer.boardCoins[G.currentTavern + 1];
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
export const CheckUlinePlaceCoinsOrder = (G: IMyGameState, ctx: Ctx): void => CheckPlayersBasicOrder(G, ctx);

export const EndPlaceCoinsUlineActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};
