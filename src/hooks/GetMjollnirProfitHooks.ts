import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { IBuffs } from "../typescript/buff_interfaces";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

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
    if (G.publicPlayersOrder.length && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        return G.publicPlayers[Number(ctx.currentPlayer)].buffs.find((buff: IBuffs): boolean =>
            buff.suitIdForMjollnir !== undefined) !== undefined;
    }
};

export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void => {
    const mjollnirPlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        Boolean(player.buffs.find((buff: IBuffs): boolean => buff.getMjollnirProfit !== undefined)));
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
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
