import {SetupGame} from "./GameSetup";
import {suitsConfigArray} from "./SuitData";
import {ClickBoardCoin, ClickCard, ClickHandCoin, ResolveBoardCoins, PlaceAllCoins} from "./Moves";
//import {PotentialScoring, CheckHeuristicsForTradingCoin} from "./BotConfig";
import {CompareCards} from "./Card"; //CreateCard
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
                const {playersOrder, exchangeOrder} = ResolveBoardCoins(G, ctx);
                [G.playersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
                const tempPriorities = []
                for (let i = 0; i < G.exchangeOrder.length; i++) {
                    tempPriorities[i] = G.players[G.exchangeOrder[i]].priority;
                }
                for (let i = 0; i < G.exchangeOrder.length; i++) {
                    G.players[i].priority = tempPriorities[i];
                }
            },
            moves: {
                ClickCard,
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
            const uniqueArr = [];
            let moves = [],
                flag = true;
            if (ctx.phase === 'pickCards') {
                const tavernId = G.taverns.findIndex(element => element.some(item => item !== null));
                if (tavernId === -1) {
                    return moves;
                }
                for (let i = 0; i < G.taverns[tavernId].length; i++) {
                    if ((G.taverns[tavernId][i] === null)) {
                        continue;
                    }
                    if (G.taverns[tavernId].some(element => CompareCards(G.taverns[tavernId][i], element) === -1)) {
                        continue;
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
            //make false for standard bot
            const enableAdvancedBot = true;
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
                //console.log("test indifferentTaverns");
                //console.log(CheckHeuristicsForTradingCoin(G.taverns, G.averageCards));
                /*for (let i = 0; i < G.botData.allPicks.length; i++) {
                    for (let j = 0; j < G.tavernsNum; j++) {
                        AddCardToCards(curCards, CreateCard(G.taverns[j][G.botData.allPicks[i][j]]));
                    }
                    // let nextScore = PotentialScoring({cards: curCards});
                    // potentialScores.push(nextScore - curScore);
                    curCards = [];
                    for (let k = 0; k < G.players[ctx.currentPlayer].cards.length; k++) {
                        curCards[k] = [];
                        for (let m = 0; m < G.players[ctx.currentPlayer].cards[k].length; m++) {
                            AddCardToCards(curCards, G.players[ctx.currentPlayer].cards[k][m]);
                        }
                    }
                }*/
                //console.log("test potential scores");
                //console.log(potentialScores);
                for (let i = 0; i < G.botData.allCoinsOrder.length; i++) {
                    moves.push({move: 'PlaceAllCoins', args: [G.botData.allCoinsOrder[i]]});
                }
            }
            return moves;
        },
        objectives: undefined,
        iterations: 10,
        playoutDepth: 100,
    },
};
