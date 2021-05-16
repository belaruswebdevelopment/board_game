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
    const count = [0, 0, 0, 0, 0];
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
        ClickCard: (G, ctx, tavernId, cardId) => {
            const isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null);
            const isEmptyPick = G.taverns[tavernId][cardId] === null;
            if (isEmptyPick || isEarlyPick) {
                return INVALID_MOVE;
            }
            AddCardToPlayer(G.players[ctx.currentPlayer], G.taverns[tavernId][cardId]);
            G.taverns[tavernId][cardId] = null;
            const isLastTavernEmpty = !G.taverns[G.tavernsNum - 1].some((element) => element !== null);
            if (isLastTavernEmpty) {
                if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
                    G.tierToEnd--;
                    if (G.tierToEnd === 0) return;
                }
                for (let i = 0; i < G.tavernsNum; i++) {
                    G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
                }
            }
        },
        ClickCoinInHands: (G, ctx, coinId) => {
            const isWrongPick = false;
            if (isWrongPick) {
                return INVALID_MOVE;
            }
            G.players[ctx.currentPlayer].selectedCoin = coinId;
        },
        ClickPlaceOnBoard: (G, ctx, coinId) => {
            const isWrongPick = false;
            if (isWrongPick) {
                return INVALID_MOVE;
            }
            if (G.players[ctx.currentPlayer].handCoins[coinId] !== null) {
                G.players[ctx.currentPlayer].handCoins[coinId] = G.players[ctx.currentPlayer].boardCoins[coinId];
                G.players[ctx.currentPlayer].boardCoins[coinId] = null;
            } else if (G.players[ctx.currentPlayer].selectedCoin !== undefined) {
                G.players[ctx.currentPlayer].boardCoins[coinId] = G.players[ctx.currentPlayer].handCoins[coinId];
                G.players[ctx.currentPlayer].handCoins[coinId] = null;
            } else {
                return INVALID_MOVE;
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
                            break;
                        }
                    }
                    if (flag) {
                        uniqueArr.push(G.taverns[tavernId][i]);
                        moves.push({move: 'ClickCard', args: [tavernId, i]});
                    }
                }
                flag = true;
            }
            return moves;
        },
    },
};