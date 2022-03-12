import { IsMercenaryCampCard } from "../Camp";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddEnlistmentMercenariesActionsToStack } from "../helpers/CampHelpers";
import { CheckEndTierActionsOrEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { BuffNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndEnlistmentMercenariesPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && !player.actionsNum) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < G.publicPlayers.length; i++) {
                const playerI = G.publicPlayers[i];
                if (playerI === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
                }
                allMercenariesPlayed = playerI.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
                if (!allMercenariesPlayed) {
                    break;
                }
            }
            if (allMercenariesPlayed) {
                return CheckEndTierActionsOrEndGameLastActions(G);
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
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    }
    else if (!player.stack.length) {
        return player.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
    }
};
export const EndEnlistmentMercenariesActions = (G, ctx) => {
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex === -1) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
    }
    G.publicPlayersOrder = [];
};
export const OnEnlistmentMercenariesMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
export const OnEnlistmentMercenariesTurnBegin = (G, ctx) => {
    AddEnlistmentMercenariesActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};
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
    const players = G.publicPlayers.map((player) => player), playersIndexes = [];
    players.sort((nextPlayer, currentPlayer) => {
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
    players.forEach((playerSorted) => {
        if (playerSorted.campCards.filter((card) => IsMercenaryCampCard(card)).length) {
            playersIndexes.push(String(G.publicPlayers.findIndex((player) => player.nickname === playerSorted.nickname)));
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