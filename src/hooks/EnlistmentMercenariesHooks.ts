import type { Ctx } from "boardgame.io";
import { IsMercenaryCampCard } from "../Camp";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddEnlistmentMercenariesActionsToStack } from "../helpers/CampHelpers";
import { CheckEndTierActionsOrEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { BuffNames } from "../typescript/enums";
import type { CampDeckCardTypes, IMyGameState, INext, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndEnlistmentMercenariesPhase = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && !player.actionsNum) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const playerI: IPublicPlayer | undefined = G.publicPlayers[i];
                if (playerI === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
                }
                allMercenariesPlayed = playerI.campCards.filter((card: CampDeckCardTypes): boolean =>
                    IsMercenaryCampCard(card)).length === 0;
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
export const CheckEndEnlistmentMercenariesTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    } else if (!player.stack.length) {
        return player.campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCampCard(card)).length === 0;
    }
};

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

export const OnEnlistmentMercenariesMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (!player.actionsNum) {
        const mercenariesCount: number =
            player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card)).length;
        if (mercenariesCount) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
            DrawCurrentProfit(G, ctx);
        }
    }
};

export const OnEnlistmentMercenariesTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddEnlistmentMercenariesActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};

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
        if (nextPlayer.campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCampCard(card)).length <
            currentPlayer.campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCampCard(card)).length) {
            return 1;
        } else if (nextPlayer.campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCampCard(card)).length >
            currentPlayer.campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCampCard(card)).length) {
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
        if (playerSorted.campCards.filter((card: CampDeckCardTypes): boolean =>
            IsMercenaryCampCard(card)).length) {
            playersIndexes.push(String(Object.values(G.publicPlayers)
                .findIndex((player: IPublicPlayer): boolean => player.nickname === playerSorted.nickname)));
        }
    });
    G.publicPlayersOrder = playersIndexes;
    if (playersIndexes.length > 1) {
        const playerIndex: string | undefined = playersIndexes[0];
        if (playerIndex === undefined) {
            throw new Error(`В массиве индексов игроков отсутствует индекс '0'.`);
        }
        G.publicPlayersOrder.push(playerIndex);
    }
};
