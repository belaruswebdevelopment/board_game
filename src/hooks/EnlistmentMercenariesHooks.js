import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { ErrorNames, HeroBuffNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndEnlistmentMercenariesPhase = ({ G, ctx, ...rest }) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const playerI = G.publicPlayers[i];
                if (playerI === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
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
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndEnlistmentMercenariesTurn = ({ G, ctx, ...rest }) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });
    }
    else if (!player.stack.length) {
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
 * @returns
 */
export const EndEnlistmentMercenariesActions = ({ G, ctx, ...rest }) => {
    if (G.tierToEnd === 0) {
        const yludIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest }, HeroBuffNames.EndTier));
        if (yludIndex === -1) {
            RemoveThrudFromPlayerBoardAfterGameEnd({ G, ctx, ...rest });
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
 * @returns
 */
export const OnEnlistmentMercenariesMove = ({ G, ctx, events, ...rest }) => {
    StartOrEndActions({ G, ctx, playerID: ctx.currentPlayer, events, ...rest });
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        const mercenariesCount = player.campCards.filter(IsMercenaryCampCard).length;
        if (mercenariesCount) {
            AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, events, ...rest }, [StackData.enlistmentMercenaries()]);
            DrawCurrentProfit({ G, ctx, playerID: ctx.currentPlayer, events, ...rest });
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
 * @returns
 */
export const OnEnlistmentMercenariesTurnBegin = ({ G, ctx, events, ...rest }) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        let stack;
        if (ctx.playOrderPos === 0) {
            stack = [StackData.startOrPassEnlistmentMercenaries()];
        }
        else {
            stack = [StackData.enlistmentMercenaries()];
        }
        AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, events, ...rest }, stack);
        DrawCurrentProfit({ G, ctx, playerID: ctx.currentPlayer, events, ...rest });
    }
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
export const PrepareMercenaryPhaseOrders = ({ G }) => {
    const sortedPlayers = Object.values(G.publicPlayers).map((player) => player), playersIndexes = [];
    sortedPlayers.sort((nextPlayer, currentPlayer) => {
        if (nextPlayer.campCards.filter(IsMercenaryCampCard).length <
            currentPlayer.campCards.filter(IsMercenaryCampCard).length) {
            return 1;
        }
        else if (nextPlayer.campCards.filter(IsMercenaryCampCard).length >
            currentPlayer.campCards.filter(IsMercenaryCampCard).length) {
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
        if (playerSorted.campCards.filter(IsMercenaryCampCard).length) {
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