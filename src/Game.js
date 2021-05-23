import {SetupGame} from "./GameSetup";
import {suitsConfigArray} from "./data/SuitData";
import {
    ClickBoardCoin,
    ClickCard,
    ClickHandCoin,
    ResolveBoardCoins,
    PlaceAllCoins,
    ClickCampCard,
    ClickHeroCard
} from "./Moves";
import {PotentialScoring, CheckHeuristicsForCoinsPlacement} from "./BotConfig";
import {CompareCards} from "./Card";
import {ChangePlayersPriorities, HasLowestPriority} from "./Priority";
//import {AddCardToCards} from "./Player";

const IsEndGame = (taverns, tavernsNum, deck) => {
    let isEndGame = false;
    if (!deck.length && taverns[tavernsNum - 1].every((element) => element === null)) {
        isEndGame = true;
    }
    return isEndGame;
};

export const Scoring = (player) => {
    const count = [0, 0, 0, 0, 0];
    let score = 0;
    for (let i = 0; i < player.cards.length; i++) {
        score += suitsConfigArray[i].scoringRule(player.cards[i]);
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (player.boardCoins[i] !== null) {
            score += player.boardCoins[i].value;
        } else if (player.handCoins[i] !== null) {
            score += player.handCoins[i].value;

        }
    }
    if (Math.min(...count) === 1) {
        score += Math.min(...count) * 6;
    } else if (Math.min(...count) === 2) {
        score += Math.min(...count) * 10;
    }

    return score;
};

export const BoardGame = {
    setup: SetupGame,
    phases: {
        placeCoins: {
            start: true,
            moves: {
                ClickHandCoin,
                ClickBoardCoin,
                PlaceAllCoins,
            },
            onBegin: (G) => {
                for (let i = 0; i < G.players.length; i++) {
                    for (let j = 0; j < G.players[i].boardCoins.length; j++) {
                        const tempId = G.players[i].handCoins.indexOf(null);
                        if (tempId === -1) {
                            break;
                        }
                        G.players[i].handCoins[tempId] = G.players[i].boardCoins[j];
                        G.players[i].boardCoins[j] = null;
                    }
                }
            },
            next: 'pickCards',
        },
        pickCards: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G) => G.playersOrder,
                },
            },
            onBegin: (G, ctx) => {
                // todo Open only current taverns coins!
                const {playersOrder, exchangeOrder} = ResolveBoardCoins(G, ctx);
                [G.playersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
                ChangePlayersPriorities(G);
            },
            moves: {
                ClickCard,
                ClickHeroCard,
                ClickCampCard,
            },
            endIf: (G) => {
                return G.taverns[G.tavernsNum - 1].every((element) => element === null);
            },
        },
    },
    endIf: (G, ctx) => {
        if (IsEndGame(G.taverns, G.tavernsNum, G.decks[G.decks.length - 1])) {
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i]));
            }
            for (let i = ctx.numPlayers - 1; i >= 0; i--) {
                if (Math.max(...totalScore) === totalScore[i]) {
                    return {winner: String(i)};
                }
            }
        }
    },
    ai: {
        enumerate: (G, ctx) => {
            //make false for standard bot
            const enableAdvancedBot = true,
                uniqueArr = [];
            let moves = [],
                flag = true;
            if (ctx.phase === 'pickCards') {
                const tavernId = G.taverns.findIndex(element => element.some(item => item !== null));
                if (tavernId === -1) {
                    return moves;
                }
                for (let i = 0; i < G.taverns[tavernId].length; i++) {
                    if (G.taverns[tavernId][i] === null) {
                        continue;
                    }
                    if (G.taverns[tavernId].some(element => CompareCards(G.taverns[tavernId][i], element) === -1)) {
                        continue;
                    }
                    if (G.decks[0].length > 18) {
                        const curSuit = G.taverns[tavernId][i].suit;
                        if ((CompareCards(G.taverns[tavernId][i], G.averageCards[curSuit]) === -1) && G.taverns[tavernId].some(element => (element !== null) && (CompareCards(element, G.averageCards[curSuit]) > -1))) {
                            continue;
                        }
                    }
                    const uniqueArrLength = uniqueArr.length;
                    for (let j = 0; j < uniqueArrLength; j++) {
                        if (G.taverns[tavernId][i].suit === uniqueArr[j].suit && CompareCards(G.taverns[tavernId][i], uniqueArr[j]) === 0) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        uniqueArr.push(G.taverns[tavernId][i]);
                        moves.push({move: 'ClickCard', args: [tavernId, i]});
                    }
                    flag = true;
                }
            }
            if (ctx.phase === 'placeCoins') {
                if (G.players[ctx.currentPlayer].selectedCoin === undefined) {
                    for (let i = 0; i < G.players[ctx.currentPlayer].handCoins.length; i++) {
                        if (G.players[ctx.currentPlayer].handCoins[i] !== null) {
                            moves.push({move: 'ClickHandCoin', args: [i]})
                        }
                    }
                } else {
                    for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
                        if (G.players[ctx.currentPlayer].boardCoins[i] === null) {
                            moves.push({move: 'ClickBoardCoin', args: [i]})
                        }
                    }
                }
            }
            if (enableAdvancedBot && ctx.phase === 'placeCoins') {
                moves = [];
                // const marketCoinsMaxValue = G.marketCoins.reduce((prev, current) => (prev.value > current.value) ? prev.value : current.value, 0);
                // let potentialScores = [];
                /*let curCards = [];
                for (let i = 0; i < G.players[ctx.currentPlayer].cards.length; i++) {
                    curCards[i] = [];
                    for (let j = 0; j < G.players[ctx.currentPlayer].cards[i].length; j++) {
                        AddCardToCards(curCards, G.players[ctx.currentPlayer].cards[i][j]);
                    }
                }*/
                // let curScore = PotentialScoring({cards: curCards});
                /*const indifferentTaverns = Array(G.tavernsNum).fill(true);
                const temp = [];
                for (let i = 0; i < G.tavernsNum; i++) {
                    for (let j = 0; j < G.taverns[i].length; j++) {
                            temp[j] = CompareCards(G.taverns[i][j], G.averageCards[G.taverns[i][j].suit]);
                            if ((j > 0) && (temp[j] !== temp[j - 1])) {
                                indifferentTaverns[i] = false;
                                break;
                            }
                    }
                }*/
                const res = [];
                for (let i = 0; i < G.botData.allPicks.length; i++) {
                    let temp = 0;
                    for (let j = 0; j < G.tavernsNum; j++) {
                        temp += CompareCards(G.taverns[j][G.botData.allPicks[i][j]], G.averageCards[G.taverns[j][G.botData.allPicks[i][j]].suit]);
                    }
                    res.push(temp);
                }

                let resultsForCoins = CheckHeuristicsForCoinsPlacement(G.taverns, G.averageCards);
                const hasLowestPriority = HasLowestPriority(G.players, ctx.currentPlayer);
                if (hasLowestPriority) {
                    resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
                }
                const minResultForCoins = Math.min(...resultsForCoins),
                    maxResultForCoins = Math.max(...resultsForCoins),
                    tradingProfit = G.decks[G.decks.length - 1].length > 18 ? 1: 0;
                let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
                if (minResultForCoins <= 0) {
                    positionForMinCoin = resultsForCoins.findIndex(item => item === minResultForCoins);
                }
                if (maxResultForCoins >= 0) {
                    positionForMaxCoin = resultsForCoins.findIndex(item => item === maxResultForCoins);
                }
                //console.log(resultsForCoins);
                const allCoinsOrder = G.botData.allCoinsOrder,
                    handCoins = G.players[ctx.currentPlayer].handCoins;
                for (let i = 0; i < allCoinsOrder.length; i++) {
                    let hasTrading = allCoinsOrder[i].some(element => handCoins[element].isTriggerTrading);
                    if (tradingProfit < 0) {
                        if (hasTrading) {
                            continue;
                        }
                        moves.push({move: 'PlaceAllCoins', args: [allCoinsOrder[i]]});
                    } else if (tradingProfit > 0) {
                        if (!hasTrading) {
                            continue;
                        }
                        const hasPositionForMaxCoin = positionForMaxCoin !== -1,
                            hasPositionForMinCoin = positionForMinCoin !== -1;
                        let isTopCoinsOnPosition = false,
                            isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrder[i].filter(item => handCoins[item].value > handCoins[allCoinsOrder[i][positionForMaxCoin]].value).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter(item => item.value < handCoins[allCoinsOrder[i][positionForMinCoin]].value).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            moves.push({move: 'PlaceAllCoins', args: [G.botData.allCoinsOrder[i]]});
                            //console.log("#" + i.toString().padStart(2) + ":     " + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    } else {
                        moves.push({move: 'PlaceAllCoins', args: [allCoinsOrder[i]]});
                    }
                }
                //console.log(moves);
            }
            return moves;
        },
        objectives: () => ({
            isEarlyGame: {
                checker: (G, ctx) => {
                    return G.decks[0].length > 0;
                },
                weight: -100.0,
            },
            /*isWeaker: {
                checker: (G, ctx) => {
                    if (ctx.phase !== 'placeCoins') {
                        return false;
                    }
                    if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
                    {
                        return false;
                    }
                    if (G.taverns[0].some(element => element === null)) {
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
                    if (ctx.phase !== 'placeCoins') {
                        return false;
                    }
                    if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
                    {
                        return false;
                    }
                    if (G.taverns[0].some(element => element === null)) {
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
                    if (ctx.phase !== 'placeCoins') {
                        return false;
                    }
                    if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
                    {
                        return false;
                    }
                    if (G.taverns[0].some(element => element === null)) {
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
                    if (ctx.phase !== 'pickCards') {
                        return false;
                    }
                    if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
                    {
                        return false;
                    }
                    if (G.taverns[0].some(element => element === null)) {
                        return false;
                    }
                    const totalScore = [];
                    for (let i = 0; i < ctx.numPlayers; i++) {
                        totalScore.push(Scoring(G.players[i]));
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
                    if (ctx.phase !== 'pickCards') {
                        return false;
                    }
                    if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
                    {
                        return false;
                    }
                    if (G.taverns[0].some(element => element === null)) {
                        return false;
                    }
                    const totalScore = [];
                    for (let i = 0; i < ctx.numPlayers; i++) {
                        totalScore.push(Scoring(G.players[i]));
                    }
                    const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
                    if (totalScore[ctx.currentPlayer] === top1) {
                        return totalScore[ctx.currentPlayer] >= Math.floor(1.10 * top2);
                    }
                    return false;
                },
                weight: 0.5,
            },
        }),
        iterations: (G, ctx) => {
            const maxIter = G.botData.maxIter;
            if (ctx.phase === 'pickCards') {
                const tavernId = G.taverns.findIndex(element => element.some(item => item !== null));
                if (tavernId === -1) {
                    return maxIter;
                }
                const currentTavern = G.taverns[tavernId];
                if (currentTavern.filter(element => element !== null).length === 1) {
                    return 1;
                }
                const cardIndex = currentTavern.findIndex(element => element !== null);
                if (currentTavern.every(element => (element === null) || (element.suit === currentTavern[cardIndex].suit && CompareCards(element, currentTavern[cardIndex]) === 0))) {
                    return 1;
                }
                let efficientMovesCount = 0;
                for (let i = 0; i < currentTavern.length; i++) {
                    if (currentTavern[i] === null) {
                        continue;
                    }
                    if (currentTavern.some(element => CompareCards(currentTavern[i], element) === -1)) {
                        continue;
                    }

                    if (G.decks[0].length > 18) {
                        const curSuit = currentTavern[i].suit;
                        if ((CompareCards(currentTavern[i], G.averageCards[curSuit]) === -1) && currentTavern.some(element => (element !== null) && (CompareCards(element, G.averageCards[curSuit]) > -1))) {
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
        },
        playoutDepth: (G, ctx) => {
            if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
                return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 20;
            }
            return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 2;
        },
    },
};
