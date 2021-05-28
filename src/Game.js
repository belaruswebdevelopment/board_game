import {SetupGame} from "./GameSetup";
import {
    ClickBoardCoin,
    ClickCampCard,
    ClickCard, ClickCardToPickDistinction, ClickCoinToUpgrade, ClickCoinToUpgradeDistinction,
    ClickDistinctionCard,
    ClickHandCoin,
    ClickHeroCard,
    PlaceAllCoins,
    ResolveBoardCoins
} from "./Moves";
import {ChangePlayersPriorities} from "./Priority";
import {CheckDistinction, CurrentScoring} from "./Score";
import {enumerate, iterations, objectives, playoutDepth} from "./AI";

const IsEndGame = (taverns, tavernsNum, deck) => {
    let isEndGame = false;
    if (!deck.length && taverns[tavernsNum - 1].every((element) => element === null)) {
        isEndGame = true;
    }
    return isEndGame;
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
            next: 'pickCards',
            onBegin: (G) => {
                G.currentTavern = -1;
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
        },
        pickCards: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G) => G.playersOrder,
                },
                stages: {
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                },
            },
            moves: {
                ClickCard,
                ClickCampCard,
            },
            onBegin: (G, ctx) => {
                // todo Open only current taverns coins!
                G.currentTavern++;
                const {playersOrder, exchangeOrder} = ResolveBoardCoins(G, ctx);
                [G.playersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
                ChangePlayersPriorities(G);
            },
        },
        getDistinctions: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % G.playersOrder.length,
                    playOrder: (G) => G.playersOrder,
                },
            },
            next: 'placeCoins',
            moves: {
                ClickDistinctionCard,
                ClickCoinToUpgradeDistinction,
                ClickCardToPickDistinction,
            },
            onBegin: (G, ctx) => {
                CheckDistinction(G, ctx);
                G.playersOrder = G.distinctions.filter(i => i !== undefined);
            },
            onEnd: (G) => {
                G.distinctions = Array(G.suitsNum).fill(undefined);
            },
            endIf: (G) => {
                return G.distinctions.every((element) => element === undefined);
            },
        },
    },
    endIf: (G, ctx) => {
        if (IsEndGame(G.taverns, G.tavernsNum, G.decks[G.decks.length - 1])) {
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.players[i]));
            }
            for (let i = ctx.numPlayers - 1; i >= 0; i--) {
                if (Math.max(...totalScore) === totalScore[i]) {
                    return {winner: String(i)};
                }
            }
        }
    },
    ai: {
        enumerate,
        objectives,
        iterations,
        playoutDepth,
    },
};
