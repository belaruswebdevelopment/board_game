"use strict";
exports.__esModule = true;
exports.BotsPlaceAllCoins = void 0;
var HeroHelpers_1 = require("../helpers/HeroHelpers");
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
var BotsPlaceAllCoins = function (G, ctx, coinsOrder) {
    for (var i = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
        var coinId = coinsOrder[i] || G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex(function (coin) { return coin !== null; });
        if (coinId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] =
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId];
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId] = null;
        }
    }
    var isEveryPlayersHandCoinsEmpty = G.publicPlayers.filter(function (player) { return player.buffs.everyTurn
        !== "Uline"; }).every(function (player) { return player.handCoins.every(function (coin) { return coin === null; }); });
    if (isEveryPlayersHandCoinsEmpty) {
        if ((0, HeroHelpers_1.CheckAndStartUlineActionsOrContinue)(G, ctx) === "placeCoinsUline") {
            ctx.events.setPhase("placeCoinsUline");
        }
        else {
            ctx.events.setPhase("pickCards");
        }
    }
    else {
        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins.every(function (coin) { return coin === null; })) {
            ctx.events.endTurn();
        }
    }
};
exports.BotsPlaceAllCoins = BotsPlaceAllCoins;
