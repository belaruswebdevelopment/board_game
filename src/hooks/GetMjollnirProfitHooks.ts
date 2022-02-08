import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddGetMjollnirProfitActionsToStack } from "../helpers/CampHelpers";
import { EndGame } from "../helpers/GameHooksHelpers";
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
export const CheckEndGetMjollnirProfitPhase = (G: IMyGameState): boolean | void => {
    if (G.publicPlayersOrder.length) {
        return G.suitIdForMjollnir !== null;
    }
};

export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void => {
    const mjollnirPlayerIndex: number =
        G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.getMjollnirProfit === true);
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};

export const OnGetMjollnirProfitTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddGetMjollnirProfitActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};

export const StartEndGame = (G: IMyGameState, ctx: Ctx) => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
