import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, CampBuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndGetMjollnirProfitPhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (!player.stack.length) {
            return CheckPlayerHasBuff({ G, ctx, playerID: ctx.currentPlayer, ...rest },
                BuffNames.SuitIdForMjollnir);
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
export const CheckGetMjollnirProfitOrder = ({ G, ctx, ...rest }: FnContext): void => {
    const mjollnirPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                CampBuffNames.GetMjollnirProfit));
    if (mjollnirPlayerIndex === -1) {
        throw new Error(`У игроков отсутствует обязательный баф '${CampBuffNames.GetMjollnirProfit}'.`);
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
export const OnGetMjollnirProfitMove = ({ G, ctx, ...rest }: FnContext): void => {
    StartOrEndActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });
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
export const OnGetMjollnirProfitTurnBegin = ({ G, ctx, events, ...rest }: FnContext): void => {
    AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, events, ...rest },
        [StackData.getMjollnirProfit()]);
    DrawCurrentProfit({ G, ctx, playerID: ctx.currentPlayer, events, ...rest });
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
export const StartEndGame = ({ G, events }: FnContext): void => {
    G.publicPlayersOrder = [];
    events.endGame();
};
