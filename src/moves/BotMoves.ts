import { Ctx, Move } from "boardgame.io";
import { IconType } from "../Coin";
import { HeroNames } from "../data/HeroData";
import { Phases } from "../Game";
import { MyGameState } from "../GameSetup";
import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
import { IPublicPlayer } from "../Player";

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
export const BotsPlaceAllCoinsMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinsOrder: number[]): void => {
    for (let i: number = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
        const coinId: number = coinsOrder[i] || G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: IconType): boolean => coin !== null);
        if (coinId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] =
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId];
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId] = null;
        } else {
            // todo LogTypes.ERROR ?
        }
    }
    const isEveryPlayersHandCoinsEmpty: boolean = G.publicPlayers
        .filter((player: IPublicPlayer): boolean => player.buffs.everyTurn !== HeroNames.Uline)
        .every((player: IPublicPlayer): boolean => player.handCoins
            .every((coin: IconType): boolean => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === Phases.PlaceCoinsUline) {
            ctx.events!.setPhase!(Phases.PlaceCoinsUline);
        } else {
            ctx.events!.setPhase!(Phases.PickCards);
        }
    } else {
        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .every((coin: IconType): boolean => coin === null)) {
            ctx.events!.endTurn!();
        }
    }
};
