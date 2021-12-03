"use strict";
exports.__esModule = true;
exports.GetMjollnirProfitAction = exports.DiscardSuitCard = exports.StartDiscardSuitCard = exports.DiscardAnyCardFromPlayerBoard = exports.DiscardTradingCoin = exports.UpgradeCoinVidofnirVedrfolnirAction = exports.StartVidofnirVedrfolnirAction = exports.AddCoinToPouchAction = exports.AddCampCardToCards = exports.CheckPickCampCard = void 0;
var StackHelpers_1 = require("../helpers/StackHelpers");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var Player_1 = require("../Player");
var HeroActions_1 = require("./HeroActions");
var Logging_1 = require("../Logging");
var SuitData_1 = require("../data/SuitData");
var Camp_1 = require("../Camp");
/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var CheckPickCampCard = function (G, ctx) {
    if (G.camp.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.CheckPickCampCard = CheckPickCampCard;
/**
 * <h3>Действия, связанные с добавлением карт кэмпа в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var AddCampCardToCards = function (G, ctx, config, cardId) {
    if (ctx.phase === "pickCards" && Number(ctx.currentPlayer) === G.publicPlayersOrder[0] &&
        ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    var campCard = G.camp[cardId];
    var suitId = null, stack = [];
    G.camp[cardId] = null;
    if (campCard) {
        if ((0, Camp_1.isArtefactCard)(campCard) && campCard.suit) {
            (0, Player_1.AddCampCardToPlayerCards)(G, ctx, campCard);
            (0, HeroActions_1.CheckAndMoveThrudOrPickHeroAction)(G, ctx, campCard);
            suitId = (0, SuitHelpers_1.GetSuitIndexByName)(campCard.suit);
        }
        else {
            (0, Player_1.AddCampCardToPlayer)(G, ctx, campCard);
            if (ctx.phase === "enlistmentMercenaries" && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                .filter(function (card) { return card.type === "наёмник"; }).length) {
                stack = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "enlistmentMercenaries",
                            drawName: "Enlistment Mercenaries"
                        }
                    },
                ];
            }
        }
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, stack, suitId);
    }
};
exports.AddCampCardToCards = AddCampCardToCards;
/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param coinId Id монеты.
 * @constructor
 */
var AddCoinToPouchAction = function (G, ctx, config, coinId) {
    var player = G.publicPlayers[Number(ctx.currentPlayer)], tempId = player.boardCoins.findIndex(function (coin, index) { return index >= G.tavernsNum
        && coin === null; }), stack = [
        {
            actionName: "StartVidofnirVedrfolnirAction"
        },
    ];
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043F\u043E\u043B\u043E\u0436\u0438\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '").concat(player.boardCoins[tempId], "' \u0432 \u0441\u0432\u043E\u0439 \u043A\u043E\u0448\u0435\u043B\u0451\u043A."));
    (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.AddCoinToPouchAction = AddCoinToPouchAction;
/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var StartVidofnirVedrfolnirAction = function (G, ctx) {
    var _a;
    var number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .filter(function (coin, index) { return index >= G.tavernsNum && coin === null; }).length, handCoinsNumber = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && number > 0 && handCoinsNumber) {
        var stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    name: "AddCoinToPouchVidofnirVedrfolnir",
                    stageName: "addCoinToPouch",
                    number: number,
                    drawName: "Add coin to pouch Vidofnir Vedrfolnir"
                }
            },
            {
                actionName: "AddCoinToPouchAction"
            },
        ];
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
    }
    else {
        var coinsValue = 0, stack = [];
        for (var j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        value: 5,
                        drawName: "Upgrade coin Vidofnir Vedrfolnir"
                    }
                },
                {
                    actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                    config: {
                        value: 5
                    }
                },
            ];
        }
        else if (coinsValue === 2) {
            stack = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        number: 2,
                        value: 3,
                        drawName: "Upgrade coin Vidofnir Vedrfolnir"
                    }
                },
                {
                    actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                    config: {
                        value: 3
                    }
                },
            ];
        }
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.StartVidofnirVedrfolnirAction = StartVidofnirVedrfolnirAction;
/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 * @returns {*}
 * @constructor
 */
var UpgradeCoinVidofnirVedrfolnirAction = function (G, ctx, config, coinId, type, isInitial) {
    var playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    var stack = [];
    if (playerConfig) {
        if (playerConfig.value === 3) {
            stack = [
                {
                    actionName: "UpgradeCoinAction",
                    config: {
                        value: 3
                    }
                },
                {
                    actionName: "DrawProfitAction",
                    config: {
                        coinId: coinId,
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        value: 2,
                        drawName: "Upgrade coin Vidofnir Vedrfolnir"
                    }
                },
                {
                    actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                    config: {
                        value: 2
                    }
                },
            ];
        }
        else if (playerConfig.value === 2) {
            stack = [
                {
                    actionName: "UpgradeCoinAction",
                    config: {
                        value: 2
                    }
                },
            ];
        }
        else if (playerConfig.value === 5) {
            stack = [
                {
                    actionName: "UpgradeCoinAction",
                    config: {
                        value: 5
                    }
                },
            ];
        }
        (0, StackHelpers_1.AddActionsToStackAfterCurrent)(G, ctx, stack);
        (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], coinId, type, isInitial);
    }
};
exports.UpgradeCoinVidofnirVedrfolnirAction = UpgradeCoinVidofnirVedrfolnirAction;
/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
var DiscardTradingCoin = function (G, ctx) {
    var tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex(function (coin) { return coin && coin.isTriggerTrading; });
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex(function (coin) { return coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading; });
        G.publicPlayers[Number(ctx.currentPlayer)].handCoins.splice(tradingCoinIndex, 1, null);
    }
    else {
        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0441\u0431\u0440\u043E\u0441\u0438\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u044E\u0449\u0443\u044E \u043E\u0431\u043C\u0435\u043D."));
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.DiscardTradingCoin = DiscardTradingCoin;
/**
 * <h3>Действия, связанные со сбросом любой указанной карты со стола игрока в дискард.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
var DiscardAnyCardFromPlayerBoard = function (G, ctx, config, suitId, cardId) {
    var discardedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
        .splice(cardId, 1)[0];
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0441\u0431\u0440\u043E\u0441\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(discardedCard.name, " \u0432 \u0434\u0438\u0441\u043A\u0430\u0440\u0434."));
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame;
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.DiscardAnyCardFromPlayerBoard = DiscardAnyCardFromPlayerBoard;
/**
 * <h3>Старт действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config
 * @constructor
 */
var StartDiscardSuitCard = function (G, ctx, config) {
    if (config.suit) {
        var suitId = (0, SuitHelpers_1.GetSuitIndexByName)(config.suit), value = {};
        for (var i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[suitId].length) {
                value[i] = {
                    stage: "discardSuitCard"
                };
                var stack = [
                    {
                        actionName: "DiscardSuitCard",
                        playerId: i,
                        config: {
                            suit: "warrior"
                        }
                    },
                ];
                (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
            }
        }
        ctx.events.setActivePlayers({
            value: value
        });
        G.drawProfit = "HofudAction";
    }
};
exports.StartDiscardSuitCard = StartDiscardSuitCard;
/**
 * <h3>Действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для дискарда по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns {*}
 * @constructor
 */
var DiscardSuitCard = function (G, ctx, config, suitId, playerId, cardId) {
    var discardedCard = G.publicPlayers[+ctx.playerID].cards[suitId]
        .splice(cardId, 1)[0];
    G.discardCardsDeck.push(discardedCard);
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[+ctx.playerID].nickname, " \u0441\u0431\u0440\u043E\u0441\u0438\u043B \n    \u043A\u0430\u0440\u0442\u0443 ").concat(discardedCard.name, " \u0432 \u0434\u0438\u0441\u043A\u0430\u0440\u0434."));
    (0, StackHelpers_1.EndActionForChosenPlayer)(G, ctx, playerId);
};
exports.DiscardSuitCard = DiscardSuitCard;
/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
var GetMjollnirProfitAction = function (G, ctx, config, suitId) {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suitId;
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0432\u044B\u0431\u0440\u0430\u043B \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(Object.values(SuitData_1.suitsConfig)[suitId].suitName, " \u0434\u043B\u044F \u044D\u0444\u0444\u0435\u043A\u0442\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u0430 Mjollnir."));
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx);
};
exports.GetMjollnirProfitAction = GetMjollnirProfitAction;
