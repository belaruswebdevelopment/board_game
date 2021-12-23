import { HeroNames } from "../data/HeroData";
import { Phases } from "../Game";
import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
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
            ctx.events.setPhase(Phases.PlaceCoinsUline);
        }
        else {
            ctx.events.setPhase(Phases.PickCards);
        }
    }
    else {
        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .every((coin) => coin === null)) {
            ctx.events.endTurn();
        }
    }
};
