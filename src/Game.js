import {SetupGame} from "./GameSetup";
import {ClickCard, ClickCardToPickDistinction, ClickDistinctionCard,} from "./moves/Moves";
import {ChangePlayersPriorities} from "./Priority";
import {CheckDistinction, ScoreWinner} from "./Score";
import {enumerate, iterations, objectives, playoutDepth} from "./AI";
import {ReturnCoinsToPlayerHands} from "./Coin";
import {RefillTaverns} from "./Tavern";
import {RefillCamp} from "./Camp";
import {
    ClickHeroCard,
    DiscardCard,
    PickDiscardCard,
    PlaceCard,
} from "./moves/HeroMoves";
import {
    AddCoinToPouch,
    BotsPlaceAllCoins,
    ClickBoardCoin,
    ClickCoinToUpgrade,
    ClickHandCoin,
    ResolveBoardCoins,
    UpgradeCoinVidofnirVedrfolnir
} from "./moves/CoinMoves";
import {
    ClickCampCard, ClickCampCardHolda,
    DiscardCard2Players,
    DiscardCardFromPlayerBoard,
    DiscardSuitCardFromPlayerBoard
} from "./moves/CampMoves";

/**
 * Параметры игры.
 *  Применения:
 *  1) При инициализации игрового стола.
 *
 * @type {{onEnd: (function(*=, *=): *), ai: {playoutDepth: ((function(*, *): number)|*), enumerate: ((function(*=, *=): *[])|*), objectives: ((function(): {isEarlyGame: {weight: number, checker: (function(*): boolean)}, isFirst: {weight: number, checker: ((function(*, *): boolean)|*)}, isStronger: {weight: number, checker: ((function(*, *): boolean)|*)}})|*), iterations: ((function(*, *): number)|*)}, setup: ((function(*): {suitsNum: number, campNum: number, campPicked: boolean, tavernsNum: number, discardCampCardsDeck: *[], tierToEnd: number, currentTavern: null, marketCoins: *[], drawSize: (number|*), heroes: *[], discardCardsDeck: *[], drawProfit: null, distinctions: *[], decks: *[], expansions: {thingvellir: {active: boolean}}, taverns: *[], exchangeOrder: *[], botData: {}, averageCards: *[], debug: boolean, players: *[], actionsNum: null, camp: T[], winner: null, campDecks: ({tier: number, name: number, description: string}|null)[][], playersOrder: *[], marketCoinsUnique: *[]})|*), phases: {placeCoins: {next: string, onBegin: BoardGame.phases.placeCoins.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), BotsPlaceAllCoins: BotsPlaceAllCoins, ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}, start: boolean, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, placeCoinsUline: {onBegin: BoardGame.phases.placeCoinsUline.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, pickCards: {onBegin: BoardGame.phases.pickCards.onBegin, onEnd: BoardGame.phases.pickCards.onEnd, moves: {ClickCard: ((function(*=, *=, *=): (string|undefined))|*), ClickCampCard: ((function(*=, *=, *=): (string|*))|*)}, turn: {stages: {discardCard: {moves: {DiscardCard2Players: DiscardCard2Players}}, pickDiscardCardAndumia: {moves: {PickDiscardCard: ((function(*=, *=, *=): (*))|*)}}, campAction: {moves: {PickDiscardCard: ((function(*=, *=, *=): (*))|*), AddCoinToPouch: ((function(*=, *=, *): (string|undefined))|*), UpgradeCoinVidofnirVedrfolnir: ((function(*=, *=, *=, *=, *=): (string|undefined))|*)}}, discardCardFromBoard: {moves: {DiscardCard: ((function(*=, *=, *=, *=): (*|undefined))|*)}}, placeTradingCoinsUline: {moves: {ClickHandCoin: ((function(*, *, *=): (string|undefined))|*), ClickBoardCoin: ((function(*=, *=, *=): (string|undefined))|*)}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoard}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string))|*)}}, placeCards: {moves: {PlaceCard: ((function(*=, *=, *=): (*))|*)}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((function(*=, *=, *=): (string|*))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, getDistinctions: {next: string, onBegin: BoardGame.phases.getDistinctions.onBegin, onEnd: BoardGame.phases.getDistinctions.onEnd, moves: {ClickDistinctionCard: ((function(*=, *=, *=): (string|undefined))|*)}, endIf: (function(*): boolean), turn: {stages: {upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string))|*)}}, pickDistinctionCard: {moves: {ClickCardToPickDistinction: ClickCardToPickDistinction}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, endTier: {onEnd: BoardGame.phases.endTier.onEnd, moves: {DiscardCardFromPlayerBoard: DiscardCardFromPlayerBoard}, turn: {stages: {pickDiscardCardAndumia: {moves: {PickDiscardCard: ((function(*=, *=, *=): (*))|*)}}, discardCardFromBoard: {moves: {DiscardCard: ((function(*=, *=, *=, *=): (*|undefined))|*)}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string))|*)}}, placeCards: {moves: {PlaceCard: ((function(*=, *=, *=): (*))|*)}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((function(*=, *=, *=): (string|*))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}}}} Игра.
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
                if (ctx.turn !== 0) {
                    ReturnCoinsToPlayerHands(G);
                }
                G.playersOrder = [];
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.players[i].buffs?.["everyTurn"] !== "Uline") {
                        G.playersOrder.push(i);
                    }
                }
            },
        },
        // todo rework phase into stage?!
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
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda,
                        },
                    },
                    pickDiscardCardAndumia: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2Players,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin,
                            ClickBoardCoin,
                        },
                    },
                    // todo rework in stages
                    campAction: {
                        moves: {
                            AddCoinToPouch,
                            UpgradeCoinVidofnirVedrfolnir,
                            PickDiscardCard,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
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
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda,
                        },
                    },
                    pickDiscardCardAndumia: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    // End
                },
            },
            moves: {
                DiscardCardFromPlayerBoard,
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
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
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
        return ScoreWinner(G, ctx);
    },
    ai: {
        enumerate,
        objectives,
        iterations,
        playoutDepth,
    },
};
