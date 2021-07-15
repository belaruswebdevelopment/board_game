import {CheckAndStartUlineActionsOrContinue} from "../helpers/HeroHelpers";

/**
 * Выкладка монет ботами.
 * Применения:
 * 1) Когда ботам нужно выложить все монеты на игровой планшет.
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @constructor
 */
export const BotsPlaceAllCoins = (G, ctx, coinsOrder) => {
    for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin !== null);
        // todo Add for fix if no 1 coin in game!
        if (coinId !== -1) {
            G.players[ctx.currentPlayer].boardCoins[i] = G.players[ctx.currentPlayer].handCoins[coinId];
            G.players[ctx.currentPlayer].handCoins[coinId] = null;
        }
    }
    const isEveryPlayersHandCoinsEmpty = G.players.filter(player => player.buffs?.["everyTurn"] !== "Uline")
        .every(player => player.handCoins.every(coin => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
            ctx.events.setPhase("placeCoinsUline");
        } else {
            ctx.events.setPhase("pickCards");
        }
    } else {
        if (G.players[ctx.currentPlayer].handCoins.every(coin => coin === null)) {
            ctx.events.endTurn();
        }
    }
};
