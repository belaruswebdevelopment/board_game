import { Ctx } from "boardgame.io";
import { CheckEndGameLastActions, RemoveThrudFromPlayerBoardAfterGameEnd } from "../helpers/GameHooksHelpers";
import { AddEndTierActionsToStack } from "../helpers/HeroHelpers";
import { PlayerCardsType } from "../typescript/card_types";
import { DrawNames, HeroNames } from "../typescript/enums";
import { INext, IMyGameState } from "../typescript/game_data_interfaces";
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
export const CheckEndEndTierPhase = (G: IMyGameState, ctx: Ctx): void | INext => {
    if (G.publicPlayersOrder.length) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.endTier === DrawNames.Ylud);
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
        player.buffs.endTier === DrawNames.Ylud);
    G.publicPlayersOrder.push(String(yludIndex));
};

export const EndEndTierActions = (G: IMyGameState, ctx: Ctx): void => {
    RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
    G.publicPlayersOrder = [];
};

export const OnEndTierPhaseTurnBegin = (G: IMyGameState, ctx: Ctx): void =>
    AddEndTierActionsToStack(G, ctx);
