import {SetupGame} from "./GameSetup";
import {
    ClickBoardCoin,
    ClickCampCard,
    ClickCard,
    ClickCardToPickDistinction,
    ClickCoinToUpgrade,
    ClickCoinToUpgradeDistinction,
    ClickCoinToUpgradeInDistinction,
    ClickDistinctionCard,
    ClickHandCoin,
    ClickHeroCard, DiscardCard, GridAction, MoveThrud, PickDiscardCard,
    BotsPlaceAllCoins, PlaceCard, PlaceThrud, PlaceYlud,
    ResolveBoardCoins, UpgradeCoinFromDiscard, DiscardCard2Players, PickCampCardHolda
} from "./Moves";
import {ChangePlayersPriorities} from "./Priority";
import {CheckDistinction, CurrentScoring} from "./Score";
import {enumerate, iterations, objectives, playoutDepth} from "./AI";
import {ReturnCoinsToPlayerHands} from "./Coin";
import {RefillTaverns} from "./Tavern";
import {RefillCamp} from "./Camp";

/**
 *  Параметры игры.
 *  Применения:
 *  1) При инициализации игрового стола.
 *
 * @type {{onEnd: ((function(*, *): (*|undefined))|*), ai: {playoutDepth: ((function(*, *): number)|*), enumerate: ((function(*=, *=): *[])|*), objectives: ((function(): {isEarlyGame: {weight: number, checker: (function(*): boolean)}, isFirst: {weight: number, checker: ((function(*, *): boolean)|*)}, isStronger: {weight: number, checker: ((function(*, *): boolean)|*)}})|*), iterations: ((function(*, *): number)|*)}, setup: ((function(*): {suitsNum: number, campNum: number, campPicked: boolean, tavernsNum: number, discardCampCardsDeck: *[], tierToEnd: number, currentTavern: null, marketCoins: *[], drawSize: (number|*), heroes: *[], discardCardsDeck: *[], drawProfit: null, distinctions: *[], decks: *[], expansions: {thingvellir: {active: boolean}}, taverns: *[], exchangeOrder: *[], botData: {}, averageCards: *[], debug: boolean, players: *[], actionsNum: null, camp: T[], winner: null, campDecks: ({tier: number, name: number, description: string}|null)[][], playersOrder: *[], marketCoinsUnique: *[]})|*), phases: {placeCoins: {next: string, onBegin: BoardGame.phases.placeCoins.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), BotsPlaceAllCoins: BotsPlaceAllCoins, ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}, start: boolean, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, placeCoinsUline: {onBegin: BoardGame.phases.placeCoinsUline.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, pickCards: {onBegin: BoardGame.phases.pickCards.onBegin, onEnd: BoardGame.phases.pickCards.onEnd, moves: {ClickCard: ((function(*=, *=, *=): (string|undefined))|*), ClickCampCard: ((function(*=, *=, *=): (string|undefined))|*)}, turn: {stages: {moveThrud: {moves: {MoveThrud: MoveThrud}}, discardCard: {moves: {DiscardCard2Players: DiscardCard2Players}}, heroAction: {moves: {PlaceThrud: PlaceThrud, PickCampCardHolda: PickCampCardHolda, PickDiscardCard: PickDiscardCard, DiscardCard: DiscardCard, GridAction: ((function(*=, *=, *=, *=, *=): (string|undefined))|*), PlaceCard: PlaceCard, UpgradeCoinFromDiscard: ((function(*=, *=, *=, *=, *=): (string|undefined))|*)}}, placeTradingCoinsUline: {moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string|undefined))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, getDistinctions: {next: string, onBegin: BoardGame.phases.getDistinctions.onBegin, onEnd: BoardGame.phases.getDistinctions.onEnd, moves: {ClickDistinctionCard: ((function(*=, *=, *=): (string|undefined))|*)}, endIf: (function(*): boolean), turn: {stages: {upgradeDistinctionCoin: {moves: {ClickCoinToUpgradeDistinction: ((function(*=, *=, *=, *=, *=): (string|undefined))|*)}}, upgradeCoinInDistinction: {moves: {ClickCoinToUpgradeInDistinction: ((function(*=, *=, *=, *=, *=): (string|undefined))|*)}}, pickDistinctionCard: {moves: {ClickCardToPickDistinction: ClickCardToPickDistinction}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, endTier: {onEnd: BoardGame.phases.endTier.onEnd, moves: {PlaceYlud: PlaceYlud}, turn: {stages: {moveThrud: {moves: {MoveThrud: MoveThrud}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}}}} Игра.
 */
export const BoardGame = {
    setup: SetupGame,
    phases: {
        placeCoins: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G) => G.playersOrder,
                },
            },
            start: true,
            moves: {
                ClickHandCoin,
                ClickBoardCoin,
                BotsPlaceAllCoins,
            },
            next: "pickCards",
            onBegin: (G, ctx) => {
                G.currentTavern = -1;
                ReturnCoinsToPlayerHands(G);
                G.playersOrder = [];
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.players[i].buffs?.["everyTurn"] !== "Uline") {
                        G.playersOrder.push(i);
                    }
                }
            },
        },
        placeCoinsUline: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G) => G.playersOrder,
                },
            },
            moves: {
                ClickHandCoin,
                ClickBoardCoin,
            },
            onBegin: (G, ctx) => {
                G.playersOrder = [];
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.players[i].buffs?.["everyTurn"] === "Uline") {
                        G.playersOrder.push(i);
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
                    moveThrud: {
                        moves: {
                            MoveThrud,
                        },
                    },
                    discardCard: {
                        moves: {
                            DiscardCard2Players,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin,
                            ClickBoardCoin,
                        },
                    },
                    heroAction: {
                        moves: {
                            GridAction,
                            PlaceThrud,
                            DiscardCard,
                            PlaceCard,
                            PickCampCardHolda,
                            PickDiscardCard,
                            UpgradeCoinFromDiscard,
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
                G.currentTavern++;
                const {playersOrder, exchangeOrder} = ResolveBoardCoins(G, ctx);
                [G.playersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
                ChangePlayersPriorities(G);
            },
        },
        endTier: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % G.playersOrder.length,
                    playOrder: (G) => G.playersOrder,
                },
                stages: {
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    moveThrud: {
                        moves: {
                            MoveThrud,
                        },
                    },
                },
            },
            moves: {
                PlaceYlud,
            },
            onEnd: (G) => {
                G.drawProfit = null;
            },
        },
        getDistinctions: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % G.playersOrder.length,
                    playOrder: (G) => G.playersOrder,
                },
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinction,
                        },
                    },
                    upgradeDistinctionCoin: {
                        moves: {
                            ClickCoinToUpgradeDistinction,
                        },
                    },
                    upgradeCoinInDistinction: {
                        moves: {
                            ClickCoinToUpgradeInDistinction,
                        },
                    },
                },
            },
            next: "placeCoins",
            moves: {
                ClickDistinctionCard,
            },
            onBegin: (G, ctx) => {
                CheckDistinction(G, ctx);
                G.playersOrder = G.distinctions.filter(i => i !== undefined);
            },
            onEnd: (G) => {
                G.distinctions = Array(G.suitsNum).fill(undefined);
                RefillCamp(G);
                RefillTaverns(G);
            },
            endIf: (G) => G.distinctions.every(distinction => distinction === undefined),
        },
    },
    onEnd: (G, ctx) => {
        const totalScore = [];
        for (let i = 0; i < ctx.numPlayers; i++) {
            totalScore.push(CurrentScoring(G.players[i]));
        }
        for (let i = ctx.numPlayers - 1; i >= 0; i--) {
            if (Math.max(...totalScore) === totalScore[i]) {
                G.winner = i;
                return G;
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
