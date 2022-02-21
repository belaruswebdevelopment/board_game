import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { Phases } from "../typescript/enums";
import { IBuffs, IMyGameState, INext, IPublicPlayer } from "../typescript/interfaces";

export const CheckBrisingamensEndGameOrder = (G: IMyGameState): void => {
    const brisingamensPlayerIndex: number =
        G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean =>
                buff.discardCardEndGame !== undefined)));
    if (brisingamensPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
    } else {
        // TODO Error!
    }
};

export const EndBrisingamensEndGameActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

export const OnBrisingamensEndGameMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

export const OnBrisingamensEndGameTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddBrisingamensEndGameActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
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
    if (G.publicPlayersOrder.length && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        if (G.publicPlayers[Number(G.publicPlayersOrder[0])].buffs.find((buff: IBuffs): boolean =>
            buff.discardCardEndGame !== undefined) === undefined) {
            const buffIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                Boolean(player.buffs.find((buff: IBuffs): boolean =>
                    buff.getMjollnirProfit !== undefined)));
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
