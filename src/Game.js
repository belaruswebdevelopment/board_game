import {INVALID_MOVE} from 'boardgame.io/core';
import {SetupGame} from "./GameSetup";
import {AddCardToPlayer} from "./Player";

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
    const arithmetic = [0, 5, 10, 15, 21, 27, 35, 44, 54, 65, 77];
    for (let i = 0; i < cards.length; i++) {
        if (i === 0) {
            count[0] += cards[i].length;
            score += arithmetic[count[0]];
        } else if (i === 1) {
            count[1] += cards[i].length;
            score += count[1] ** 2;
        } else if (i === 2) {
            let rank = 0;
            count[2] += cards[i].length;
            for (let j = 0; j < cards[i].length; j++) {
                rank += cards[i][j].rank;
            }
            score += count[2] * rank;
        } else if (i === 3) {
            count[3] += cards[i].length;
            for (let j = 0; j < cards[i].length; j++) {
                score += cards[i][j].rank;
            }
            if (count[3] > 2) {
                score += 10;
            }
        } else if (i === 4) {
            count[4] += 1;
            for (let j = 0; j < cards[i].length; j++) {
                score += cards[i][j].rank;
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
