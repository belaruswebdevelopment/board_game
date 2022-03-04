import type { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames } from "../typescript/enums";
import type { IBuffs, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckEndGetMjollnirProfitPhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (G.publicPlayersOrder.length && !player.stack.length) {
        return player.buffs.find((buff: IBuffs): boolean =>
            buff.suitIdForMjollnir !== undefined) !== undefined;
    }
};

export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void | never => {
    const mjollnirPlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        Boolean(player.buffs.find((buff: IBuffs): boolean => buff.getMjollnirProfit !== undefined)));
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
