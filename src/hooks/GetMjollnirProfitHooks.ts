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
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (!player.stack.length && !player.actionsNum) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    }
};

export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void => {
    const mjollnirPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${BuffNames.GetMjollnirProfit}'.`);
    }
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};

export const OnGetMjollnirProfitMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

export const OnGetMjollnirProfitTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddGetMjollnirProfitActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};

export const StartEndGame = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
