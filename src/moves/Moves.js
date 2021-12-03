"use strict";
exports.__esModule = true;
exports.PlaceEnlistmentMercenaries = exports.GetEnlistmentMercenaries = exports.PassEnlistmentMercenaries = exports.StartEnlistmentMercenaries = exports.PickDiscardCard = exports.ClickCardToPickDistinction = exports.ClickDistinctionCard = exports.ClickCard = void 0;
var core_1 = require("boardgame.io/core");
var Player_1 = require("../Player");
var SuitData_1 = require("../data/SuitData");
var MoveValidator_1 = require("../MoveValidator");
var StackHelpers_1 = require("../helpers/StackHelpers");
var HeroActions_1 = require("../actions/HeroActions");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var MovesHelpers_1 = require("../helpers/MovesHelpers");
var Card_1 = require("../Card");
// todo Add logging
/**
 * <h3>Выбор карты из таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {string|*}
 * @constructor
 */
var ClickCard = function (G, ctx, cardId) {
    var isValidMove = (0, MoveValidator_1.IsValidMove)({ objId: G.currentTavern, values: [G.currentTavern] }) &&
        (0, MoveValidator_1.IsValidMove)({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length]
        });
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    var card = G.taverns[G.currentTavern][cardId];
    var suitId = null;
    G.taverns[G.currentTavern][cardId] = null;
    if (card) {
        var isAdded = (0, Player_1.AddCardToPlayer)(G, ctx, card);
        if ((0, Card_1.isCardNotAction)(card)) {
            if (isAdded) {
                (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, card);
                suitId = (0, SuitHelpers_1.GetSuitIndexByName)(card.suit);
            }
        }
        else {
            (0, StackHelpers_1.AddActionsToStack)(G, ctx, card.stack);
        }
        if (G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            (0, StackHelpers_1.StartActionFromStackOrEndActions)(G, ctx, false, suitId);
        }
        else {
            (0, MovesHelpers_1.AfterBasicPickCardActions)(G, ctx, false);
        }
    }
};
exports.ClickCard = ClickCard;
/**
 * <h3>Выбор конкретного преимущества по фракциям в конце первой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После определения преимуществ по фракциям в конце первой эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {string}
 * @constructor
 */
var ClickDistinctionCard = function (G, ctx, cardId) {
    var index = G.distinctions.indexOf(Number(ctx.currentPlayer)), isValidMove = (0, MoveValidator_1.IsValidMove)({ objId: cardId, values: [index] });
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    SuitData_1.suitsConfig[Object.keys(SuitData_1.suitsConfig)[cardId]].distinction.awarding(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)]);
};
exports.ClickDistinctionCard = ClickDistinctionCard;
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var ClickCardToPickDistinction = function (G, ctx, cardId) {
    var isAdded = (0, Player_1.AddCardToPlayer)(G, ctx, G.decks[1][cardId]), pickedCard = G.decks[1].splice(cardId, 1)[0];
    var suitId = null;
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if ((0, Card_1.isCardNotAction)(pickedCard)) {
        if (isAdded) {
            delete G.distinctions[4];
            (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, pickedCard);
            suitId = (0, SuitHelpers_1.GetSuitIndexByName)(pickedCard.suit);
        }
    }
    else {
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, pickedCard.stack);
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
};
exports.ClickCardToPickDistinction = ClickCardToPickDistinction;
/**
 * <h3>Выбор карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт из дискарда по действию героев.</li>
 * <li>Выбор карт из дискарда по действию артефактов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var PickDiscardCard = function (G, ctx, cardId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], cardId);
};
exports.PickDiscardCard = PickDiscardCard;
/**
 * <h3>Начало вербовки наёмников.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников выбирает старт вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var StartEnlistmentMercenaries = function (G, ctx) {
    var stack = [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "enlistmentMercenaries",
                drawName: "Enlistment Mercenaries"
            }
        },
    ];
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack);
};
exports.StartEnlistmentMercenaries = StartEnlistmentMercenaries;
/**
 * <h3>Пасс первого игрока в начале фазы вербовки наёмников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников пасует для того, чтобы вербовать последним.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var PassEnlistmentMercenaries = function (G, ctx) {
    var stack = [
        {
            actionName: "PassEnlistmentMercenariesAction"
        },
    ];
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack);
};
exports.PassEnlistmentMercenaries = PassEnlistmentMercenaries;
/**
 * <h3>Выбор игроком карты наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе какую карту наёмника будет вербовать игрок.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var GetEnlistmentMercenaries = function (G, ctx, cardId) {
    var stack = [
        {
            actionName: "GetEnlistmentMercenariesAction"
        },
    ];
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack, cardId);
};
exports.GetEnlistmentMercenaries = GetEnlistmentMercenaries;
/**
 * <h3>Выбор фракции куда будет завербован наёмник.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции, куда будет завербован наёмник.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceEnlistmentMercenaries = function (G, ctx, suitId) {
    var stack = [
        {
            actionName: "PlaceEnlistmentMercenariesAction"
        },
    ];
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack, suitId);
};
exports.PlaceEnlistmentMercenaries = PlaceEnlistmentMercenaries;
