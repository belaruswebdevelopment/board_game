import { __spreadArray } from "tslib";
import { CompareCards, EvaluateCard, isCardNotAction } from "./Card";
import { HasLowestPriority } from "./Priority";
import { CheckHeuristicsForCoinsPlacement } from "./BotConfig";
import { CurrentScoring } from "./Score";
import { moveBy, moveValidators } from "./MoveValidator";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddCoinToPouchProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./helpers/ProfitHelpers";
/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {IMoves[]} Массив возможных мувов у ботов.
 */
export var enumerate = function (G, ctx) {
    //make false for standard bot
    var enableAdvancedBot = true, uniqueArr = [];
    var moves = [], flag = true, advancedString = "advanced", isAdvancedExist = Object.keys(moveBy[ctx.phase]).some(function (key) { return key.includes(advancedString); });
    var activeStageOfCurrentPlayer = (ctx.activePlayers
        && ctx.activePlayers[Number(ctx.currentPlayer)]) ? ctx.activePlayers[Number(ctx.currentPlayer)] :
        "default";
    // todo Fix it, now just for bot can do RANDOM move
    var botMoveArguments = [];
    for (var stage in moveBy[ctx.phase]) {
        if (moveBy[ctx.phase].hasOwnProperty(stage)) {
            if (ctx.phase === "pickCards" && stage.startsWith("default")) {
                continue;
            }
            if (stage.includes(activeStageOfCurrentPlayer)
                && (!isAdvancedExist || stage.includes(advancedString) === enableAdvancedBot)) {
                // todo Sync players and bots validations in one places
                var moveName = moveBy[ctx.phase][stage], _a = moveValidators[moveName].getRange({ G: G, ctx: ctx }), minValue = _a[0], maxValue = _a[1], hasGetValue = moveValidators[moveName].hasOwnProperty("getValue");
                var argValue = void 0;
                var argArray = void 0;
                for (var id = minValue; id < maxValue; id++) {
                    // todo sync bot moves options with profit UI options for players (same logic without UI)
                    var type = undefined;
                    if (stage === "upgradeCoin") {
                        // todo fix for Uline
                        type = "board";
                    }
                    if (!moveValidators[moveName].validate({ G: G, ctx: ctx, id: id, type: type })) {
                        continue;
                    }
                    if (hasGetValue) {
                        argArray = moveValidators[moveName].getValue({ G: G, ctx: ctx, id: id });
                        moves.push({ move: moveName, args: [argArray] });
                    }
                    else {
                        argValue = id;
                        moves.push({ move: moveName, args: [argValue] });
                    }
                }
            }
        }
    }
    if (moves.length > 0) {
        return moves;
    }
    if (ctx.phase === "pickCards" && activeStageOfCurrentPlayer === "default") {
        // todo Fix it, now just for bot can do RANDOM move
        var pickCardOrCampCard = "card";
        if (G.expansions.thingvellir.active
            && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
                || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)))) {
            pickCardOrCampCard = Math.floor(Math.random() * 2) ? "card" : "camp";
        }
        if (pickCardOrCampCard === "card") {
            var tavern_1 = G.taverns[G.currentTavern];
            var _loop_1 = function (i) {
                var tavernCard = tavern_1[i];
                if (tavernCard === null) {
                    return "continue";
                }
                if (tavern_1.some(function (card) { return CompareCards(tavernCard, card) < 0; })) {
                    return "continue";
                }
                var isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, i, tavern_1) < 0, isExistCardNotWorse = tavern_1.some(function (card) { return (card !== null) &&
                    (EvaluateCard(G, ctx, tavernCard, i, tavern_1) >= 0); });
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    return "continue";
                }
                var uniqueArrLength = uniqueArr.length;
                for (var j = 0; j < uniqueArrLength; j++) {
                    var uniqueCard = uniqueArr[j];
                    if (isCardNotAction(tavernCard) && isCardNotAction(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    moves.push({ move: "ClickCard", args: [i] });
                }
                flag = true;
            };
            for (var i = 0; i < tavern_1.length; i++) {
                _loop_1(i);
            }
        }
        else {
            for (var j = 0; j < G.campNum; j++) {
                if (G.camp[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "ClickCampCard",
                args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
            });
        }
    }
    if (enableAdvancedBot && ctx.phase === "placeCoins") {
        moves = [];
        var hasLowestPriority = HasLowestPriority(G, Number(ctx.currentPlayer));
        var resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
        if (hasLowestPriority) {
            resultsForCoins = resultsForCoins.map(function (num, index) {
                return index === 0 ? num - 20 : num;
            });
        }
        var minResultForCoins = Math.min.apply(Math, resultsForCoins), maxResultForCoins = Math.max.apply(Math, resultsForCoins), tradingProfit = G.decks[G.decks.length - 1].length > 9 ? 1 : 0;
        var _b = [-1, -1], positionForMinCoin = _b[0], positionForMaxCoin = _b[1];
        if (minResultForCoins <= 0) {
            positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
        }
        if (maxResultForCoins >= 0) {
            positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
        }
        var allCoinsOrder = G.botData.allCoinsOrder, handCoins_1 = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
        var _loop_2 = function (i) {
            var hasTrading = allCoinsOrder[i].some(function (coinId) { var _a; return Boolean((_a = handCoins_1[coinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading); });
            if (tradingProfit < 0) {
                if (hasTrading) {
                    return "continue";
                }
                moves.push({ move: "BotsPlaceAllCoins", args: [allCoinsOrder[i]] });
            }
            else if (tradingProfit > 0) {
                if (!hasTrading) {
                    return "continue";
                }
                var hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, maxCoin_1 = handCoins_1[allCoinsOrder[i][positionForMaxCoin]], minCoin_1 = handCoins_1[allCoinsOrder[i][positionForMinCoin]];
                if (maxCoin_1 && minCoin_1) {
                    var isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                    if (hasPositionForMaxCoin) {
                        isTopCoinsOnPosition =
                            allCoinsOrder[i].filter(function (coinIndex) {
                                return handCoins_1[coinIndex] !== null
                                    && handCoins_1[coinIndex].value > maxCoin_1.value;
                            }).length <= 1;
                    }
                    if (hasPositionForMinCoin) {
                        isMinCoinsOnPosition =
                            handCoins_1.filter(function (coin) {
                                return coin !== null && coin.value < minCoin_1.value;
                            }).length <= 1;
                    }
                    if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                        moves.push({ move: "BotsPlaceAllCoins", args: [G.botData.allCoinsOrder[i]] });
                        //console.log("#" + i.toString().padStart(2) + ":     " + allCoinsOrder[i].map(item => handCoins[item].value));
                    }
                }
            }
            else {
                moves.push({ move: "BotsPlaceAllCoins", args: [allCoinsOrder[i]] });
            }
        };
        for (var i = 0; i < allCoinsOrder.length; i++) {
            _loop_2(i);
        }
        //console.log(moves);
    }
    // todo Fix it, now just for bot can do RANDOM move
    if (activeStageOfCurrentPlayer === "placeCards" || ctx.phase === "endTier") {
        PlaceCardsProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "PlaceCard",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (ctx.phase === "getMjollnirProfit") {
        var totalSuitsRanks = [];
        GetMjollnirProfitProfit(G, ctx, totalSuitsRanks);
        botMoveArguments.push([totalSuitsRanks.indexOf(Math.max.apply(Math, totalSuitsRanks))]);
        moves.push({
            move: "GetMjollnirProfit",
            args: __spreadArray([], botMoveArguments[0], true),
        });
    }
    if (ctx.phase === "brisingamensEndGame") {
        for (var i = 0;; i++) {
            var isDrawRow = false;
            for (var j = 0; j < G.suitsNum; j++) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j] !== undefined &&
                    G.publicPlayers[Number(ctx.currentPlayer)].cards[j][i] !== undefined) {
                    isDrawRow = true;
                    if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j][i].type !== "герой") {
                        botMoveArguments.push([j, i]);
                    }
                }
            }
            if (!isDrawRow) {
                break;
            }
        }
        moves.push({
            move: "DiscardCardFromPlayerBoard",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (ctx.phase === "enlistmentMercenaries") {
        if (G.drawProfit === "startOrPassEnlistmentMercenaries") {
            StartEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            if (Math.floor(Math.random() * botMoveArguments.length) === 0) {
                moves.push({ move: "StartEnlistmentMercenaries", args: [] });
            }
            else {
                moves.push({ move: "PassEnlistmentMercenaries", args: [] });
            }
        }
        else if (G.drawProfit === "enlistmentMercenaries") {
            GetEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: "GetEnlistmentMercenaries",
                args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
            });
        }
        else if (G.drawProfit === "placeEnlistmentMercenaries") {
            PlaceEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: "PlaceEnlistmentMercenaries",
                args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
            });
        }
    }
    if (ctx.phase === "placeCoinsUline") {
        for (var j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: "ClickHandCoin",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
        moves.push({ move: "ClickBoardCoin", args: [G.currentTavern + 1] });
    }
    if (activeStageOfCurrentPlayer === "placeTradingCoinsUline") {
        for (var j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: "ClickHandCoin",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
        if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.tavernsNum]) {
            moves.push({ move: "ClickBoardCoin", args: [G.tavernsNum + 1] });
        }
        else {
            moves.push({ move: "ClickBoardCoin", args: [G.tavernsNum] });
        }
    }
    if (activeStageOfCurrentPlayer === "addCoinToPouch") {
        AddCoinToPouchProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "AddCoinToPouch",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (activeStageOfCurrentPlayer === "upgradeCoinVidofnirVedrfolnir") {
        UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "UpgradeCoinVidofnirVedrfolnir",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (activeStageOfCurrentPlayer === "discardSuitCard") {
        // todo Bot can't do async turns...?
        var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
        if (config !== undefined && config.suit !== undefined) {
            var suitId = GetSuitIndexByName(config.suit);
            for (var p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    if (ctx.playerID !== undefined && Number(ctx.playerID) === p) {
                        for (var i = 0; i < G.publicPlayers[p].cards[suitId].length; i++) {
                            for (var j = 0; j < 1; j++) {
                                if (G.publicPlayers[p].cards[suitId] !== undefined
                                    && G.publicPlayers[p].cards[suitId][i] !== undefined) {
                                    if (G.publicPlayers[p].cards[suitId][i].type !== "герой") {
                                        var points = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId][i].points;
                                        if (points !== null) {
                                            botMoveArguments.push([points]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var minValue_1 = Math.min.apply(Math, botMoveArguments);
            moves.push({
                move: "DiscardSuitCardFromPlayerBoard",
                args: [suitId, G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                        .findIndex(function (card) {
                        return card.type !== "герой" && card.points === minValue_1;
                    })],
            });
        }
    }
    if (activeStageOfCurrentPlayer === "discardCardFromBoard") {
        DiscardCardFromBoardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "DiscardCard",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (activeStageOfCurrentPlayer === "pickDiscardCard") {
        PickDiscardCardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "PickDiscardCard",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (ctx.numPlayers === 2) {
        if (activeStageOfCurrentPlayer === "discardCard") {
            DiscardCardProfit(G, ctx, botMoveArguments);
            moves.push({
                move: "DiscardCard2Players",
                args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
            });
        }
    }
    if (activeStageOfCurrentPlayer === "pickCampCardHolda") {
        PickCampCardHoldaProfit(G, ctx, botMoveArguments);
        moves.push({
            move: "ClickCampCardHolda",
            args: __spreadArray([], botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)], true),
        });
    }
    if (moves.length === 0) {
        // todo Fix for bot no moves if have artefact with not pick new hero and get artifact with get new hero (he can pick hero by it's action)
        console.log("ALERT: bot has " + moves.length + " moves. Phase: " + ctx.phase);
    }
    return moves;
};
/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @returns {{isEarlyGame: {weight: number, checker: (G: MyGameState) => boolean}, isFirst: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}, isStronger: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}}}
 */
export var objectives = function () { return ({
    isEarlyGame: {
        checker: function (G) {
            return G.decks[0].length > 0;
        },
        weight: -100.0,
    },
    /*isWeaker: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== "placeCoins") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    },*/
    /*isSecond: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== "placeCoins") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    },*/
    /*isEqual: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== "placeCoins") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;

        },
        weight: 0.1,
    },*/
    isFirst: {
        checker: function (G, ctx) {
            if (ctx.phase !== "pickCards") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some(function (card) { return card === null; })) {
                return false;
            }
            var totalScore = [];
            for (var i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            var _a = totalScore.sort(function (a, b) { return b - a; }).slice(0, 2), top1 = _a[0], top2 = _a[1];
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: function (G, ctx) {
            if (ctx.phase !== "pickCards") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some(function (card) { return card === null; })) {
                return false;
            }
            var totalScore = [];
            for (var i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            var _a = totalScore.sort(function (a, b) { return b - a; }).slice(0, 2), top1 = _a[0], top2 = _a[1];
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.10 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
}); };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {number}
 */
export var iterations = function (G, ctx) {
    var maxIter = G.botData.maxIter;
    if (ctx.phase === "pickCards") {
        var currentTavern = G.taverns[G.currentTavern];
        if (currentTavern.filter(function (card) { return card !== null; }).length === 1) {
            return 1;
        }
        var cardIndex = currentTavern.findIndex(function (card) { return card !== null; }), tavernCard_1 = currentTavern[cardIndex];
        if (currentTavern.every(function (card) {
            return card === null || (isCardNotAction(card) && tavernCard_1 !== null && isCardNotAction(tavernCard_1)
                && card.suit === tavernCard_1.suit && CompareCards(card, tavernCard_1) === 0);
        })) {
            return 1;
        }
        var efficientMovesCount = 0;
        var _loop_3 = function (i) {
            var tavernCard_2 = currentTavern[i];
            if (tavernCard_2 === null) {
                return "continue";
            }
            if (currentTavern.some(function (card) {
                return CompareCards(tavernCard_2, card) === -1;
            })) {
                return "continue";
            }
            if (G.decks[0].length > 18) {
                if (tavernCard_2 && isCardNotAction(tavernCard_2)) {
                    var curSuit_1 = GetSuitIndexByName(tavernCard_2.suit);
                    if (CompareCards(tavernCard_2, G.averageCards[curSuit_1]) === -1
                        && currentTavern.some(function (card) { return card !== null
                            && CompareCards(card, G.averageCards[curSuit_1]) > -1; })) {
                        return "continue";
                    }
                }
            }
            efficientMovesCount++;
            if (efficientMovesCount > 1) {
                return { value: maxIter };
            }
        };
        for (var i = 0; i < currentTavern.length; i++) {
            var state_1 = _loop_3(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        if (efficientMovesCount === 1) {
            return 1;
        }
    }
    return maxIter;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {number}
 */
export var playoutDepth = function (G, ctx) {
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 2;
};
