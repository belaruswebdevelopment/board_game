import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { Phases } from "../typescript/enums";
import { IMyGameState, INext } from "../typescript/game_data_interfaces";
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

export const OnBrisingamensEndGameTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddBrisingamensEndGameActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config);
};

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
export const StartGetMjollnirProfitOrEndGame = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    if (G.publicPlayersOrder.length) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame === undefined) {
            const buffIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                Boolean(player.buffs.getMjollnirProfit));
            if (buffIndex !== -1) {
                return {
                    next: Phases.GetMjollnirProfit,
                };
            } else {
                return true;
            }
        }
    }
};
