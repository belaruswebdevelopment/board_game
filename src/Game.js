import {INVALID_MOVE} from 'boardgame.io/core';
import {setupGame} from "./GameSetup";

function IsEndGame(taverns, tavernsNum, deck) {
    let isEndGame = false;
    if (!deck.length && taverns[tavernsNum - 1].every((element) => element === null)) {
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
        if (i === 0) {
            count[i] += cards[i].length;
            score += arithmetic[count[i]];
        } else if (i === 1) {
            count[i] += cards[i].length;
            score += count[i] ** 2;
        } else if (i === 2) {
            count[i] += cards[i].length;
            for (let j = 0; j < cards[i].length; j++) {
                rank += cards[i][j].rank;
            }
            score += count[i] * rank;
        } else if (cards[i].suit === 3) {
            count[i] += cards[i].length;
            for (let j = 0; j < cards[i].length; j++) {
                score += cards[i].rank;
            }
            if (count[i] > 2) {
                score += 10;
            }
        } else if (cards[i].suit === 4) {
            count[4] += 1;
            for (let j = 0; j < cards[i].length; j++) {
                score += cards[i].rank;
            }
        }
    }
    if (Math.min(...count) === 1) {
        score += Math.min(...count) * 6;
    } else if (Math.min(...count) === 2) {
        score += Math.min(...count) * 10;
    }

    return score;
}

export const BoardGame = {
    setup: setupGame,

    turn: {
        moveLimit: 1,
    },

    moves: {
        clickBoard: (G, ctx, tavernId, suitId, cardId) => {
            let isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null);
            if (G.taverns[tavernId][cardId] === null || isEarlyPick) {
                return INVALID_MOVE;
            }
            if (G.players[ctx.currentPlayer][suitId] === undefined) {
                G.players[ctx.currentPlayer][suitId] = [];
            }
            G.players[ctx.currentPlayer][suitId].push(G.taverns[tavernId][cardId]);
            G.taverns[tavernId][cardId] = null;
            if (G.deck.length > 0 && G.taverns[G.tavernsNum - 1].every((element) => element === null)) {
                G.deck = ctx.random.Shuffle(G.deck);
                for (let i = 0; i < G.tavernsNum; i++) {
                    for (let j = 0; j < G.drawSize; j++) {
                        G.taverns[i][j] = G.deck.pop();
                    }
                }
            }
        },
    },

    endIf: (G, ctx) => {
        if (IsEndGame(G.taverns, G.tavernsNum, G.deck)) {
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
                        moves.push({move: 'clickBoard', args: [tavernId, G.taverns[tavernId][i].suit, i]});
                    }
                }
                flag = true;
            }
            return moves;
        },
    },
};
