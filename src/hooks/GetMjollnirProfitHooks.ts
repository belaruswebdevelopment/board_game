import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { EndGame, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции для применения эффекта артефакта Mjollnir в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndGetMjollnirProfitPhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (!player.stack.length) {
            return CheckPlayerHasBuff(player, BuffNames.SuitIdForMjollnir);
        }
    }
};

/**
 * <h3>Проверяет порядок хода при начале фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckGetMjollnirProfitOrder = (G: IMyGameState): void => {
    const mjollnirPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${BuffNames.GetMjollnirProfit}'.`);
    }
    G.publicPlayersOrder.push(String(mjollnirPlayerIndex));
};

/**
 * <h3>Действия при завершении мува в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnGetMjollnirProfitMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

/**
 * <h3>Действия при начале хода в фазе 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnGetMjollnirProfitTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStack(G, ctx, [StackData.getMjollnirProfit()]);
    DrawCurrentProfit(G, ctx);
};

/**
 * <h3>Действия завершения игры при завершении фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartEndGame = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    EndGame(ctx);
};
