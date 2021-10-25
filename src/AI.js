import {CompareCards, EvaluateCard} from "./Card";
import {HasLowestPriority} from "./Priority";
import {CheckHeuristicsForCoinsPlacement} from "./BotConfig";
import {CurrentScoring} from "./Score";
import {moveValidators, moveBy} from "./MoveValidator";
import {suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";

/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
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
        const activeStageOfCurrentPlayer = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) ?
            ctx.activePlayers[ctx.currentPlayer] : "default";
        // todo Fix it, now just for bot can do RANDOM move
        const botMoveArguments = [];
        for (const stage in moveBy[ctx.phase]) {
            if (moveBy[ctx.phase].hasOwnProperty(stage)) {
                if (ctx.phase === "pickCards" && stage.startsWith("default")) {
                    continue;
                }
                if (stage.includes(activeStageOfCurrentPlayer) && (!isAdvancedExist || stage.includes(advancedString) ===
                    enableAdvancedBot)) {
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
            // todo Fix it, now just for bot can do RANDOM move
            let pickCardOrCampCard = "card";
            if (G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
                G.publicPlayers[ctx.currentPlayer].buffs["goCamp"])) {
                pickCardOrCampCard = Math.floor(Math.random() * 2) ? "card" : "camp";
            }
            if (pickCardOrCampCard === "card") {
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
            } else {
                for (let j = 0; j < G.campNum; j++) {
                    if (G.camp[j]) {
                        botMoveArguments.push([j]);
                    }
                }
                moves.push({
                    move: "ClickCampCard",
                    args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
                });
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
                handCoins = G.publicPlayers[ctx.currentPlayer].handCoins;
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const hasTrading = allCoinsOrder[i].some(coinId => handCoins[coinId] && handCoins[coinId].isTriggerTrading);
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
                        isTopCoinsOnPosition = allCoinsOrder[i].filter(item => (handCoins[item] && handCoins[item].value) >
                            (handCoins[allCoinsOrder[i][positionForMaxCoin]] &&
                                handCoins[allCoinsOrder[i][positionForMaxCoin]].value)).length <= 1;
                    }
                    if (hasPositionForMinCoin) {
                        isMinCoinsOnPosition = handCoins.filter(item => (item && item.value) <
                            (handCoins[allCoinsOrder[i][positionForMinCoin]] &&
                                handCoins[allCoinsOrder[i][positionForMinCoin]].value)).length <= 1;
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
        // todo Fix it, now just for bot can do RANDOM move
        if (ctx.phase === "endTier") {
            for (let j = 0; j < G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit !== (G.publicPlayers[ctx.currentPlayer].pickedCard && G.publicPlayers[ctx.currentPlayer].pickedCard.suit)) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "PlaceCard",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (ctx.phase === "getMjollnirProfit") {
            const totalSuitsRanks = [];
            for (let j = 0; j < G.suitsNum; j++) {
                totalSuitsRanks.push(G.publicPlayers[ctx.currentPlayer].cards[j].reduce(TotalRank, 0));
            }
            botMoveArguments.push([totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks))]);
            moves.push({
                move: "GetMjollnirProfit",
                args: [...botMoveArguments[0]],
            });
        }
        if (ctx.phase === "brisingamensEndGame") {
            for (let i = 0; ; i++) {
                let isDrawRow = false;
                for (let j = 0; j < G.suitsNum; j++) {
                    if (G.publicPlayers[ctx.currentPlayer].cards[j] !== undefined &&
                        G.publicPlayers[ctx.currentPlayer].cards[j][i] !== undefined) {
                        isDrawRow = true;
                        if (G.publicPlayers[ctx.currentPlayer].cards[j][i].type !== "герой") {
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
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (ctx.phase === "enlistmentMercenaries") {
            if (G.drawProfit === "startOrPassEnlistmentMercenaries") {
                for (let j = 0; j < 2; j++) {
                    if (j === 0) {
                        botMoveArguments.push([j]);
                    } else if (G.publicPlayersOrder.length > 1) {
                        botMoveArguments.push([j]);
                    }
                }
                if (Math.floor(Math.random() * botMoveArguments.length) === 0) {
                    moves.push({move: "StartEnlistmentMercenaries", args: []});
                } else {
                    moves.push({move: "PassEnlistmentMercenaries", args: []});
                }
            } else if (G.drawProfit === "enlistmentMercenaries") {
                const mercenaries = G.publicPlayers[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник");
                for (let j = 0; j < mercenaries.length; j++) {
                    botMoveArguments.push([j]);
                }
                moves.push({
                    move: "GetEnlistmentMercenaries",
                    args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
                });
            } else if (G.drawProfit === "placeEnlistmentMercenaries") {
                for (let j = 0; j < G.suitsNum; j++) {
                    const suit = Object.keys(suitsConfig)[j];
                    if (suit === (G.publicPlayers[ctx.currentPlayer].pickedCard.stack[0].variants[suit] &&
                        G.publicPlayers[ctx.currentPlayer].pickedCard.stack[0].variants[suit].suit)) {
                        botMoveArguments.push([j]);
                    }
                }
                moves.push({
                    move: "PlaceEnlistmentMercenaries",
                    args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
                });
            }
        }
        if (ctx.phase === "placeCoinsUline") {
            for (let j = 0; j < G.publicPlayers[ctx.currentPlayer].handCoins.length; j++) {
                if (G.publicPlayers[ctx.currentPlayer].handCoins[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "ClickHandCoin",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
            moves.push({move: "ClickBoardCoin", args: [G.currentTavern + 1]});
        }
        if (activeStageOfCurrentPlayer === "placeTradingCoinsUline") {
            for (let j = 0; j < G.publicPlayers[ctx.currentPlayer].handCoins.length; j++) {
                if (G.publicPlayers[ctx.currentPlayer].handCoins[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "ClickHandCoin",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]]
            });
            if (G.publicPlayers[ctx.currentPlayer].boardCoins[G.tavernsNum]) {
                moves.push({move: "ClickBoardCoin", args: [G.tavernsNum + 1]});
            } else {
                moves.push({move: "ClickBoardCoin", args: [G.tavernsNum]});
            }
        }
        if (activeStageOfCurrentPlayer === "addCoinToPouch") {
            for (let j = 0; j < G.publicPlayers[ctx.currentPlayer].handCoins.length; j++) {
                if (G.publicPlayers[ctx.currentPlayer].buffs["everyTurn"] === "Uline" &&
                    G.publicPlayers[ctx.currentPlayer].handCoins[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "AddCoinToPouch",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (activeStageOfCurrentPlayer === "upgradeCoinVidofnirVedrfolnir") {
            let type = "board",
                isInitial = false;
            for (let j = G.tavernsNum; j < G.publicPlayers[ctx.currentPlayer].boardCoins.length; j++) {
                if (G.publicPlayers[ctx.currentPlayer].boardCoins[j] && !G.publicPlayers[ctx.currentPlayer].boardCoins[j].isTriggerTrading &&
                    G.publicPlayers[ctx.currentPlayer].stack[0].config.coinId !== j) {
                    isInitial = G.publicPlayers[ctx.currentPlayer].boardCoins[j].isInitial;
                    botMoveArguments.push([j, type, isInitial]);
                }
            }
            moves.push({
                move: "UpgradeCoinVidofnirVedrfolnir",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (activeStageOfCurrentPlayer === "discardSuitCard") {
            // todo Bot can't do async turns...?
            const suitId = GetSuitIndexByName(G.publicPlayers[ctx.currentPlayer].stack[0].config.suit);
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    if (Number(ctx.playerID) === p) {
                        for (let i = 0; i < G.publicPlayers[p].cards[suitId].length; i++) {
                            for (let j = 0; j < 1; j++) {
                                if (G.publicPlayers[p].cards[suitId] !== undefined && G.publicPlayers[p].cards[suitId][i]
                                    !== undefined) {
                                    if (G.publicPlayers[p].cards[suitId][i].type !== "герой") {
                                        botMoveArguments.push([G.publicPlayers[ctx.currentPlayer].cards[suitId][i].points]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const minValue = Math.min(...botMoveArguments);
            moves.push({
                move: "DiscardSuitCardFromPlayerBoard",
                args: [suitId, G.publicPlayers[ctx.currentPlayer].cards[suitId].findIndex(card => card.type !== "герой" &&
                    card.value === minValue)],
            });
        }
        if (activeStageOfCurrentPlayer === "discardCardFromBoard") {
            for (let j = 0; j < G.suitsNum; j++) {
                if (G.publicPlayers[ctx.currentPlayer].cards[j][0] !== undefined &&
                    suitsConfig[G.publicPlayers[ctx.currentPlayer].cards[j][0].suit].suit !==
                    G.publicPlayers[ctx.currentPlayer].stack[0].config.suit &&
                    !(G.drawProfit === "DagdaAction" && G.actionsNum === 1 &&
                        suitsConfig[G.publicPlayers[ctx.currentPlayer].cards[j][0].suit].suit ===
                        (G.publicPlayers[ctx.currentPlayer].pickedCard && G.publicPlayers[ctx.currentPlayer].pickedCard.suit))) {
                    const last = G.publicPlayers[ctx.currentPlayer].cards[j].length - 1;
                    if (G.publicPlayers[ctx.currentPlayer].cards[j][last].type !== "герой") {
                        botMoveArguments.push([j, last]);
                    }
                }
            }
            moves.push({
                move: "DiscardCard",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (activeStageOfCurrentPlayer === "pickDiscardCard") {
            for (let j = 0; j < G.discardCardsDeck.length; j++) {
                botMoveArguments.push([j]);
            }
            moves.push({
                move: "PickDiscardCard",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (ctx.numPlayers === 2) {
            if (activeStageOfCurrentPlayer === "discardCard") {
                for (let j = 0; j < G.drawSize; j++) {
                    botMoveArguments.push([j]);
                }
                moves.push({
                    move: "DiscardCard2Players",
                    args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
                });
            }
        }
        if (activeStageOfCurrentPlayer === "placeCards") {
            for (let j = 0; j < G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit !== (G.publicPlayers[ctx.currentPlayer].pickedCard && G.publicPlayers[ctx.currentPlayer].pickedCard.suit)) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "PlaceCard",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (activeStageOfCurrentPlayer === "pickCampCardHolda") {
            for (let j = 0; j < G.campNum; j++) {
                if (G.camp[j]) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: "ClickCampCardHolda",
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        if (moves.length === 0) {
            // todo Fix for bot no moves if have artefact with not pick new hero and get artifact with get new hero (he can pick hero by it's action)
            console.log("ALERT: bot has " + moves.length + " moves. Phase: " + ctx.phase);
        }
        return moves;
    }
;

/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
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
                totalScore.push(Scoring(G.publicPlayers[i]));
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
                totalScore.push(Scoring(G.publicPlayers[i]));
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
                totalScore.push(Scoring(G.publicPlayers[i]));
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
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
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
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
