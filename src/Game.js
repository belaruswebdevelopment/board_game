import {SetupGame} from "./GameSetup";
import {suitsConfigArray} from "./SuitData";
import {ClickBoardCoin, ClickCard, ClickHandCoin} from "./Moves";

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
        ClickCard,
        ClickHandCoin,
        ClickBoardCoin,
    },
    phases: {
      placeCoins: {
        start: true,
        turn: {
            moveLimit: undefined,
        },
        moves: { ClickHandCoin, ClickBoardCoin, },
        endIf: (G, ctx) => {
          const isAllHandCoinsEmpty = !G.players.some((element) => element.handCoins.some((e) => e !== null));
          return isAllHandCoinsEmpty;
        },
        next: 'pickCards',
      },
      pickCards: {
        moves: { ClickCard, },
        endIf: (G, ctx) => {
          const isLastTavernEmpty = !G.taverns[G.tavernsNum - 1].some((element) => element !== null);
          return isLastTavernEmpty;
        },
        next: 'placeCoins',
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
