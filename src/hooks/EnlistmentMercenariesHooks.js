import { IsMercenaryCampCard } from "../Camp";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames } from "../typescript/enums";
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
export const CheckEndEnlistmentMercenariesPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const playerI = G.publicPlayers[i];
                if (playerI === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                allMercenariesPlayed = playerI.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
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
export const CheckEndEnlistmentMercenariesTurn = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    }
    else if (!player.stack.length) {
        return player.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
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
export const EndEnlistmentMercenariesActions = (G, ctx) => {
    if (G.tierToEnd === 0) {
        const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
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
export const OnEnlistmentMercenariesMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        const mercenariesCount = player.campCards.filter((card) => IsMercenaryCampCard(card)).length;
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
export const OnEnlistmentMercenariesTurnBegin = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        let stack;
        if (ctx.playOrderPos === 0) {
            stack = [StackData.startOrPassEnlistmentMercenaries()];
        }
        else {
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
export const OnEnlistmentMercenariesTurnEnd = (G, ctx) => {
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
export const PrepareMercenaryPhaseOrders = (G) => {
    const sortedPlayers = Object.values(G.publicPlayers).map((player) => player), playersIndexes = [];
    sortedPlayers.sort((nextPlayer, currentPlayer) => {
        if (nextPlayer.campCards.filter((card) => IsMercenaryCampCard(card)).length <
            currentPlayer.campCards.filter((card) => IsMercenaryCampCard(card)).length) {
            return 1;
        }
        else if (nextPlayer.campCards.filter((card) => IsMercenaryCampCard(card)).length >
            currentPlayer.campCards.filter((card) => IsMercenaryCampCard(card)).length) {
            return -1;
        }
        if (nextPlayer.priority.value < currentPlayer.priority.value) {
            return 1;
        }
        else if (nextPlayer.priority.value > currentPlayer.priority.value) {
            return -1;
        }
        return 0;
    });
    sortedPlayers.forEach((playerSorted) => {
        if (playerSorted.campCards.filter((card) => IsMercenaryCampCard(card)).length) {
            playersIndexes.push(String(Object.values(G.publicPlayers)
                .findIndex((player) => player.nickname === playerSorted.nickname)));
        }
    });
    G.publicPlayersOrder = playersIndexes;
    if (playersIndexes.length > 1) {
        const playerIndex = playersIndexes[0];
        if (playerIndex === undefined) {
            throw new Error(`В массиве индексов игроков отсутствует индекс '0'.`);
        }
        G.publicPlayersOrder.push(playerIndex);
    }
};
//# sourceMappingURL=EnlistmentMercenariesHooks.js.map