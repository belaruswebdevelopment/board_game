import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет порядок хода при начале фазы 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckBrisingamensEndGameOrder = (G: IMyGameState): void => {
    const brisingamensPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.DiscardCardEndGame}'.`);
    }
    G.publicPlayersOrder.push(String(brisingamensPlayerIndex));
};

/**
 * <h3>Начинает фазу 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndBrisingamensEndGamePhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => {
    if (G.publicPlayersOrder.length && ctx.playOrder.length === 1 && G.publicPlayersOrder[0] === ctx.playOrder[0]
        && ctx.currentPlayer === ctx.playOrder[0]) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (!CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame) && !player.stack.length) {
            const buffIndex: number =
                Object.values(G.publicPlayers).findIndex((playerB: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(playerB, BuffNames.GetMjollnirProfit));
            if (buffIndex !== -1) {
                return true;
            }
        }
    }
};

/**
 * <h3>Действия при завершении фазы 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 */
export const EndBrisingamensEndGameActions = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnBrisingamensEndGameMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

/**
 * <h3>Действия при начале хода в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnBrisingamensEndGameTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStack(G, ctx, [StackData.brisingamensEndGameAction()]);
    DrawCurrentProfit(G, ctx);
};
