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
    for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin !== null);
        if (coinId !== -1) {
            G.players[ctx.currentPlayer].boardCoins[i] = G.players[ctx.currentPlayer].handCoins[coinId];
            G.players[ctx.currentPlayer].handCoins[coinId] = null;
        }
    }
    const isEveryPlayersHandCoinsEmpty = G.players.filter(player => player.buffs["everyTurn"] !== "Uline")
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
