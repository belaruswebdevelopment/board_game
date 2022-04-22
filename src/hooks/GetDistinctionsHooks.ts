import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { CheckDistinction } from "../Distinction";
import { RefillCamp } from "../helpers/CampHelpers";
import { ClearPlayerPickedCard, EndTurnActions, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { SuitNames } from "../typescript/enums";
import type { DeckCardTypes, DistinctionTypes, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && !player.actionsNum) {
            return Object.values(G.distinctions).every((distinction: DistinctionTypes): boolean =>
                distinction === undefined);
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
    if (G.expansions.thingvellir.active) {
        RefillCamp(G);
    }
    G.publicPlayersOrder = [];
};

export const OnGetDistinctionsMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};

export const OnGetDistinctionsTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getDistinctions()]);
    if (G.distinctions[SuitNames.EXPLORER] === ctx.currentPlayer && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        for (let j = 0; j < 3; j++) {
            const deck1: DeckCardTypes[] | undefined = G.secret.decks[1];
            if (deck1 === undefined) {
                throw new Error(`В массиве дек карт отсутствует дека '1' эпохи.`);
            }
            const card: DeckCardTypes | undefined = deck1[j];
            if (card === undefined) {
                throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
            }
            G.explorerDistinctionCards.push(card);
        }
    }
};

export const OnGetDistinctionsTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
    if (G.explorerDistinctionCardId !== null && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        const deck1: DeckCardTypes[] | undefined = G.secret.decks[1];
        if (deck1 === undefined) {
            throw new Error(`Отсутствует колода карт '2' эпохи.`);
        }
        deck1.splice(G.explorerDistinctionCardId, 1);
        G.deckLength[1] = deck1.length;
        G.secret.decks[1] = ctx.random!.Shuffle(deck1);
        G.explorerDistinctionCardId = null;
    }
};
