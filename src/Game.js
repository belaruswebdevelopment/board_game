import {SetupGame} from "./GameSetup";
import {
    ClickCard,
    ClickCardToPickDistinction,
    ClickDistinctionCard,
    GetEnlistmentMercenaries,
    PassEnlistmentMercenaries,
    PickDiscardCard,
    PlaceEnlistmentMercenaries,
    StartEnlistmentMercenaries,
} from "./moves/Moves";
import {ChangePlayersPriorities} from "./Priority";
import {CheckDistinction, ScoreWinner} from "./Score";
import {enumerate, iterations, objectives, playoutDepth} from "./AI";
import {ReturnCoinsToPlayerHands} from "./Coin";
import {RefillTaverns} from "./Tavern";
import {RefillCamp} from "./Camp";
import {
    ClickHeroCard,
    DiscardCard,
    PlaceCard,
} from "./moves/HeroMoves";
import {
    AddCoinToPouch,
    ClickBoardCoin,
    ClickCoinToUpgrade,
    ClickHandCoin,
    UpgradeCoinVidofnirVedrfolnir
} from "./moves/CoinMoves";
import {
    ClickCampCard,
    ClickCampCardHolda,
    DiscardCard2Players,
    DiscardCardFromPlayerBoard,
    DiscardSuitCardFromPlayerBoard,
    GetMjollnirProfit
} from "./moves/CampMoves";
import {AddActionsToStack} from "./helpers/StackHelpers";
import {BotsPlaceAllCoins} from "./moves/BotMoves";
import {ResolveBoardCoins} from "./helpers/CoinHelpers";
// todo Add logging
// todo Add colors for cards Points by suit colors!
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 *
 * @type {{onEnd: (function(*=, *=): *), ai: {playoutDepth: ((function(*, *): number)|*), enumerate: ((function(*=, *=): *[])|*), objectives: ((function(): {isEarlyGame: {weight: number, checker: (function(*): boolean)}, isFirst: {weight: number, checker: ((function(*, *): boolean)|*)}, isStronger: {weight: number, checker: ((function(*, *): boolean)|*)}})|*), iterations: ((function(*, *): number)|*)}, setup: ((function(*): {suitsNum: number, campNum: number, campPicked: boolean, tavernsNum: number, discardCampCardsDeck: *[], tierToEnd: number, currentTavern: null, marketCoins: *[], drawSize: (number|*), heroes: *[], discardCardsDeck: *[], drawProfit: null, distinctions: *[], decks: *[], expansions: {thingvellir: {active: boolean}}, taverns: *[], exchangeOrder: *[], botData: {}, averageCards: *[], debug: boolean, players: *[], actionsNum: null, camp: T[], winner: null, campDecks: ({tier: number, name: number, description: string}|null)[][], playersOrder: *[], marketCoinsUnique: *[]})|*), phases: {placeCoins: {next: string, onBegin: BoardGame.phases.placeCoins.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): string)|*), BotsPlaceAllCoins: BotsPlaceAllCoins, ClickBoardCoin: ((function(*=, *=, *=): string)|*)}, start: boolean, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, placeCoinsUline: {onBegin: BoardGame.phases.placeCoinsUline.onBegin, moves: {ClickHandCoin: ((function(*, *, *=): string)|*), ClickBoardCoin: ((function(*=, *=, *=): string)|*)}, turn: {order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, pickCards: {onBegin: BoardGame.phases.pickCards.onBegin, onEnd: BoardGame.phases.pickCards.onEnd, moves: {ClickCard: ((function(*=, *=, *=): (string|*))|*), ClickCampCard: ((function(*=, *=, *=): (string|*))|*)}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, discardCard: {moves: {DiscardCard2Players: ((function(*=, *=, *=): *)|*)}}, pickDiscardCard: {moves: {PickDiscardCard: ((function(*=, *=, *=): *)|*)}}, discardCardFromBoard: {moves: {DiscardCard: ((function(*=, *=, *=, *=): *)|*)}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((function(*=, *=, *=, *=): *)|*)}}, placeTradingCoinsUline: {moves: {ClickHandCoin: ((function(*, *, *=): string)|*), ClickBoardCoin: ((function(*=, *=, *=): string)|*)}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string|*))|*)}}, addCoinToPouch: {moves: {AddCoinToPouch: ((function(*=, *=, *=): (string|*))|*)}}, placeCards: {moves: {PlaceCard: ((function(*=, *=, *=): *)|*)}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((function(*=, *=, *=): (string|*))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, getDistinctions: {next: string, onBegin: BoardGame.phases.getDistinctions.onBegin, onEnd: BoardGame.phases.getDistinctions.onEnd, moves: {ClickDistinctionCard: ((function(*=, *=, *=): string)|*)}, endIf: (function(*): *), turn: {stages: {upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickDistinctionCard: {moves: {ClickCardToPickDistinction: ((function(*=, *=, *=): *)|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, enlistmentMercenaries: {onBegin: BoardGame.phases.enlistmentMercenaries.onBegin, moves: {PassEnlistmentMercenaries: ((function(*=, *=): *)|*), GetEnlistmentMercenaries: ((function(*=, *=, *=): *)|*), StartEnlistmentMercenaries: ((function(*=, *=): *)|*), PlaceEnlistmentMercenaries: ((function(*=, *=, *=): *)|*)}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickDiscardCard: {moves: {PickDiscardCard: ((function(*=, *=, *=): *)|*)}}, discardCardFromBoard: {moves: {DiscardCard: ((function(*=, *=, *=, *=): *)|*)}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((function(*=, *=, *=, *=): *)|*)}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string|*))|*)}}, addCoinToPouch: {moves: {AddCoinToPouch: ((function(*=, *=, *=): (string|*))|*)}}, placeCards: {moves: {PlaceCard: ((function(*=, *=, *=): *)|*)}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((function(*=, *=, *=): (string|*))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}, endTier: {moves: {PlaceCard: ((function(*=, *=, *=): *)|*), GetMjollnirProfit: ((function(*=, *=, *=): *)|*), DiscardCardFromPlayerBoard: ((function(*=, *=, *=, *=): *)|*)}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickDiscardCard: {moves: {PickDiscardCard: ((function(*=, *=, *=): *)|*)}}, discardCardFromBoard: {moves: {DiscardCard: ((function(*=, *=, *=, *=): *)|*)}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((function(*=, *=, *=, *=): *)|*)}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((function(*=, *=, *=, *=, *=): (string|*))|*)}}, pickHero: {moves: {ClickHeroCard: ((function(*=, *=, *=): (string|*))|*)}}, addCoinToPouch: {moves: {AddCoinToPouch: ((function(*=, *=, *=): (string|*))|*)}}, placeCards: {moves: {PlaceCard: ((function(*=, *=, *=): *)|*)}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((function(*=, *=, *=): (string|*))|*)}}}, order: {next: (function(*, *)), first: (function(): number), playOrder: (function(*): []|*)}}}}}} Игра.
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
                    if (G.players[i].buffs["everyTurn"] !== "Uline") {
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
                    if (G.players[i].buffs["everyTurn"] === "Uline") {
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
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
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
        enlistmentMercenaries: {
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
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
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
                StartEnlistmentMercenaries,
                PassEnlistmentMercenaries,
                GetEnlistmentMercenaries,
                PlaceEnlistmentMercenaries,
            },
            onBegin: (G, ctx) => {
                const players = G.players.map(player => player),
                    playersIndexes = [];
                players.sort((nextPlayer, currentPlayer) => {
                    if (nextPlayer.campCards.filter(card => card.type === "наёмник").length <
                        currentPlayer.campCards.filter(card => card.type === "наёмник").length) {
                        return 1;
                    } else if (nextPlayer.campCards.filter(card => card.type === "наёмник").length >
                        currentPlayer.campCards.filter(card => card.type === "наёмник").length) {
                        return -1;
                    }
                    if (nextPlayer.priority.value < currentPlayer.priority.value) {
                        return 1;
                    } else if (nextPlayer.priority.value > currentPlayer.priority.value) {
                        return -1;
                    }
                    return 0;
                });
                players.forEach(playerSorted => {
                    if (playerSorted.campCards.filter(card => card.type === "наёмник").length) {
                        playersIndexes.push(G.players.findIndex(player => player.nickname === playerSorted.nickname));
                    }
                });
                G.playersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.playersOrder.push(playersIndexes[0]);
                }
                const stack = [
                    {
                        actionName: "DrawProfitAction",
                        playerId: G.playersOrder[0],
                        config: {
                            name: "startOrPassEnlistmentMercenaries",
                            drawName: "Start or Pass Enlistment Mercenaries",
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
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
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
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
                PlaceCard,
            },
        },
        getMjollnirProfit: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % G.playersOrder.length,
                    playOrder: (G) => G.playersOrder,
                },
            },
            moves: {
                GetMjollnirProfit,
            },
        },
        brisingamensEndGame: {
            turn: {
                order: {
                    first: () => 0,
                    next: (G, ctx) => (ctx.playOrderPos + 1) % G.playersOrder.length,
                    playOrder: (G) => G.playersOrder,
                },
            },
            moves: {
                DiscardCardFromPlayerBoard,
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
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
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
