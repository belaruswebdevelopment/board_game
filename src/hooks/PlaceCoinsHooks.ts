import type { Ctx } from "boardgame.io";
import { ReturnCoinsToPlayerHands } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { CheckAndStartPlaceCoinsUlineOrPickCardsPhase } from "../helpers/GameHooksHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { BuffNames } from "../typescript/enums";
import type { CoinType, IMyGameState, INext, IPublicPlayer } from "../typescript/interfaces";

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
        const isEveryPlayersHandCoinsEmpty: boolean =
            G.publicPlayers.filter((player: IPublicPlayer): boolean =>
                !CheckPlayerHasBuff(player, BuffNames.EveryTurn))
                .every((player: IPublicPlayer): boolean =>
                    player.handCoins.every((coin: CoinType): boolean => coin === null));
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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    if (player.handCoins.every((coin: CoinType): boolean => coin === null)) {
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
        ReturnCoinsToPlayerHands(G);
        if (G.expansions.thingvellir?.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
    }
    CheckPlayersBasicOrder(G, ctx);
};
