"use strict";
exports.__esModule = true;
exports.BoardGame = void 0;
var GameSetup_1 = require("./GameSetup");
var Moves_1 = require("./moves/Moves");
var Priority_1 = require("./Priority");
var Score_1 = require("./Score");
var AI_1 = require("./AI");
var Coin_1 = require("./Coin");
var Tavern_1 = require("./Tavern");
var Camp_1 = require("./Camp");
var HeroMoves_1 = require("./moves/HeroMoves");
var CoinMoves_1 = require("./moves/CoinMoves");
var CampMoves_1 = require("./moves/CampMoves");
var StackHelpers_1 = require("./helpers/StackHelpers");
var BotMoves_1 = require("./moves/BotMoves");
var CoinHelpers_1 = require("./helpers/CoinHelpers");
var core_1 = require("boardgame.io/core");
var Distiction_1 = require("./Distiction");
var Player_1 = require("./Player");
// todo Add logging
// todo Add colors for cards Points by suit colors!
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
exports.BoardGame = {
    name: "nidavellir",
    setup: GameSetup_1.SetupGame,
    playerView: core_1.PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                }
            },
            start: true,
            moves: {
                ClickHandCoin: CoinMoves_1.ClickHandCoin,
                ClickBoardCoin: CoinMoves_1.ClickBoardCoin,
                BotsPlaceAllCoins: BotMoves_1.BotsPlaceAllCoins
            },
            next: "pickCards",
            onBegin: function (G, ctx) {
                G.currentTavern = -1;
                if (ctx.turn !== 0) {
                    (0, Coin_1.ReturnCoinsToPlayerHands)(G);
                }
                (0, Player_1.CheckPlayersBasicOrder)(G, ctx);
            }
        },
        placeCoinsUline: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                }
            },
            moves: {
                ClickHandCoin: CoinMoves_1.ClickHandCoin,
                ClickBoardCoin: CoinMoves_1.ClickBoardCoin
            },
            onBegin: function (G, ctx) {
                (0, Player_1.CheckPlayersBasicOrder)(G, ctx);
            }
        },
        pickCards: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % ctx.numPlayers; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: HeroMoves_1.DiscardCard
                        }
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: HeroMoves_1.PlaceCard
                        }
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: CampMoves_1.ClickCampCardHolda
                        }
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: Moves_1.PickDiscardCard
                        }
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: CoinMoves_1.AddCoinToPouch
                        }
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: CoinMoves_1.UpgradeCoinVidofnirVedrfolnir
                        }
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: CampMoves_1.DiscardSuitCardFromPlayerBoard
                        }
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: CoinMoves_1.ClickCoinToUpgrade
                        }
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: HeroMoves_1.ClickHeroCard
                        }
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2Players: CampMoves_1.DiscardCard2Players
                        }
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin: CoinMoves_1.ClickHandCoin,
                            ClickBoardCoin: CoinMoves_1.ClickBoardCoin
                        }
                    }
                }
            },
            moves: {
                ClickCard: Moves_1.ClickCard,
                ClickCampCard: CampMoves_1.ClickCampCard
            },
            onBegin: function (G, ctx) {
                var _a;
                G.currentTavern++;
                var _b = (0, CoinHelpers_1.ResolveBoardCoins)(G, ctx), playersOrder = _b.playersOrder, exchangeOrder = _b.exchangeOrder;
                _a = [playersOrder, exchangeOrder], G.publicPlayersOrder = _a[0], G.exchangeOrder = _a[1];
            },
            onEnd: function (G) {
                (0, Priority_1.ChangePlayersPriorities)(G);
            }
        },
        enlistmentMercenaries: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: HeroMoves_1.DiscardCard
                        }
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: HeroMoves_1.PlaceCard
                        }
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: CampMoves_1.ClickCampCardHolda
                        }
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: Moves_1.PickDiscardCard
                        }
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: CoinMoves_1.AddCoinToPouch
                        }
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: CoinMoves_1.UpgradeCoinVidofnirVedrfolnir
                        }
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: CampMoves_1.DiscardSuitCardFromPlayerBoard
                        }
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: CoinMoves_1.ClickCoinToUpgrade
                        }
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: HeroMoves_1.ClickHeroCard
                        }
                    }
                }
            },
            moves: {
                StartEnlistmentMercenaries: Moves_1.StartEnlistmentMercenaries,
                PassEnlistmentMercenaries: Moves_1.PassEnlistmentMercenaries,
                GetEnlistmentMercenaries: Moves_1.GetEnlistmentMercenaries,
                PlaceEnlistmentMercenaries: Moves_1.PlaceEnlistmentMercenaries
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
                    if (nextPlayer.priority && currentPlayer.priority) {
                        if (nextPlayer.priority.value < currentPlayer.priority.value) {
                            return 1;
                        }
                        else if (nextPlayer.priority.value > currentPlayer.priority.value) {
                            return -1;
                        }
                    }
                    return 0;
                });
                players.forEach(function (playerSorted) {
                    if (playerSorted.campCards.filter(function (card) {
                        return card.type === "наёмник";
                    }).length) {
                        playersIndexes.push(G.publicPlayers.findIndex(function (player) { return player.nickname ===
                            playerSorted.nickname; }));
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
                            drawName: "Start or Pass Enlistment Mercenaries"
                        }
                    },
                ];
                (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
            }
        },
        endTier: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: HeroMoves_1.DiscardCard
                        }
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: HeroMoves_1.PlaceCard
                        }
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: CampMoves_1.ClickCampCardHolda
                        }
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: Moves_1.PickDiscardCard
                        }
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: CoinMoves_1.AddCoinToPouch
                        }
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: CoinMoves_1.UpgradeCoinVidofnirVedrfolnir
                        }
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: CampMoves_1.DiscardSuitCardFromPlayerBoard
                        }
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: CoinMoves_1.ClickCoinToUpgrade
                        }
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: HeroMoves_1.ClickHeroCard
                        }
                    }
                }
            },
            moves: {
                PlaceCard: HeroMoves_1.PlaceCard
            }
        },
        getMjollnirProfit: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                }
            },
            moves: {
                GetMjollnirProfit: CampMoves_1.GetMjollnirProfit
            }
        },
        brisingamensEndGame: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                }
            },
            moves: {
                DiscardCardFromPlayerBoard: CampMoves_1.DiscardCardFromPlayerBoard
            }
        },
        getDistinctions: {
            turn: {
                order: {
                    first: function () { return 0; },
                    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
                    playOrder: function (G) { return G.publicPlayersOrder.map(function (order) { return String(order); }); }
                },
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinction: Moves_1.ClickCardToPickDistinction
                        }
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: CoinMoves_1.ClickCoinToUpgrade
                        }
                    }
                }
            },
            next: "placeCoins",
            moves: {
                ClickDistinctionCard: Moves_1.ClickDistinctionCard
            },
            onBegin: function (G, ctx) {
                (0, Distiction_1.CheckDistinction)(G, ctx);
                var distinctions = G.distinctions.filter(function (i) { return i !== undefined; });
                if (distinctions.every(function (distinction) { return typeof distinction === "number"; })) {
                    G.publicPlayersOrder = distinctions;
                }
            },
            onEnd: function (G) {
                G.distinctions = Array(G.suitsNum).fill(undefined);
                if (G.expansions.thingvellir.active) {
                    (0, Camp_1.RefillCamp)(G);
                }
                (0, Tavern_1.RefillTaverns)(G);
            },
            endIf: function (G) { return G.distinctions.every(function (distinction) { return distinction === undefined; }); }
        }
    },
    onEnd: function (G, ctx) {
        return (0, Score_1.ScoreWinner)(G, ctx);
    },
    ai: {
        enumerate: AI_1.enumerate,
        objectives: AI_1.objectives,
        iterations: AI_1.iterations,
        playoutDepth: AI_1.playoutDepth
    }
};
