import {INVALID_MOVE} from 'boardgame.io/core';
import {SetupGame} from "./GameSetup";
import {AddCardToPlayer} from "./Player";
import {suitsConfigArray} from "./SuitData";

const IsEndGame = (taverns, tavernsNum, deck) => {
    let isEndGame = false;
    if (!deck.length && taverns[tavernsNum - 1].every((element) => element === null)) {
        isEndGame = true;
    }
    return isEndGame;
}

export const Scoring = (cards) => {
    let score = 0;
    let count = [0, 0, 0, 0, 0];
    for (let i = 0; i < cards.length; i++) {
        score += suitsConfigArray[i].scoringRule(cards[i]);
    }
    if (Math.min(...count) === 1) {
        score += Math.min(...count) * 6;
    } else if (Math.min(...count) === 2) {
        score += Math.min(...count) * 10;
    }

    return score;
}

export const BoardGame = {
    setup: SetupGame,

    turn: {
        moveLimit: 1,
    },

    moves: {
        ClickBoard: (G, ctx, tavernId, cardId) => {
            const isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null);
            if (G.taverns[tavernId][cardId] === null || isEarlyPick) {
                return INVALID_MOVE;
            }
            AddCardToPlayer(G.players[ctx.currentPlayer], G.taverns[tavernId][cardId]);
            G.taverns[tavernId][cardId] = null;
            if (G.decks[G.decks.length - G.tierToEnd]?.length > 0 && G.taverns[G.tavernsNum - 1].every((element) => element === null)) {
                G.decks[G.decks.length - G.tierToEnd] = ctx.random.Shuffle(G.decks[G.decks.length - G.tierToEnd]);
                for (let i = 0; i < G.tavernsNum; i++) {
                    for (let j = 0; j < G.drawSize; j++) {
                        G.taverns[i][j] = G.decks[G.decks.length - G.tierToEnd].pop();
                        if (!G.decks[G.decks.length - G.tierToEnd].length && G.tierToEnd) {
                            G.tierToEnd--;
                            if (G.tierToEnd) {
                                for (let t = 0; t < G.tavernsNum; t++) {
                                    G.taverns[t] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
                                }
                            }
                        }
                    }
                }
            }
        },
    },

    endIf: (G, ctx) => {
        if (IsEndGame(G.taverns, G.tavernsNum, G.decks[G.decks.length - 1])) {
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i].cards));
            }
            let winnerScore = Math.max(...totalScore);
            for (let i = ctx.numPlayers - 1; i >= 0; i--) {
                if (winnerScore === totalScore[i]) {
                    return {winner: String(i)};
                }
            }
        }
    },

    ai: {
        enumerate: (G) => {
            const moves = [];
            const uniqueArr = [];
            let flag = true;
            const tavernId = G.taverns.findIndex(element => element.some(item => item !== null));
            if (tavernId === -1) {
                return moves;
            }
            for (let i = 0; i < G.drawSize; i++) {
                if ((G.taverns[tavernId][i] !== null)) {
                    let uniqueArrLength = uniqueArr.length;
                    for (let j = 0; j < uniqueArrLength; j++) {
                        if (G.taverns[tavernId][i].suit === uniqueArr[j].suit && G.taverns[tavernId][i].rank === uniqueArr[j].rank) {
                            flag = false;
                            j = uniqueArrLength;
                        }
                    }
                    if (flag) {
                        uniqueArr.push(G.taverns[tavernId][i]);
                        moves.push({move: 'ClickBoard', args: [tavernId, i]});
                    }
                }
                flag = true;
            }
            return moves;
        },
    },
};
