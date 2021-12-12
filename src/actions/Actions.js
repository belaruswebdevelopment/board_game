import { __spreadArray } from "tslib";
import { UpgradeCoin } from "../Coin";
import { INVALID_MOVE } from "boardgame.io/core";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { AddCardToPlayer } from "../Player";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { CreateCard, DiscardCardFromTavern, isCardNotAction } from "../Card";
import { AddHeroToCards, CheckAndMoveThrudOrPickHeroAction, GetClosedCoinIntoPlayerHand, PickHero, PickHeroWithConditions, PlaceThrudAction, PlaceYludAction } from "./HeroActions";
import { AddCampCardToCards, AddCoinToPouchAction, CheckPickCampCard, DiscardAnyCardFromPlayerBoard, DiscardSuitCard, DiscardTradingCoin, GetMjollnirProfitAction, StartDiscardSuitCard, StartVidofnirVedrfolnirAction, UpgradeCoinVidofnirVedrfolnirAction } from "./CampActions";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { IsStartActionStage } from "../helpers/ActionHelpers";
/**
 * <h3>Диспетчер действий при их активации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев выполняются последовательно их действия.</li>
 * <li>При выборе конкретных карт кэмпа выполняются последовательно их действия.</li>
 * <li>При выборе карт улучшения монет выполняются их действия.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IStack} data Стэк.
 * @param {string | number | boolean | object | null} args Дополнительные аргументы.
 * @constructor
 */
export var ActionDispatcher = function (G, ctx, data) {
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
            action = AddHeroToCards;
            break;
        case "AddBuffToPlayer":
            action = AddBuffToPlayer;
            break;
        case "PickHeroWithConditions":
            action = PickHeroWithConditions;
            break;
        case "CheckDiscardCardsFromPlayerBoardAction":
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardsFromPlayerBoardAction":
            action = DiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardFromTavernAction":
            action = DiscardCardFromTavernAction;
            break;
        case "PlaceCards":
            action = PlaceCards;
            break;
        case "CheckPickCampCard":
            action = CheckPickCampCard;
            break;
        case "CheckPickDiscardCard":
            action = CheckPickDiscardCard;
            break;
        case "PickDiscardCard":
            action = PickDiscardCard;
            break;
        case "GetClosedCoinIntoPlayerHand":
            action = GetClosedCoinIntoPlayerHand;
            break;
        case "PlaceThrudAction":
            action = PlaceThrudAction;
            break;
        case "PlaceYludAction":
            action = PlaceYludAction;
            break;
        case "AddCampCardToCards":
            action = AddCampCardToCards;
            break;
        case "PickHero":
            action = PickHero;
            break;
        case "AddCoinToPouchAction":
            action = AddCoinToPouchAction;
            break;
        case "StartVidofnirVedrfolnirAction":
            action = StartVidofnirVedrfolnirAction;
            break;
        case "UpgradeCoinVidofnirVedrfolnirAction":
            action = UpgradeCoinVidofnirVedrfolnirAction;
            break;
        case "DiscardTradingCoin":
            action = DiscardTradingCoin;
            break;
        case "StartDiscardSuitCard":
            action = StartDiscardSuitCard;
            break;
        case "DiscardSuitCard":
            action = DiscardSuitCard;
            break;
        case "DiscardAnyCardFromPlayerBoard":
            action = DiscardAnyCardFromPlayerBoard;
            break;
        case "GetMjollnirProfitAction":
            action = GetMjollnirProfitAction;
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
    action === null || action === void 0 ? void 0 : action.apply(void 0, __spreadArray([G, ctx, data.config], args, false));
};
/**
 * <h3>Действия, связанные с улучшением монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * <li>При выборе карт улучшающих монеты.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя или карты улучшающей монеты.
 * @param {string | number | boolean | object | null} args Дополнительные аргументы.
 * @constructor
 */
var UpgradeCoinAction = function (G, ctx, config) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    UpgradeCoin.apply(void 0, __spreadArray([G, ctx, config], args, false));
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с отрисовкой профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @constructor
 */
var DrawProfitAction = function (G, ctx, config) {
    var _a;
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043E\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F '").concat(config.drawName, "'."));
    IsStartActionStage(G, ctx, config);
    G.actionsNum = (_a = config.number) !== null && _a !== void 0 ? _a : 1;
    if (config.name !== undefined) {
        G.drawProfit = config.name;
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не найден обязательный параметр 'config.name'.");
    }
};
/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @constructor
 */
var AddBuffToPlayer = function (G, ctx, config) {
    if (config.buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u0431\u0430\u0444 '").concat(config.buff.name, "'."));
        EndActionFromStackAndAddNew(G, ctx);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не найден обязательный параметр 'config.buff'.");
    }
};
/**
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} suitId Id фракции.
 * @param {number} cardId Id карты.
 * @constructor
 */
export var DiscardCardsFromPlayerBoardAction = function (G, ctx, config, suitId, cardId) {
    var pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId][cardId];
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0432 \u0441\u0431\u0440\u043E\u0441 \u043A\u0430\u0440\u0442\u0443 ").concat(pickedCard.name, "."));
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
                    suit: SuitNames.HUNTER,
                },
            },
            {
                actionName: "DiscardCardsFromPlayerBoardAction",
                config: {
                    suit: SuitNames.HUNTER,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} cardId Id карты.
 * @constructor
 */
var DiscardCardFromTavernAction = function (G, ctx, config, cardId) {
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0432 \u0441\u0431\u0440\u043E\u0441 \u043A\u0430\u0440\u0442\u0443 \u0438\u0437 \u0442\u0430\u0432\u0435\u0440\u043D\u044B:"));
    DiscardCardFromTavern(G, cardId);
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с возможностью дискарда карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность дискарда карт с планшета игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @returns {string | void}
 * @constructor
 */
var CheckDiscardCardsFromPlayerBoardAction = function (G, ctx, config) {
    var _a;
    var cardsToDiscard = [];
    for (var i = 0; i < G.suitsNum; i++) {
        if (config.suit !== Object.keys(suitsConfig)[i]) {
            var last = G.publicPlayers[Number(ctx.currentPlayer)].cards[i].length - 1;
            if (last >= 0 && G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last].type !== "герой") {
                cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last]);
            }
        }
    }
    var isValidMove = cardsToDiscard.length >= ((_a = config.number) !== null && _a !== void 0 ? _a : 1);
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} suitId Id фракции.
 * @constructor
 */
var PlaceCards = function (G, ctx, config, suitId) {
    var playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        var suit = Object.keys(suitsConfig)[suitId], olwinDouble = CreateCard({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: "Olwin",
        });
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u041E\u043B\u0432\u0438\u043D \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[suit].suitName, "."));
        AddCardToPlayer(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            var variants = {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            }, stack = [
                {
                    actionName: "DrawProfitAction",
                    variants: variants,
                    config: {
                        name: "placeCards",
                        stageName: "placeCards",
                        drawName: "Olwin",
                    },
                },
                {
                    actionName: "PlaceCards",
                    variants: variants,
                },
            ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не найден обязательный параметр 'stack[0].variants'.");
    }
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
var CheckPickDiscardCard = function (G, ctx) {
    if (G.discardCardsDeck.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с взятием карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} cardId Id карты.
 * @constructor
 */
var PickDiscardCard = function (G, ctx, config, cardId) {
    var isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]), pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    var suitId = null;
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(pickedCard.name, " \u0438\u0437 \u0434\u0438\u0441\u043A\u0430\u0440\u0434\u0430."));
    if (G.actionsNum === 2 && G.discardCardsDeck.length > 0) {
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    stageName: "pickDiscardCard",
                    name: "BrisingamensAction",
                    drawName: "Brisingamens",
                },
            },
            {
                actionName: "PickDiscardCard",
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suitId = GetSuitIndexByName(pickedCard.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0430\u044F \u0444\u0440\u0430\u043A\u0446\u0438\u044F \n                ".concat(pickedCard.suit, "."));
            }
        }
    }
    else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
var PassEnlistmentMercenariesAction = function (G, ctx) {
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043F\u0430\u0441\u0430\u043D\u0443\u043B \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries."));
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} cardId Id карты.
 * @constructor
 */
var GetEnlistmentMercenariesAction = function (G, ctx, config, cardId) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter(function (card) { return card.type === "наёмник"; })[cardId];
    var pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries \u0432\u044B\u0431\u0440\u0430\u043B \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u0430 '").concat(pickedCard.name, "'."));
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    name: "placeEnlistmentMercenaries",
                    drawName: "Place Enlistment Mercenaries",
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не пикнута карта наёмника.");
    }
};
/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} suitId Id фракции.
 * @constructor
 */
var PlaceEnlistmentMercenariesAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(suitsConfig)[suitId], pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if ("stack" in pickedCard && "tier" in pickedCard && "path" in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                var mercenaryCard = CreateCard({
                    type: "наёмник",
                    suit: suit,
                    rank: 1,
                    points: pickedCard.stack[0].variants[suit].points,
                    name: pickedCard.name,
                    tier: pickedCard.tier,
                    path: pickedCard.path,
                });
                AddCardToPlayer(G, ctx, mercenaryCard);
                AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A \n                ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0444\u0430\u0437\u044B Enlistment Mercenaries \n                \u0437\u0430\u0432\u0435\u0440\u0431\u043E\u0432\u0430\u043B \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u0430 '").concat(mercenaryCard.name, "'."));
                var cardIndex = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .findIndex(function (card) { return card.name === pickedCard.name; });
                G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
                if (G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter(function (card) { return card.type === "наёмник"; }).length) {
                    var stack = [
                        {
                            actionName: "DrawProfitAction",
                            config: {
                                name: "enlistmentMercenaries",
                                drawName: "Enlistment Mercenaries",
                            },
                        },
                    ];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                EndActionFromStackAndAddNew(G, ctx, [], suitId);
            }
            else {
                AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 \n                'stack[0].variants'.");
            }
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Вместо карты наёмника пикнута карта другого типа.");
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не пикнута карта наёмника.");
    }
};
