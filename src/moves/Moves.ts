import {INVALID_MOVE} from "boardgame.io/core";
import {AddCardToPlayer, IStack} from "../Player";
import {suitsConfig} from "../data/SuitData";
import {IsValidMove} from "../MoveValidator";
import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionFromStackAndAddNew,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
import {CheckAndMoveThrudOrPickHeroAction} from "../actions/HeroActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";
import {Ctx, Move} from "boardgame.io";
import {DeckCardTypes, MyGameState} from "../GameSetup";
import {isCardNotAction} from "../Card";
// todo Add logging

/**
 * <h3>Выбор карты из таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны игроком.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id карты.
 * @returns {string | void}
 * @constructor
 */
export const ClickCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({objId: G.currentTavern, values: [G.currentTavern]})
        && IsValidMove({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length],
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card: DeckCardTypes | null = G.taverns[G.currentTavern][cardId];
    let suitId: null | number = null;
    G.taverns[G.currentTavern][cardId] = null;
    if (card !== null) {
        const isAdded: boolean = AddCardToPlayer(G, ctx, card);
        if (isCardNotAction(card)) {
            if (isAdded) {
                CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
                suitId = GetSuitIndexByName(card.suit);
            }
        } else {
            AddActionsToStack(G, ctx, card.stack);
        }
        if (G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            StartActionFromStackOrEndActions(G, ctx, false, suitId);
        } else {
            AfterBasicPickCardActions(G, ctx, false);
        }
    }
};

/**
 * <h3>Выбор конкретного преимущества по фракциям в конце первой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После определения преимуществ по фракциям в конце первой эпохи.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id карты.
 * @returns {string | void}
 * @constructor
 */
export const ClickDistinctionCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const index: number = G.distinctions.indexOf(Number(ctx.currentPlayer)),
        isValidMove: boolean = IsValidMove({objId: cardId, values: [index]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[Object.keys(suitsConfig)[cardId]].distinction
        .awarding(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)]);
};

/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id карты.
 * @constructor
 */
export const ClickCardToPickDistinction: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.decks[1][cardId]),
        pickedCard: DeckCardTypes = G.decks[1].splice(cardId, 1)[0];
    let suitId: null | number = null;
    G.decks[1] = ctx.random!.Shuffle(G.decks[1]);
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            delete G.distinctions[4];
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suitId = GetSuitIndexByName(pickedCard.suit);
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * <h3>Выбор карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт из дискарда по действию героев.</li>
 * <li>Выбор карт из дискарда по действию артефактов.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id карты.
 * @constructor
 */
export const PickDiscardCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
};

/**
 * <h3>Начало вербовки наёмников.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников выбирает старт вербовки.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export const StartEnlistmentMercenaries: Move<MyGameState> = (G: MyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "enlistmentMercenaries",
                drawName: "Enlistment Mercenaries",
            },
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack);
};

/**
 * <h3>Пасс первого игрока в начале фазы вербовки наёмников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников пасует для того, чтобы вербовать последним.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export const PassEnlistmentMercenaries: Move<MyGameState> = (G: MyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            actionName: "PassEnlistmentMercenariesAction",
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack);
};

/**
 * <h3>Выбор игроком карты наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе какую карту наёмника будет вербовать игрок.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id карты.
 * @constructor
 */
export const GetEnlistmentMercenaries: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    const stack: IStack[] = [
        {
            actionName: "GetEnlistmentMercenariesAction",
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, cardId);
};

/**
 * <h3>Выбор фракции куда будет завербован наёмник.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции, куда будет завербован наёмник.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @constructor
 */
export const PlaceEnlistmentMercenaries: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number): void => {
    const stack: IStack[] = [
        {
            actionName: "PlaceEnlistmentMercenariesAction",
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};
