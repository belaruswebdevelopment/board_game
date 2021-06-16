import {CompareCards, EvaluateCard} from "./Card";
import {HasLowestPriority} from "./Priority";
import {CheckHeuristicsForCoinsPlacement} from "./BotConfig";
import {CurrentScoring} from "./Score";
import {moveValidators, moveBy} from "./MoveValidator";

/**
 * Возвращает массив возможных ходов для ботов.
 * Применения:
 * 1) Используется ботами для доступных ходов.
 *
 * @param G
 * @param ctx
 * @returns {*[]} Массив возможных ходов для ботов.
 */
export const enumerate = (G, ctx) => {
    //make false for standard bot
    const enableAdvancedBot = true,
        uniqueArr = [];
    let moves = [],
        flag = true,
        advancedString = "advanced",
        isAdvancedExist = Object.keys(moveBy[ctx.phase]).some(key => key.includes(advancedString));
    const activeStageOfCurrentPlayer = ctx.activePlayers?.[ctx.currentPlayer] ?? "default";
    for (const stage in moveBy[ctx.phase]) {
        if (moveBy[ctx.phase].hasOwnProperty(stage)) {
            if (ctx.phase === "pickCards" && stage.startsWith("default")) {
                continue;
            }
            if (stage.includes(activeStageOfCurrentPlayer) && (!isAdvancedExist || stage.includes(advancedString) === enableAdvancedBot)) {
                const moveName = moveBy[ctx.phase][stage],
                    [minValue, maxValue] = moveValidators[moveName].getRange({G: G, ctx: ctx}),
                    hasGetValue = moveValidators[moveName].hasOwnProperty("getValue");
                let argValue;
                for (let i = minValue; i < maxValue; i++) {
                    if (!moveValidators[moveName].validate({G: G, ctx: ctx, id: i})) {
                        continue;
                    }
                    if (hasGetValue) {
                        argValue = moveValidators[moveName].getValue({G: G, ctx: ctx, id: i});
                    } else {
                        argValue = i;
                    }
                    moves.push({move: moveName, args: [argValue]});
                }
            }
        }
    }
    if (moves.length > 0) {
        return moves;
    }
    if (ctx.phase === "pickCards" && activeStageOfCurrentPlayer === "default") {
        const tavern = G.taverns[G.currentTavern];
        for (let i = 0; i < tavern.length; i++) {
            if (tavern[i] === null) {
                continue;
            }
            if (tavern.some(card => CompareCards(tavern[i], card) < 0)) {
                continue;
            }
            const isCurrentCardWorse = EvaluateCard(G, ctx, tavern[i], i, tavern) < 0,
                isExistCardNotWorse = tavern.some(card => (card !== null) &&
                    (EvaluateCard(G, ctx, tavern[i], i, tavern) >= 0));
            if (isCurrentCardWorse && isExistCardNotWorse) {
                continue;
            }
            const uniqueArrLength = uniqueArr.length;
            for (let j = 0; j < uniqueArrLength; j++) {
                if (tavern[i].suit === uniqueArr[j].suit && CompareCards(tavern[i], uniqueArr[j]) === 0) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                uniqueArr.push(tavern[i]);
                moves.push({move: "ClickCard", args: [i]});
            }
            flag = true;
        }
    }
    if (enableAdvancedBot && ctx.phase === "placeCoins") {
        moves = [];
        const hasLowestPriority = HasLowestPriority(G, ctx.currentPlayer);
        let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
        if (hasLowestPriority) {
            resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
        }
        const minResultForCoins = Math.min(...resultsForCoins),
            maxResultForCoins = Math.max(...resultsForCoins),
            tradingProfit = G.decks[G.decks.length - 1].length > 9 ? 1 : 0;
        let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
        if (minResultForCoins <= 0) {
            positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
        }
        if (maxResultForCoins >= 0) {
            positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
        }
        const allCoinsOrder = G.botData.allCoinsOrder,
            handCoins = G.players[ctx.currentPlayer].handCoins;
        for (let i = 0; i < allCoinsOrder.length; i++) {
            const hasTrading = allCoinsOrder[i].some(coinId => handCoins[coinId].isTriggerTrading);
            if (tradingProfit < 0) {
                if (hasTrading) {
                    continue;
                }
                moves.push({move: "BotsPlaceAllCoins", args: [allCoinsOrder[i]]});
            } else if (tradingProfit > 0) {
                if (!hasTrading) {
                    continue;
                }
                const hasPositionForMaxCoin = positionForMaxCoin !== -1,
                    hasPositionForMinCoin = positionForMinCoin !== -1;
                let isTopCoinsOnPosition = false,
                    isMinCoinsOnPosition = false;
                if (hasPositionForMaxCoin) {
                    isTopCoinsOnPosition = allCoinsOrder[i].filter(item => handCoins[item].value >
                        handCoins[allCoinsOrder[i][positionForMaxCoin]].value).length <= 1;
                }
                if (hasPositionForMinCoin) {
                    isMinCoinsOnPosition = handCoins.filter(item => item.value < handCoins[allCoinsOrder[i][positionForMinCoin]].value).length <= 1;
                }
                if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                    moves.push({move: "BotsPlaceAllCoins", args: [G.botData.allCoinsOrder[i]]});
                    //console.log("#" + i.toString().padStart(2) + ":     " + allCoinsOrder[i].map(item => handCoins[item].value));
                }
            } else {
                moves.push({move: "BotsPlaceAllCoins", args: [allCoinsOrder[i]]});
            }
        }
        //console.log(moves);
    }
    if (moves.length === 0) {
        console.log("ALERT: bot has " + moves.length + " moves. Phase: " + ctx.phase);
    }
    return moves;
};

/**
 * Возвращает цели игры для ботов.
 * Применения:
 * 1) Используется ботами для определения целей.
 *
 * @returns {{isEarlyGame: {weight: number, checker: (function(*): boolean)}, isFirst: {weight: number, checker: ((function(*, *): boolean)|*)}, isStronger: {weight: number, checker: ((function(*, *): boolean)|*)}}} Цели игры для ботов.
 */
export const objectives = () => ({
    isEarlyGame: {
        checker: (G) => {
            return G.decks[0].length > 0;
        },
        weight: -100.0,
    },
    /*isWeaker: {
        checker: (G, ctx) => {
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
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[ctx.currentPlayer] < top2 && top2 < top1) {
                return totalScore[ctx.currentPlayer] >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    },*/
    /*isSecond: {
        checker: (G, ctx) => {
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
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[ctx.currentPlayer] === top2 && top2 < top1) {
                return totalScore[ctx.currentPlayer] >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    },*/
    /*isEqual: {
        checker: (G, ctx) => {
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
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[ctx.currentPlayer] < top2 && top2 === top1) {
                return totalScore[ctx.currentPlayer] >= Math.floor(0.90 * top1);
            }
            return false;

        },
        weight: 0.1,
    },*/
    isFirst: {
        checker: (G, ctx) => {
            if (ctx.phase !== "pickCards") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.players[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[ctx.currentPlayer] === top1) {
                return totalScore[ctx.currentPlayer] >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: (G, ctx) => {
            if (ctx.phase !== "pickCards") {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.players[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[ctx.currentPlayer] === top1) {
                return totalScore[ctx.currentPlayer] >= Math.floor(1.10 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
});

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns {number}
 */
export const iterations = (G, ctx) => {
    const maxIter = G.botData.maxIter;
    if (ctx.phase === "pickCards") {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern.filter(card => card !== null).length === 1) {
            return 1;
        }
        const cardIndex = currentTavern.findIndex(card => card !== null);
        if (currentTavern.every(card => (card === null) || (card.suit === currentTavern[cardIndex].suit &&
            CompareCards(card, currentTavern[cardIndex]) === 0))) {
            return 1;
        }
        let efficientMovesCount = 0;
        for (let i = 0; i < currentTavern.length; i++) {
            if (currentTavern[i] === null) {
                continue;
            }
            if (currentTavern.some(card => CompareCards(currentTavern[i], card) === -1)) {
                continue;
            }
            if (G.decks[0].length > 18) {
                const curSuit = currentTavern[i].suit;
                if ((CompareCards(currentTavern[i], G.averageCards[curSuit]) === -1) &&
                    currentTavern.some(card => (card !== null) &&
                        (CompareCards(card, G.averageCards[curSuit]) > -1))) {
                    continue;
                }
            }
            efficientMovesCount++;
            if (efficientMovesCount > 1) {
                return maxIter;
            }
        }
        if (efficientMovesCount === 1) {
            return 1;
        }
    }
    return maxIter;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns {number}
 */
export const playoutDepth = (G, ctx) => {
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 2;
};
