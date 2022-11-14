import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CampBuffNames, ErrorNames, PhaseNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет порядок хода при начале фазы 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const CheckBrisingamensEndGameOrder = ({ G, ctx, ...rest }: FnContext): void => {
    const brisingamensPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                CampBuffNames.DiscardCardEndGame));
    if (brisingamensPlayerIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${CampBuffNames.DiscardCardEndGame}'.`);
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
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndBrisingamensEndGamePhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<true> => {
    if (G.publicPlayersOrder.length && ctx.playOrder.length === 1 && G.publicPlayersOrder[0] === ctx.playOrder[0]
        && ctx.currentPlayer === ctx.playOrder[0]) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (!CheckPlayerHasBuff({ G, ctx, playerID: ctx.currentPlayer, ...rest },
            CampBuffNames.DiscardCardEndGame) && !player.stack.length) {
            const buffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number):
                    boolean => CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                        CampBuffNames.GetMjollnirProfit));
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
 * @returns
 */
export const EndBrisingamensEndGameActions = ({ G }: FnContext): void => {
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
 * @returns
 */
export const OnBrisingamensEndGameMove = ({ G, ctx, ...rest }: FnContext): void => {
    StartOrEndActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });
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
 * @returns
 */
export const OnBrisingamensEndGameTurnBegin = ({ G, ctx, ...rest }: FnContext): void => {
    AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, ...rest }, [StackData.brisingamensEndGameAction()]);
    DrawCurrentProfit({ G, ctx, playerID: ctx.currentPlayer, ...rest });
};

/**
 * <h3>Проверяет необходимость начала фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns Фаза игры.
 */
export const StartGetMjollnirProfitPhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<PhaseNames> => {
    const buffIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                CampBuffNames.GetMjollnirProfit));
    if (buffIndex !== -1) {
        return PhaseNames.GetMjollnirProfit;
    }
};
