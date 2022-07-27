import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IMyGameState, IPublicPlayer, IStack } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndEnlistmentMercenariesPhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const playerI: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
                if (playerI === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        i);
                }
                allMercenariesPlayed = playerI.campCards.filter(IsMercenaryCampCard).length === 0;
                if (!allMercenariesPlayed) {
                    break;
                }
            }
            if (allMercenariesPlayed) {
                return true;
            }
        }
    }
};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndEnlistmentMercenariesTurn = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    } else if (!player.stack.length) {
        return player.campCards.filter(IsMercenaryCampCard).length === 0;
    }
};

/**
 * <h3>Действия при завершении фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndEnlistmentMercenariesActions = (G: IMyGameState, ctx: Ctx): void => {
    if (G.tierToEnd === 0) {
        const yludIndex: number =
            Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex === -1) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
    }
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEnlistmentMercenariesMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        const mercenariesCount: number = player.campCards.filter(IsMercenaryCampCard).length;
        if (mercenariesCount) {
            AddActionsToStack(G, ctx, [StackData.enlistmentMercenaries()]);
            DrawCurrentProfit(G, ctx);
        }
    }
};

/**
 * <h3>Действия при начале хода в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEnlistmentMercenariesTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        let stack: IStack[];
        if (ctx.playOrderPos === 0) {
            stack = [StackData.startOrPassEnlistmentMercenaries()];
        } else {
            stack = [StackData.enlistmentMercenaries()];
        }
        AddActionsToStack(G, ctx, stack);
        DrawCurrentProfit(G, ctx);
    }
};

/**
 * <h3>Действия при завершении хода в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEnlistmentMercenariesTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
};

/**
* <h3>Определяет порядок найма наёмников при начале фазы 'enlistmentMercenaries'.</h3>
* <p>Применения:</p>
* <ol>
* <li>При начале фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
*/
export const PrepareMercenaryPhaseOrders = (G: IMyGameState): void => {
    const sortedPlayers: IPublicPlayer[] =
        Object.values(G.publicPlayers).map((player: IPublicPlayer): IPublicPlayer => player),
        playersIndexes: string[] = [];
    sortedPlayers.sort((nextPlayer: IPublicPlayer, currentPlayer: IPublicPlayer): number => {
        if (nextPlayer.campCards.filter(IsMercenaryCampCard).length <
            currentPlayer.campCards.filter(IsMercenaryCampCard).length) {
            return 1;
        } else if (nextPlayer.campCards.filter(IsMercenaryCampCard).length >
            currentPlayer.campCards.filter(IsMercenaryCampCard).length) {
            return -1;
        }
        if (nextPlayer.priority.value < currentPlayer.priority.value) {
            return 1;
        } else if (nextPlayer.priority.value > currentPlayer.priority.value) {
            return -1;
        }
        return 0;
    });
    sortedPlayers.forEach((playerSorted: IPublicPlayer): void => {
        if (playerSorted.campCards.filter(IsMercenaryCampCard).length) {
            playersIndexes.push(String(Object.values(G.publicPlayers)
                .findIndex((player: IPublicPlayer): boolean => player.nickname === playerSorted.nickname)));
        }
    });
    G.publicPlayersOrder = playersIndexes;
    if (playersIndexes.length > 1) {
        const playerIndex: CanBeUndefType<string> = playersIndexes[0];
        if (playerIndex === undefined) {
            throw new Error(`В массиве индексов игроков отсутствует индекс '0'.`);
        }
        G.publicPlayersOrder.push(playerIndex);
    }
};
