import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
import { HeroNames, Phases } from "../typescript/enums";
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
 */
export const BotsPlaceAllCoinsMove = (G, ctx, coinsOrder) => {
    var _a, _b, _c;
    for (let i = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin) => coin !== null);
        if (coinId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] =
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId];
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId] = null;
        }
        else {
            // todo LogTypes.ERROR ?
        }
    }
    const isEveryPlayersHandCoinsEmpty = G.publicPlayers
        .filter((player) => player.buffs.everyTurn !== HeroNames.Uline)
        .every((player) => player.handCoins
        .every((coin) => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === Phases.PlaceCoinsUline) {
            (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.PlaceCoinsUline);
        }
        else {
            (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setPhase(Phases.PickCards);
        }
    }
    else {
        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .every((coin) => coin === null)) {
            (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endTurn();
        }
    }
};
