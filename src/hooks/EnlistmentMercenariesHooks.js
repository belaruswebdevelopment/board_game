import { IsMercenaryCard } from "../Camp";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddEnlistmentMercenariesActionsToStack } from "../helpers/CampHelpers";
import { CheckEndTierActionsOrEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
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
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
            && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < G.publicPlayers.length; i++) {
                allMercenariesPlayed =
                    G.publicPlayers[i].campCards.filter((card) => IsMercenaryCard(card)).length === 0;
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
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    }
    else if (!player.stack.length) {
        return player.campCards.filter((card) => IsMercenaryCard(card)).length === 0;
    }
};
export const EndEnlistmentMercenariesActions = (G, ctx) => {
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
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
* @param ctx
*/
export const PrepareMercenaryPhaseOrders = (G) => {
    const players = G.publicPlayers.map((player) => player), playersIndexes = [];
    players.sort((nextPlayer, currentPlayer) => {
        if (nextPlayer.campCards.filter((card) => IsMercenaryCard(card)).length <
            currentPlayer.campCards.filter((card) => IsMercenaryCard(card)).length) {
            return 1;
        }
        else if (nextPlayer.campCards.filter((card) => IsMercenaryCard(card)).length >
            currentPlayer.campCards.filter((card) => IsMercenaryCard(card)).length) {
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
        if (playerSorted.campCards.filter((card) => IsMercenaryCard(card)).length) {
            playersIndexes.push(String(G.publicPlayers.findIndex((player) => player.nickname === playerSorted.nickname)));
        }
    });
    G.publicPlayersOrder = playersIndexes;
    if (playersIndexes.length > 1) {
        G.publicPlayersOrder.push(playersIndexes[0]);
    }
};
//# sourceMappingURL=EnlistmentMercenariesHooks.js.map