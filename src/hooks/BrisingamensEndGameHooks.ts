import { Ctx } from "boardgame.io";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { EndGame } from "../helpers/GameHooksHelpers";
import { Phases } from "../typescript/enums";
import { INext, IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

export const CheckBrisingamensEndGameOrder = (G: IMyGameState): void => {
    const brisingamensPlayerIndex: number =
        G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.discardCardEndGame === true);
    G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
};

export const EndBrisingamensEndGameActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

export const OnBrisingamensEndGamePhaseTurnBegin = (G: IMyGameState, ctx: Ctx): void =>
    AddBrisingamensEndGameActionsToStack(G, ctx);

/**
 * <h3>Начинает фазу 'getMjollnirProfit' или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 * @param G
 * @param ctx
 * @returns
 */
export const StartGetMjollnirProfitOrEndGame = (G: IMyGameState, ctx: Ctx): void | INext => {
    if (G.publicPlayersOrder.length) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame === undefined) {
            const buffIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                Boolean(player.buffs.getMjollnirProfit));
            if (buffIndex !== -1) {
                return {
                    next: Phases.GetMjollnirProfit,
                };
            } else {
                EndGame(ctx);
            }
        }
    }
};
