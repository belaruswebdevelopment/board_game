import {CheckAndStartUlineActionsOrContinue} from "../helpers/HeroHelpers";
import {Ctx, Move} from "boardgame.io";
import {MyGameState} from "../GameSetup";

/**
 * <h3>Выкладка монет ботами.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда ботам нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @constructor
 */
export const BotsPlaceAllCoins: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinsOrder: number[]): void => {
    for (let i: number = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
        const coinId: number = coinsOrder[i] || G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex(coin => coin !== null);
        if (coinId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] =
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId];
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId] = null;
        }
    }
    const isEveryPlayersHandCoinsEmpty: boolean = G.publicPlayers.filter(player => player.buffs.everyTurn
        !== "Uline").every(player => player.handCoins.every(coin => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
            ctx.events!.setPhase!("placeCoinsUline");
        } else {
            ctx.events!.setPhase!("pickCards");
        }
    } else {
        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins.every(coin => coin === null)) {
            ctx.events!.endTurn!();
        }
    }
};
