import {CheckAndStartUlineActionsOrContinue} from "../helpers/HeroHelpers";

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
export const BotsPlaceAllCoins = (G, ctx, coinsOrder) => {
    for (let i = 0; i < G.publicPlayers[ctx.currentPlayer].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.publicPlayers[ctx.currentPlayer].handCoins.findIndex(coin => coin !== null);
        if (coinId !== -1) {
            G.publicPlayers[ctx.currentPlayer].boardCoins[i] = G.publicPlayers[ctx.currentPlayer].handCoins[coinId];
            G.publicPlayers[ctx.currentPlayer].handCoins[coinId] = null;
        }
    }
    const isEveryPlayersHandCoinsEmpty = G.publicPlayers.filter(player => player.buffs["everyTurn"] !== "Uline")
        .every(player => player.handCoins.every(coin => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
            ctx.events.setPhase("placeCoinsUline");
        } else {
            ctx.events.setPhase("pickCards");
        }
    } else {
        if (G.publicPlayers[ctx.currentPlayer].handCoins.every(coin => coin === null)) {
            ctx.events.endTurn();
        }
    }
};
