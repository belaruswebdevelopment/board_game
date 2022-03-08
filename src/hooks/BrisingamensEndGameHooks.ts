import type { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddBrisingamensEndGameActionsToStack } from "../helpers/CampHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames, Phases } from "../typescript/enums";
import type { IMyGameState, INext, IPublicPlayer } from "../typescript/interfaces";

export const CheckBrisingamensEndGameOrder = (G: IMyGameState): void => {
    const brisingamensPlayerIndex: number =
        G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
    } else {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.DiscardCardEndGame}.`);
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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (G.publicPlayersOrder.length && !player.stack.length) {
            const firstPlayer: IPublicPlayer | undefined = G.publicPlayers[Number(G.publicPlayersOrder[0])];
            if (firstPlayer !== undefined) {
                if (!CheckPlayerHasBuff(firstPlayer, BuffNames.EveryTurn)) {
                    const buffIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
                        CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
                    if (buffIndex !== -1) {
                        return {
                            next: Phases.GetMjollnirProfit,
                        };
                    } else {
                        return true;
                    }
                }
            } else {
                throw new Error(`В массиве игроков отсутствует игрок с первым ходом.`);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
