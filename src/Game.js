import { SetupGame } from "./GameSetup";
import { ClickCard, ClickCardToPickDistinction, ClickDistinctionCard, GetEnlistmentMercenaries, PassEnlistmentMercenaries, PickDiscardCard, PlaceEnlistmentMercenaries, StartEnlistmentMercenaries, } from "./moves/Moves";
import { ChangePlayersPriorities } from "./Priority";
import { ScoreWinner } from "./Score";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { ReturnCoinsToPlayerHands } from "./Coin";
import { RefillTaverns } from "./Tavern";
import { RefillCamp } from "./Camp";
import { ClickHeroCard, DiscardCard, PlaceCard, } from "./moves/HeroMoves";
import { AddCoinToPouch, ClickBoardCoin, ClickCoinToUpgrade, ClickHandCoin, UpgradeCoinVidofnirVedrfolnir } from "./moves/CoinMoves";
import { ClickCampCard, ClickCampCardHolda, DiscardCard2Players, DiscardCardFromPlayerBoard, DiscardSuitCardFromPlayerBoard, GetMjollnirProfit } from "./moves/CampMoves";
import { AddActionsToStack } from "./helpers/StackHelpers";
import { BotsPlaceAllCoins } from "./moves/BotMoves";
import { ResolveBoardCoins } from "./helpers/CoinHelpers";
import { PlayerView } from "boardgame.io/core";
import { CheckDistinction } from "./Distinction";
import { CheckPlayersBasicOrder } from "./Player";
// todo Add logging
// todo Add colors for cards Points by suit colors!
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 *
 * @type {{onEnd: (G: MyGameState, ctx: Ctx) => MyGameState | void, name: string, ai: {playoutDepth: (G: MyGameState, ctx: Ctx) => number, enumerate: (G: MyGameState, ctx: Ctx) => IMoves[], objectives: () => {isEarlyGame: {weight: number, checker: (G: MyGameState) => boolean}, isFirst: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}, isStronger: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}}, iterations: (G: MyGameState, ctx: Ctx) => number}, setup: (ctx: Ctx) => MyGameState, playerView: (G: any, ctx: Ctx, playerID: string) => any, phases: {placeCoins: {next: string, onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, BotsPlaceAllCoins: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, start: boolean, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, placeCoinsUline: {onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, getMjollnirProfit: {moves: {GetMjollnirProfit: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, brisingamensEndGame: {moves: {DiscardCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, pickCards: {onBegin: (G: MyGameState, ctx: Ctx) => void, onEnd: (G) => void, moves: {ClickCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickCampCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCard: {moves: {DiscardCard2Players: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeTradingCoinsUline: {moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, getDistinctions: {next: string, onBegin: (G: MyGameState, ctx: Ctx) => void, onEnd: (G: MyGameState) => void, moves: {ClickDistinctionCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, endIf: (G: MyGameState) => boolean, turn: {stages: {upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDistinctionCard: {moves: {ClickCardToPickDistinction: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, enlistmentMercenaries: {onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {PassEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, GetEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, StartEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, PlaceEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, endTier: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}}}}
 */
export var BoardGame = {
    name: "nidavellir",
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
            },
            start: true,
            moves: {
                ClickHandCoin: ClickHandCoin,
                ClickBoardCoin: ClickBoardCoin,
                BotsPlaceAllCoins: BotsPlaceAllCoins,
            },
            next: "pickCards",
            onBegin: function (G, ctx) {
                G.currentTavern = -1;
                if (ctx.turn !== 0) {
                    ReturnCoinsToPlayerHands(G);
                }
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        placeCoinsUline: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
            },
            moves: {
                ClickHandCoin: ClickHandCoin,
                ClickBoardCoin: ClickBoardCoin,
            },
            onBegin: function (G, ctx) {
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        pickCards: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCard,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2Players: DiscardCard2Players,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin: ClickHandCoin,
                            ClickBoardCoin: ClickBoardCoin,
                        },
                    },
                },
            },
            moves: {
                ClickCard: ClickCard,
                ClickCampCard: ClickCampCard,
            },
            onBegin: function (G, ctx) {
                G.currentTavern++;
                var _a = ResolveBoardCoins(G, ctx), playersOrder = _a.playersOrder, exchangeOrder = _a.exchangeOrder;
                // [G.publicPlayersOrder, G.exchangeOrder]: number[] = [playersOrder, exchangeOrder];
                G.publicPlayersOrder = playersOrder;
                G.exchangeOrder = exchangeOrder;
            },
            onEnd: function (G) {
                ChangePlayersPriorities(G);
            },
        },
        enlistmentMercenaries: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCard,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenaries: StartEnlistmentMercenaries,
                PassEnlistmentMercenaries: PassEnlistmentMercenaries,
                GetEnlistmentMercenaries: GetEnlistmentMercenaries,
                PlaceEnlistmentMercenaries: PlaceEnlistmentMercenaries,
            },
            onBegin: function (G, ctx) {
                var players = G.publicPlayers.map(function (player) { return player; }), playersIndexes = [];
                players.sort(function (nextPlayer, currentPlayer) {
                    if (nextPlayer.campCards
                        .filter(function (card) { return card.type === "наёмник"; }).length <
                        currentPlayer.campCards
                            .filter(function (card) { return card.type === "наёмник"; }).length) {
                        return 1;
                    }
                    else if (nextPlayer.campCards
                        .filter(function (card) { return card.type === "наёмник"; }).length >
                        currentPlayer.campCards
                            .filter(function (card) { return card.type === "наёмник"; }).length) {
                        return -1;
                    }
                    if (nextPlayer.priority.value < currentPlayer.priority.value) {
                        return 1;
                    }
                    else if (nextPlayer.priority.value > currentPlayer.priority.value) {
                        return -1;
                    }
                    return 0;
                });
                players.forEach(function (playerSorted) {
                    if (playerSorted.campCards
                        .filter(function (card) { return card.type === "наёмник"; }).length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex(function (player) { return player.nickname === playerSorted.nickname; }));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                var stack = [
                    {
                        actionName: "DrawProfitAction",
                        playerId: G.publicPlayersOrder[0],
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
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCard,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCard: PlaceCard,
            },
        },
        getMjollnirProfit: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
            },
            moves: {
                GetMjollnirProfit: GetMjollnirProfit,
            },
        },
        brisingamensEndGame: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
            },
            moves: {
                DiscardCardFromPlayerBoard: DiscardCardFromPlayerBoard,
            },
        },
        getDistinctions: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) {
                        return G.publicPlayersOrder.map(function (order) { return String(order); });
                    },
                },
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinction: ClickCardToPickDistinction,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgrade,
                        },
                    },
                },
            },
            next: "placeCoins",
            moves: {
                ClickDistinctionCard: ClickDistinctionCard,
            },
            onBegin: function (G, ctx) {
                CheckDistinction(G, ctx);
                var distinctions = G.distinctions.filter(function (distinction) { return distinction !== undefined; });
                if (distinctions
                    .every(function (distinction) { return typeof distinction === "number"; })) {
                    G.publicPlayersOrder = distinctions;
                }
            },
            onEnd: function (G) {
                G.distinctions = Array(G.suitsNum).fill(undefined);
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
                RefillTaverns(G);
            },
            endIf: function (G) {
                return G.distinctions.every(function (distinction) { return distinction === undefined; });
            },
        },
    },
    onEnd: function (G, ctx) {
        return ScoreWinner(G, ctx);
    },
    ai: {
        enumerate: enumerate,
        objectives: objectives,
        iterations: iterations,
        playoutDepth: playoutDepth,
    },
};
