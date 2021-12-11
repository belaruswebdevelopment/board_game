import { INVALID_MOVE } from "boardgame.io/core";
import { AddCardToPlayer } from "../Player";
import { suitsConfig } from "../data/SuitData";
import { IsValidMove } from "../MoveValidator";
import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew, StartActionFromStackOrEndActions } from "../helpers/StackHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../actions/HeroActions";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { AfterBasicPickCardActions } from "../helpers/MovesHelpers";
import { isCardNotAction } from "../Card";
import { AddDataToLog, LogTypes } from "../Logging";
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
export var ClickCard = function (G, ctx, cardId) {
    var isValidMove = IsValidMove({ objId: G.currentTavern, values: [G.currentTavern] })
        && IsValidMove({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length],
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    var card = G.taverns[G.currentTavern][cardId];
    var suitId = null;
    G.taverns[G.currentTavern][cardId] = null;
    if (card !== null) {
        var isAdded = AddCardToPlayer(G, ctx, card);
        if (isCardNotAction(card)) {
            if (isAdded) {
                CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
                suitId = GetSuitIndexByName(card.suit);
            }
        }
        else {
            AddActionsToStack(G, ctx, card.stack);
        }
        if (G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            StartActionFromStackOrEndActions(G, ctx, false, suitId);
        }
        else {
            AfterBasicPickCardActions(G, ctx, false);
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не существует кликнутая карта.");
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
export var ClickDistinctionCard = function (G, ctx, cardId) {
    var index = G.distinctions.indexOf(Number(ctx.currentPlayer)), isValidMove = IsValidMove({ objId: cardId, values: [index] });
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
export var ClickCardToPickDistinction = function (G, ctx, cardId) {
    var isAdded = AddCardToPlayer(G, ctx, G.decks[1][cardId]), pickedCard = G.decks[1].splice(cardId, 1)[0];
    var suitId = null;
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            delete G.distinctions[4];
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suitId = GetSuitIndexByName(pickedCard.suit);
        }
    }
    else {
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
export var PickDiscardCard = function (G, ctx, cardId) {
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
export var StartEnlistmentMercenaries = function (G, ctx) {
    var stack = [
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
export var PassEnlistmentMercenaries = function (G, ctx) {
    var stack = [
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
export var GetEnlistmentMercenaries = function (G, ctx, cardId) {
    var stack = [
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
export var PlaceEnlistmentMercenaries = function (G, ctx, suitId) {
    var stack = [
        {
            actionName: "PlaceEnlistmentMercenariesAction",
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};
