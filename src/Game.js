import { SetupGame } from "./GameSetup";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, GetEnlistmentMercenariesMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { ChangePlayersPriorities } from "./Priority";
import { ScoreWinner } from "./Score";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { ReturnCoinsToPlayerHands } from "./Coin";
import { RefillTaverns } from "./Tavern";
import { RefillCamp } from "./Camp";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove, } from "./moves/HeroMoves";
import { AddCoinToPouchMove, ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CoinMoves";
import { ClickCampCardMove, ClickCampCardHoldaMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, DiscardSuitCardFromPlayerBoardMove, GetMjollnirProfitMove } from "./moves/CampMoves";
import { AddActionsToStack } from "./helpers/StackHelpers";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { ResolveBoardCoins } from "./helpers/CoinHelpers";
import { PlayerView } from "boardgame.io/core";
import { CheckDistinction } from "./Distinction";
import { CheckPlayersBasicOrder } from "./Player";
// todo Add logging
// todo Add colors for cards Points by suit colors!
var order = {
    first: function () { return 0; },
    next: function (G, ctx) { return (ctx.playOrderPos + 1) % G.publicPlayersOrder.length; },
    playOrder: function (G) {
        return G.publicPlayersOrder.map(function (order) { return String(order); });
    },
};
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
                order: order,
            },
            start: true,
            moves: {
                ClickHandCoinMove: ClickHandCoinMove,
                ClickBoardCoinMove: ClickBoardCoinMove,
                BotsPlaceAllCoinsMove: BotsPlaceAllCoinsMove,
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
                order: order,
            },
            moves: {
                ClickHandCoinMove: ClickHandCoinMove,
                ClickBoardCoinMove: ClickBoardCoinMove,
            },
            onBegin: function (G, ctx) {
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        pickCards: {
            turn: {
                order: order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove: ClickHeroCardMove,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2PlayersMove: DiscardCard2PlayersMove,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoinMove: ClickHandCoinMove,
                            ClickBoardCoinMove: ClickBoardCoinMove,
                        },
                    },
                },
            },
            moves: {
                ClickCardMove: ClickCardMove,
                ClickCampCardMove: ClickCampCardMove,
            },
            onBegin: function (G, ctx) {
                var _a;
                G.currentTavern++;
                var _b = ResolveBoardCoins(G, ctx), playersOrder = _b.playersOrder, exchangeOrder = _b.exchangeOrder;
                _a = [playersOrder, exchangeOrder], G.publicPlayersOrder = _a[0], G.exchangeOrder = _a[1];
            },
            onEnd: function (G) {
                ChangePlayersPriorities(G);
            },
        },
        enlistmentMercenaries: {
            turn: {
                order: order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove: ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenariesMove: StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove: PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove: GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove: PlaceEnlistmentMercenariesMove,
            },
            onBegin: function (G, ctx) {
                var players = G.publicPlayers.map(function (player) { return player; }), playersIndexes = [];
                players.sort(function (nextPlayer, currentPlayer) {
                    if (nextPlayer.campCards
                        .filter(function (card) { return card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A"; }).length <
                        currentPlayer.campCards
                            .filter(function (card) { return card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A"; }).length) {
                        return 1;
                    }
                    else if (nextPlayer.campCards
                        .filter(function (card) { return card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A"; }).length >
                        currentPlayer.campCards
                            .filter(function (card) { return card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A"; }).length) {
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
                        .filter(function (card) { return card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A"; }).length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex(function (player) {
                            return player.nickname === playerSorted.nickname;
                        }));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                var stack = [
                    {
                        action: "DrawProfitAction",
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
                order: order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove: ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCardMove: PlaceCardMove,
            },
        },
        getMjollnirProfit: {
            turn: {
                order: order,
            },
            moves: {
                GetMjollnirProfitMove: GetMjollnirProfitMove,
            },
        },
        brisingamensEndGame: {
            turn: {
                order: order,
            },
            moves: {
                DiscardCardFromPlayerBoardMove: DiscardCardFromPlayerBoardMove,
            },
        },
        getDistinctions: {
            turn: {
                order: order,
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove: ClickCardToPickDistinctionMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove: ClickCoinToUpgradeMove,
                        },
                    },
                },
            },
            next: "placeCoins",
            moves: {
                ClickDistinctionCardMove: ClickDistinctionCardMove,
            },
            onBegin: function (G, ctx) {
                CheckDistinction(G, ctx);
                var distinctions = G.distinctions.filter(function (distinction) {
                    return distinction !== null && distinction !== undefined;
                });
                if (distinctions.every(function (distinction) {
                    return distinction !== null && distinction !== undefined;
                })) {
                    G.publicPlayersOrder = distinctions;
                }
            },
            onEnd: function (G) {
                // todo Useless action because all distinctions are undefined?
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
        //@ts-ignore
        enumerate: enumerate,
        objectives: objectives,
        iterations: iterations,
        playoutDepth: playoutDepth,
    },
};
