"use strict";
exports.__esModule = true;
exports.AfterBasicPickCardActions = exports.CheckEndGameLastActions = void 0;
// todo Add logging
var Camp_1 = require("../Camp");
var Tavern_1 = require("../Tavern");
var Hero_1 = require("../Hero");
var Card_1 = require("../Card");
var StackHelpers_1 = require("./StackHelpers");
var HeroHelpers_1 = require("./HeroHelpers");
var CoinHelpers_1 = require("./CoinHelpers");
/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var CheckEndGameLastActions = function (G, ctx) {
    if (G.tierToEnd) {
        ctx.events.setPhase("getDistinctions");
    }
    else {
        if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
            (0, Hero_1.RemoveThrudFromPlayerBoardAfterGameEnd)(G, ctx);
        }
        var isNewPhase = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
                for (var i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.discardCardEndGame) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        var stack = [
                            {
                                actionName: "DrawProfitAction",
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: "BrisingamensEndGameAction",
                                    drawName: "Brisingamens end game"
                                }
                            },
                            {
                                playerId: G.publicPlayersOrder[0],
                                actionName: "DiscardAnyCardFromPlayerBoard"
                            },
                        ];
                        (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
                        G.drawProfit = "BrisingamensEndGameAction";
                        ctx.events.setPhase("brisingamensEndGame");
                        break;
                    }
                }
            }
            if (ctx.phase !== "getMjollnirProfit" && !isNewPhase) {
                for (var i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.getMjollnirProfit) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        var stack = [
                            {
                                actionName: "DrawProfitAction",
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: "getMjollnirProfit",
                                    drawName: "Mjollnir"
                                }
                            },
                            {
                                playerId: G.publicPlayersOrder[0],
                                actionName: "GetMjollnirProfitAction"
                            },
                        ];
                        (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
                        G.drawProfit = "getMjollnirProfit";
                        ctx.events.setPhase("getMjollnirProfit");
                        break;
                    }
                }
            }
        }
        if (!isNewPhase) {
            ctx.events.endPhase();
            ctx.events.endGame();
        }
    }
};
exports.CheckEndGameLastActions = CheckEndGameLastActions;
/**
 * <h3>Выполняет основные действия после выбора базовых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карты дворфа из таверны.</li>
 * <li>После выбора карты улучшения монеты из таверны.</li>
 * <li>После выбора карты из кэмпа.</li>
 * <li>После выбора героев.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
var AfterBasicPickCardActions = function (G, ctx, isTrading) {
    // todo rework it?
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    if (ctx.phase === "pickCards") {
        var isUlinePlaceTradingCoin = (0, HeroHelpers_1.CheckAndStartUlineActionsOrContinue)(G, ctx);
        if (isUlinePlaceTradingCoin !== "placeTradingCoinsUline" && isUlinePlaceTradingCoin !==
            "nextPlaceTradingCoinsUline") {
            var isTradingActivated = false;
            if (!isTrading) {
                isTradingActivated = (0, CoinHelpers_1.ActivateTrading)(G, ctx);
            }
            if (!isTradingActivated) {
                if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && ctx.playOrder.length <
                    Number(ctx.numPlayers)) {
                    var cardIndex = G.taverns[G.currentTavern].findIndex(function (card) { return card !== null; });
                    (0, Card_1.DiscardCardFromTavern)(G, cardIndex);
                }
                if (G.expansions.thingvellir.active && Number(ctx.currentPlayer) ===
                    Number(ctx.playOrder[ctx.playOrder.length - 1])) {
                    (0, Camp_1.DiscardCardIfCampCardPicked)(G);
                }
                var isLastTavern = G.tavernsNum - 1 === G.currentTavern, isCurrentTavernEmpty = (0, Tavern_1.CheckIfCurrentTavernEmpty)(G, ctx);
                if (isCurrentTavernEmpty && isLastTavern) {
                    AfterLastTavernEmptyActions(G, ctx);
                }
                else if (isCurrentTavernEmpty) {
                    var isPlaceCoinsUline = (0, HeroHelpers_1.CheckAndStartUlineActionsOrContinue)(G, ctx);
                    if (isPlaceCoinsUline !== "endPlaceTradingCoinsUline" && isPlaceCoinsUline !== "placeCoinsUline") {
                        ctx.events.setPhase("pickCards");
                    }
                    else {
                        ctx.events.setPhase("placeCoinsUline");
                    }
                }
                else {
                    if (ctx.currentPlayer === ctx.playOrder[0] && G.campPicked && ctx.numPlayers === 2 &&
                        G.taverns[G.currentTavern].every(function (card) { return card !== null; })) {
                        var stack = [
                            {
                                actionName: "DrawProfitAction",
                                config: {
                                    stageName: "discardCard",
                                    name: "discardCard",
                                    drawName: "Discard tavern card"
                                }
                            },
                            {
                                actionName: "DiscardCardFromTavernAction"
                            },
                        ];
                        (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
                        (0, StackHelpers_1.StartActionFromStackOrEndActions)(G, ctx, false);
                    }
                    else {
                        ctx.events.endTurn();
                    }
                }
            }
        }
    }
    else if (ctx.phase === "endTier" || ctx.phase === "brisingamensEndGame" || ctx.phase === "getMjollnirProfit") {
        (0, exports.CheckEndGameLastActions)(G, ctx);
    }
    else if (ctx.phase === "getDistinctions") {
        ctx.events.endTurn();
    }
    else if (ctx.phase === "enlistmentMercenaries") {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1) && ctx.currentPlayer ===
            ctx.playOrder[ctx.playOrder.length - 1]) || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
            && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) ||
            (ctx.playOrder[ctx.playOrder.length - 2] !== undefined && (ctx.currentPlayer ===
                ctx.playOrder[ctx.playOrder.length - 2]) &&
                !G.publicPlayers[Number(ctx.playOrder[ctx.playOrder.length - 1])].campCards
                    .filter(function (card) { return card.type === "наёмник"; }).length)) {
            StartEndTierActions(G, ctx);
        }
        else {
            var stack = [
                {
                    actionName: "DrawProfitAction",
                    playerId: Number(ctx.playOrder[ctx.playOrder.findIndex(function (playerIndex) { return playerIndex ===
                        ctx.currentPlayer; }) + 1]),
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries"
                    }
                },
            ];
            ctx.events.endTurn();
            (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
            G.drawProfit = "enlistmentMercenaries";
        }
    }
};
exports.AfterBasicPickCardActions = AfterBasicPickCardActions;
/**
 * <h3>Начало экшенов в фазе EndTier.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы EndTier.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var StartEndTierActions = function (G, ctx) {
    G.publicPlayersOrder = [];
    var ylud = false, index = -1;
    for (var i = 0; i < G.publicPlayers.length; i++) {
        index = G.publicPlayers[i].heroes.findIndex(function (hero) { return hero.name === "Ylud"; });
        if (index !== -1) {
            ylud = true;
            G.publicPlayersOrder.push(i);
        }
    }
    if (!ylud) {
        for (var i = 0; i < G.publicPlayers.length; i++) {
            for (var j = 0; j < G.suitsNum; j++) {
                index = G.publicPlayers[i].cards[j].findIndex(function (card) { return card.name === "Ylud"; });
                if (index !== -1) {
                    G.publicPlayers[Number(ctx.currentPlayer)].cards[i].splice(index, 1);
                    G.publicPlayersOrder.push(i);
                    ylud = true;
                }
            }
        }
    }
    if (ylud) {
        ctx.events.setPhase("endTier");
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
                points: 11
            },
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 7
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1
            }
        };
        var stack = [
            {
                playerId: G.publicPlayersOrder[0],
                actionName: "DrawProfitAction",
                variants: variants,
                config: {
                    stageName: "placeCards",
                    drawName: "Ylud",
                    name: "placeCard"
                }
            },
            {
                playerId: G.publicPlayersOrder[0],
                actionName: "PlaceYludAction",
                variants: variants
            },
        ];
        (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
        G.drawProfit = "placeCards";
    }
    else {
        (0, exports.CheckEndGameLastActions)(G, ctx);
    }
};
/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var CheckEnlistmentMercenaries = function (G, ctx) {
    var count = false;
    for (var i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards.filter(function (card) { return card.type === "наёмник"; }).length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = "startOrPassEnlistmentMercenaries";
        ctx.events.setPhase("enlistmentMercenaries");
    }
    else {
        StartEndTierActions(G, ctx);
    }
};
/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @todo Refill taverns only on the beginning of the round (Add phase Round?)!
 * @param G
 * @param ctx
 * @constructor
 */
var AfterLastTavernEmptyActions = function (G, ctx) {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
        if (G.expansions.thingvellir.active) {
            CheckEnlistmentMercenaries(G, ctx);
        }
        else {
            StartEndTierActions(G, ctx);
        }
    }
    else {
        if (G.expansions.thingvellir.active) {
            (0, Camp_1.RefillEmptyCampCards)(G);
        }
        (0, Tavern_1.RefillTaverns)(G);
        ctx.events.setPhase("placeCoins");
    }
};
