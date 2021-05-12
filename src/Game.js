import {INVALID_MOVE} from 'boardgame.io/core';
import {setupGame} from "./GameSetup";

function IsEndGame(taverns) {
    let isEndGame = false;
    if (taverns[taverns.length - 1].length) {
        isEndGame = true;
    }
    return isEndGame;
}

export function Scoring(cards) {
    let score = 0;
    let count = [0, 0, 0, 0, 0];
    let arithmetic = [0, 5, 10, 15, 21, 27, 35, 44, 54, 65, 77];
    let rank = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].suit === 0) {
            count[0] += 1;
        } else if (cards[i].suit === 1) {
            count[1] += 1;
        } else if (cards[i].suit === 2) {
            count[2] += 1;
            rank += cards[i].rank;
        } else if (cards[i].suit === 3) {
            count[3] += 1;
            score += cards[i].rank;
        } else if (cards[i].suit === 4) {
            count[4] += 1;
            score += cards[i].rank;
        }
    }
    if (count[3] > 2) {
        score += 10;
    }
    if (Math.min(...count) === 1) {
        score += Math.min(...count) * 6;
    } else if (Math.min(...count) === 2) {
        score += Math.min(...count) * 10;
    }
    score += arithmetic[count[0]];
    score += count[1] ** 2;
    score += count[2] * rank;

    return score;
}

export const BoardGame = {
    setup: setupGame,

    turn: {
        moveLimit: 1,
    },

    moves: {
        clickBoard: (G, ctx, tavernId, cardId) => {
            if (G.taverns[tavernId][cardId] === null) {
                return INVALID_MOVE;
            }
            G.players[ctx.currentPlayer].push(G.taverns[tavernId][cardId]);
            if (G.deck.length > 0) {
                G.deck = ctx.random.Shuffle(G.deck);
                G.taverns[tavernId][cardId] = G.deck.pop();
            } else {
                G.taverns[tavernId][cardId] = null;
            }
        },
    },

    endIf: (G, ctx) => {
        if (IsEndGame(G.taverns)) {
            let totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.players[i]));
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
            let moves = [];
            let uniqueArr = [];
            let flag = true;
            for (let i = 0; i < G.drawSize; i++) {
                if ((G.taverns[i] !== null)) {
                    let uniqueArrLength = uniqueArr.length;
                    for (let j = 0; j < uniqueArrLength; j++) {
                        if (G.taverns[i].suit === uniqueArr[j].suit && G.taverns[i].rank === uniqueArr[j].rank) {
                            flag = false;
                            j = uniqueArrLength;
                        }
                    }
                    if (flag) {
                        uniqueArr.push(G.taverns[i]);
                        moves.push({move: 'clickBoard', args: [i]});
                    }
                }
                flag = true;
            }
            return moves;
        },
    },
};
