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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                // [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    if (nextPlayer.campCards.filter(function (card) { return card.type === "наёмник"; })
                        .length <
                        currentPlayer.campCards.filter(function (card) { return card.type === "наёмник"; })
                            .length) {
                        return 1;
                    }
                    else if (nextPlayer.campCards.filter(function (card) { return card.type === "наёмник"; })
                        .length >
                        currentPlayer.campCards.filter(function (card) { return card.type === "наёмник"; })
                            .length) {
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
                    if (playerSorted.campCards.filter(function (card) {
                        return card.type === "наёмник";
                    }).length) {
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                    playOrder: function (G) { return G.publicPlayersOrder
                        .map(function (order) { return String(order); }); },
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
                var distinctions = G.distinctions
                    .filter(function (distinction) { return distinction !== undefined; });
                if (distinctions.every(function (distinction) {
                    return typeof distinction === "number";
                })) {
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
            endIf: function (G) { return G.distinctions
                .every(function (distinction) { return distinction === undefined; }); },
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
