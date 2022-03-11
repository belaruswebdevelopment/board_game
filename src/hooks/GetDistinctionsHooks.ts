import type { Ctx } from "boardgame.io";
import { CheckDistinction } from "../Distinction";
import { AddGetDistinctionsActionToStack } from "../helpers/ActionHelpers";
import { RefillCamp } from "../helpers/CampHelpers";
import { ClearPlayerPickedCard, EndTurnActions, StartOrEndActions } from "../helpers/GameHooksHelpers";
import type { DistinctionTypes, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет порядок получения преимуществ при начале фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckAndResolveDistinctionsOrders = (G: IMyGameState, ctx: Ctx): void => {
    CheckDistinction(G, ctx);
    const distinctions: DistinctionTypes[] =
        Object.values(G.distinctions).filter((distinction: DistinctionTypes): boolean =>
            distinction !== null && distinction !== undefined);
    if (distinctions.every((distinction: DistinctionTypes): boolean =>
        distinction !== null && distinction !== undefined)) {
        G.publicPlayersOrder = distinctions as string[];
    }
};

/**
 * <h3>Проверяет необходимость завершения фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом получении преимуществ в фазе 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
* @param ctx
 * @returns
 */
export const CheckEndGetDistinctionsPhase = (G: IMyGameState, ctx: Ctx): boolean | void => {
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player !== undefined) {
            if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
                && !player.actionsNum) {
                return Object.values(G.distinctions).every((distinction: DistinctionTypes): boolean =>
                    distinction === undefined);
            }
        } else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }

};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckNextGetDistinctionsTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
    return EndTurnActions(G, ctx);
};

/**
 * <h3>Действия при завершении фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 */
export const EndGetDistinctionsPhaseActions = (G: IMyGameState): void => {
    if (G.expansions.thingvellir?.active) {
        RefillCamp(G);
    }
    G.publicPlayersOrder = [];
};

export const OnGetDistinctionsMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

export const OnGetDistinctionsTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddGetDistinctionsActionToStack(G, ctx);
};

export const OnGetDistinctionsTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
};
