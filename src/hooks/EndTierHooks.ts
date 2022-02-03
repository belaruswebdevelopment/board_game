import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckEndGameLastActions, ClearPlayerPickedCard, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddEndTierActionsToStack } from "../helpers/HeroHelpers";
import { PlayerCardsType } from "../typescript/card_types";
import { HeroNames } from "../typescript/enums";
import { IMyGameState, INext } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndEndTierPhase = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    if (G.publicPlayersOrder.length) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.endTier === HeroNames.Ylud);
        if (yludIndex !== -1) {
            const index: number = Object.values(G.publicPlayers[yludIndex].cards).flat()
                .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Ylud);
            if (index !== -1) {
                return CheckEndGameLastActions(G, ctx);
            }
        } else {
            // TODO Error logging buff Ylud must be
        }
    }
};

/**
 * <h3>Проверяет порядок хода при начале фазы 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'endTier'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckEndTierOrder = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
    const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        player.buffs.endTier === HeroNames.Ylud);
    G.publicPlayersOrder.push(String(yludIndex));
};

export const EndEndTierActions = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
    G.publicPlayersOrder = [];
};

export const OnEndTierMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};
export const OnEndTierTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
};

export const OnEndTierTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddEndTierActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config);
};
