"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.DiscardCardsFromPlayerBoardAction = exports.ActionDispatcher = void 0;
var Coin_1 = require("../Coin");
var core_1 = require("boardgame.io/core");
var SuitData_1 = require("../data/SuitData");
var Player_1 = require("../Player");
var StackHelpers_1 = require("../helpers/StackHelpers");
var Card_1 = require("../Card");
var HeroActions_1 = require("./HeroActions");
var CampActions_1 = require("./CampActions");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var Logging_1 = require("../Logging");
var Camp_1 = require("../Camp");
/**
 * <h3>Диспетчер действий при их активации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев выполняются последовательно их действия.</li>
 * <li>При выборе конкретных карт кэмпа выполняются последовательно их действия.</li>
 * <li>При выборе карт улучшения монет выполняются их действия.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Конфиг действий.
 * @param args Дополнительные аргументы.
 * @returns {*} Вызов действия.
 * @constructor
 */
var ActionDispatcher = function (G, ctx, data) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    var action;
    switch (data.actionName) {
        case "DrawProfitAction":
            action = DrawProfitAction;
            break;
        case "UpgradeCoinAction":
            action = UpgradeCoinAction;
            break;
        case "AddHeroToCards":
            action = HeroActions_1.AddHeroToCards;
            break;
        case "AddBuffToPlayer":
            action = AddBuffToPlayer;
            break;
        case "PickHeroWithConditions":
            action = HeroActions_1.PickHeroWithConditions;
            break;
        case "CheckDiscardCardsFromPlayerBoardAction":
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardsFromPlayerBoardAction":
            action = exports.DiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardFromTavernAction":
            action = DiscardCardFromTavernAction;
            break;
        case "PlaceCards":
            action = PlaceCards;
            break;
        case "CheckPickCampCard":
            action = CampActions_1.CheckPickCampCard;
            break;
        case "CheckPickDiscardCard":
            action = CheckPickDiscardCard;
            break;
        case "PickDiscardCard":
            action = PickDiscardCard;
            break;
        case "GetClosedCoinIntoPlayerHand":
            action = HeroActions_1.GetClosedCoinIntoPlayerHand;
            break;
        case "PlaceThrudAction":
            action = HeroActions_1.PlaceThrudAction;
            break;
        case "PlaceYludAction":
            action = HeroActions_1.PlaceYludAction;
            break;
        case "AddCampCardToCards":
            action = CampActions_1.AddCampCardToCards;
            break;
        case "PickHero":
            action = HeroActions_1.PickHero;
            break;
        case "AddCoinToPouchAction":
            action = CampActions_1.AddCoinToPouchAction;
            break;
        case "StartVidofnirVedrfolnirAction":
            action = CampActions_1.StartVidofnirVedrfolnirAction;
            break;
        case "UpgradeCoinVidofnirVedrfolnirAction":
            action = CampActions_1.UpgradeCoinVidofnirVedrfolnirAction;
            break;
        case "DiscardTradingCoin":
            action = CampActions_1.DiscardTradingCoin;
            break;
        case "StartDiscardSuitCard":
            action = CampActions_1.StartDiscardSuitCard;
            break;
        case "DiscardSuitCard":
            action = CampActions_1.DiscardSuitCard;
            break;
        case "DiscardAnyCardFromPlayerBoard":
            action = CampActions_1.DiscardAnyCardFromPlayerBoard;
            break;
        case "GetMjollnirProfitAction":
            action = CampActions_1.GetMjollnirProfitAction;
            break;
        case "PassEnlistmentMercenariesAction":
            action = PassEnlistmentMercenariesAction;
            break;
        case "GetEnlistmentMercenariesAction":
            action = GetEnlistmentMercenariesAction;
            break;
        case "PlaceEnlistmentMercenariesAction":
            action = PlaceEnlistmentMercenariesAction;
            break;
        default:
            action = null;
    }
    return action && action.apply(void 0, __spreadArray([G, ctx, data.config], args, false));
};
exports.ActionDispatcher = ActionDispatcher;
/**
 * <h3>Действия, связанные с улучшением монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * <li>При выборе карт улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 * @returns {*}
 * @constructor
 */
var UpgradeCoinAction = function (G, ctx, config) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    Coin_1.UpgradeCoin.apply(void 0, __spreadArray([G, ctx, config], args, false));
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Действия, связанные с отрисовкой профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
var DrawProfitAction = function (G, ctx, config) {
    var _a;
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043E\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F '").concat(config.drawName, "'."));
    var playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (playerConfig && playerConfig.stageName) {
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u041D\u0430\u0447\u0430\u043B\u043E \u0444\u0430\u0437\u044B ".concat(playerConfig.stageName, "."));
        ctx.events.setStage(playerConfig.stageName);
    }
    G.actionsNum = (_a = config.number) !== null && _a !== void 0 ? _a : 1;
    G.drawProfit = config.name;
};
/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
var AddBuffToPlayer = function (G, ctx, config) {
    if (config.buff) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u0431\u0430\u0444 '").concat(config.buff.name, "'."));
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var DiscardCardsFromPlayerBoardAction = function (G, ctx, config, suitId, cardId) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = G.publicPlayers[Number(ctx.currentPlayer)]
        .cards[suitId][cardId];
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0432 \u0441\u0431\u0440\u043E\u0441 \u043A\u0430\u0440\u0442\u0443 \n    ").concat(G.publicPlayers[Number(ctx.currentPlayer)].pickedCard.name, "."));
    G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
        .splice(cardId, 1)[0]);
    if (G.actionsNum === 2) {
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    stageName: "discardCardFromBoard",
                    drawName: "Dagda",
                    name: "DagdaAction",
                    suit: "hunter"
                }
            },
            {
                actionName: "DiscardCardsFromPlayerBoardAction",
                config: {
                    suit: "hunter"
                }
            },
        ];
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.DiscardCardsFromPlayerBoardAction = DiscardCardsFromPlayerBoardAction;
/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var DiscardCardFromTavernAction = function (G, ctx, config, cardId) {
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0432 \u0441\u0431\u0440\u043E\u0441 \u043A\u0430\u0440\u0442\u0443 \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B:"));
    (0, Card_1.DiscardCardFromTavern)(G, cardId);
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Действия, связанные с возможностью дискарда карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность дискарда карт с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string} INVALID_MOVE
 * @returns {string|*}
 * @constructor
 */
var CheckDiscardCardsFromPlayerBoardAction = function (G, ctx, config) {
    var _a;
    var cardsToDiscard = [];
    for (var i = 0; i < G.suitsNum; i++) {
        if (config.suit !== Object.keys(SuitData_1.suitsConfig)[i]) {
            var last = G.publicPlayers[Number(ctx.currentPlayer)].cards[i].length - 1;
            if (last >= 0 && G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last].type !== "герой") {
                cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last]);
            }
        }
    }
    var isValidMove = cardsToDiscard.length >= ((_a = config.number) !== null && _a !== void 0 ? _a : 1);
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceCards = function (G, ctx, config, suitId) {
    var playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants) {
        var suit = Object.keys(SuitData_1.suitsConfig)[suitId], olwinDouble = (0, Card_1.CreateCard)({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: "Olwin"
        });
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u041E\u043B\u0432\u0438\u043D \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(SuitData_1.suitsConfig[suit].suitName, "."));
        (0, Player_1.AddCardToPlayer)(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            var variants = {
                blacksmith: {
                    suit: "blacksmith",
                    rank: 1,
                    points: null
                },
                hunter: {
                    suit: "hunter",
                    rank: 1,
                    points: null
                },
                explorer: {
                    suit: "explorer",
                    rank: 1,
                    points: 0
                },
                warrior: {
                    suit: "warrior",
                    rank: 1,
                    points: 0
                },
                miner: {
                    suit: "miner",
                    rank: 1,
                    points: 0
                }
            }, stack = [
                {
                    actionName: "DrawProfitAction",
                    variants: variants,
                    config: {
                        name: "placeCards",
                        stageName: "placeCards",
                        drawName: "Olwin"
                    }
                },
                {
                    actionName: "PlaceCards",
                    variants: variants
                },
            ];
            (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
        }
        (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, olwinDouble);
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
    }
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var CheckPickDiscardCard = function (G, ctx) {
    if (G.discardCardsDeck.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Действия, связанные с взятием карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var PickDiscardCard = function (G, ctx, config, cardId) {
    var isAdded = (0, Player_1.AddCardToPlayer)(G, ctx, G.discardCardsDeck[cardId]), pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(pickedCard.name, " \u0438\u0437 \u0434\u0438\u0441\u043A\u0430\u0440\u0434\u0430."));
    if (G.actionsNum === 2 && G.discardCardsDeck.length > 0) {
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    stageName: "pickDiscardCard",
                    name: "BrisingamensAction",
                    drawName: "Brisingamens"
                }
            },
            {
                actionName: "PickDiscardCard"
            },
        ];
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
    }
    if ((0, Card_1.isCardNotAction)(pickedCard)) {
        if (isAdded) {
            (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, pickedCard);
        }
    }
    else {
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, pickedCard.stack);
    }
    var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(pickedCard.suit);
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
};
/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var PassEnlistmentMercenariesAction = function (G, ctx) {
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043F\u0430\u0441\u0430\u043D\u0443\u043B \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries."));
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var GetEnlistmentMercenariesAction = function (G, ctx, config, cardId) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter(function (card) { return card.type === "наёмник"; })[cardId];
    var pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if ((0, Camp_1.isArtefactCard)(pickedCard)) {
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries \u0432\u044B\u0431\u0440\u0430\u043B \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u0430 '").concat(pickedCard.name, "'."));
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    name: "placeEnlistmentMercenaries",
                    drawName: "Place Enlistment Mercenaries"
                }
            },
        ];
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack);
    }
};
/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var PlaceEnlistmentMercenariesAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(SuitData_1.suitsConfig)[suitId], pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if ((0, Camp_1.isArtefactCard)(pickedCard) && pickedCard.stack[0].variants) {
        var mercenaryCard = (0, Card_1.CreateCard)({
            type: "наёмник",
            suit: suit,
            rank: 1,
            points: pickedCard.stack[0].variants[suit].points,
            name: pickedCard.name,
            tier: pickedCard.tier,
            path: pickedCard.path
        });
        (0, Player_1.AddCardToPlayer)(G, ctx, mercenaryCard);
        (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries \u0437\u0430\u0432\u0435\u0440\u0431\u043E\u0432\u0430\u043B \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u0430 '").concat(mercenaryCard.name, "'."));
        var cardIndex = G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .findIndex(function (card) { return card.name === pickedCard.name; });
        G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
        if (G.publicPlayers[Number(ctx.currentPlayer)].campCards.filter(function (card) {
            return card.type === "наёмник";
        }).length) {
            var stack = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries"
                    }
                },
            ];
            (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
        }
        (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, mercenaryCard);
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], suitId);
    }
};
