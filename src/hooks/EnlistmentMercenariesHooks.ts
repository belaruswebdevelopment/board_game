import { Ctx } from "boardgame.io";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddEnlistmentMercenariesActionsToStack } from "../helpers/CampHelpers";
import { CheckEndTierActionsOrEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { IBuffs } from "../typescript/buff_interfaces";
import { CampDeckCardTypes } from "../typescript/card_types";
import { RusCardTypes } from "../typescript/enums";
import { IMyGameState, INext } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

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
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
            && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            let allMercenariesPlayed = true;
            for (let i = 0; i < G.publicPlayers.length; i++) {
                allMercenariesPlayed = G.publicPlayers[i].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length === 0;
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (ctx.currentPlayer === ctx.playOrder[0] && Number(ctx.numMoves) === 1 && !player.stack.length) {
        return EndTurnActions(G, ctx);
    } else if (!player.stack.length) {
        return player.campCards.filter((card: CampDeckCardTypes): boolean =>
            card.type === RusCardTypes.MERCENARY).length === 0;
    }
};

export const EndEnlistmentMercenariesActions = (G: IMyGameState, ctx: Ctx): void => {
    if (G.tierToEnd === 0) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean => buff.endTier !== undefined)));
        if (yludIndex === -1) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
    }
    G.publicPlayersOrder = [];
};

export const OnEnlistmentMercenariesMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
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
* @param ctx
*/
export const PrepareMercenaryPhaseOrders = (G: IMyGameState): void => {
    const players: IPublicPlayer[] =
        G.publicPlayers.map((player: IPublicPlayer): IPublicPlayer => player),
        playersIndexes: string[] = [];
    players.sort((nextPlayer: IPublicPlayer, currentPlayer: IPublicPlayer): number => {
        if (nextPlayer.campCards
            .filter((card: CampDeckCardTypes): boolean =>
                card.type === RusCardTypes.MERCENARY).length < currentPlayer.campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length) {
            return 1;
        } else if (nextPlayer.campCards
            .filter((card: CampDeckCardTypes): boolean =>
                card.type === RusCardTypes.MERCENARY).length > currentPlayer.campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length) {
            return -1;
        }
        if (nextPlayer.priority.value < currentPlayer.priority.value) {
            return 1;
        } else if (nextPlayer.priority.value > currentPlayer.priority.value) {
            return -1;
        }
        return 0;
    });
    players.forEach((playerSorted: IPublicPlayer): void => {
        if (playerSorted.campCards
            .filter((card: CampDeckCardTypes): boolean =>
                card.type === RusCardTypes.MERCENARY).length) {
            playersIndexes.push(String(G.publicPlayers
                .findIndex((player: IPublicPlayer): boolean =>
                    player.nickname === playerSorted.nickname)));
        }
    });
    G.publicPlayersOrder = playersIndexes;
    if (playersIndexes.length > 1) {
        G.publicPlayersOrder.push(playersIndexes[0]);
    }
};
