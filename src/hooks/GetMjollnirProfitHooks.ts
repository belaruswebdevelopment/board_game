import type { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames } from "../typescript/enums";
import type { IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndGetMjollnirProfitPhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        if (G.publicPlayersOrder.length && !player.stack.length) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void | never => {
    const mjollnirPlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex !== -1) {
        G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
    } else {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.GetMjollnirProfit}.`);
    }
};

export const OnGetMjollnirProfitMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

export const OnGetMjollnirProfitTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddGetMjollnirProfitActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};

export const StartEndGame = (G: IMyGameState, ctx: Ctx) => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
