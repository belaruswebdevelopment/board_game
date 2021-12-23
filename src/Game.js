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
import { DrawProfitCampAction } from "./actions/CampActions";
import { RusCardTypes } from "./Card";
import { DrawNames } from "./actions/Actions";
/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export var Phases;
(function (Phases) {
    Phases["BrisingamensEndGame"] = "brisingamensEndGame";
    Phases["EndTier"] = "endTier";
    Phases["EnlistmentMercenaries"] = "enlistmentMercenaries";
    Phases["GetDistinctions"] = "getDistinctions";
    Phases["GetMjollnirProfit"] = "getMjollnirProfit";
    Phases["PickCards"] = "pickCards";
    Phases["PlaceCoins"] = "placeCoins";
    Phases["PlaceCoinsUline"] = "placeCoinsUline";
})(Phases || (Phases = {}));
/**
 * <h3>Перечисление для стейджей игры.</h3>
 */
export var Stages;
(function (Stages) {
    Stages["AddCoinToPouch"] = "addCoinToPouch";
    Stages["DiscardCard"] = "discardCard";
    Stages["DiscardCardFromBoard"] = "discardCardFromBoard";
    Stages["DiscardSuitCard"] = "discardSuitCard";
    Stages["PickCampCardHolda"] = "pickCampCardHolda";
    Stages["PickDiscardCard"] = "pickDiscardCard";
    Stages["PickDistinctionCard"] = "pickDistinctionCard";
    Stages["PickHero"] = "pickHero";
    Stages["PlaceCards"] = "placeCards";
    Stages["PlaceTradingCoinsUline"] = "placeTradingCoinsUline";
    Stages["UpgradeCoin"] = "upgradeCoin";
    Stages["UpgradeCoinVidofnirVedrfolnir"] = "upgradeCoinVidofnirVedrfolnir";
})(Stages || (Stages = {}));
// todo Add logging
// todo Add colors for cards Points by suit colors!
const order = {
    first: () => 0,
    next: (G, ctx) => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
    playOrder: (G) => G.publicPlayersOrder.map((order) => String(order)),
};
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
export const BoardGame = {
    name: `nidavellir`,
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order,
            },
            start: true,
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
            },
            next: Phases.PickCards,
            onBegin: (G, ctx) => {
                G.currentTavern = -1;
                if (ctx.turn !== 0) {
                    ReturnCoinsToPlayerHands(G);
                }
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        placeCoinsUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
            },
            onBegin: (G, ctx) => {
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        pickCards: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2PlayersMove,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoinMove,
                            ClickBoardCoinMove,
                        },
                    },
                },
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
            },
            onBegin: (G, ctx) => {
                G.currentTavern++;
                const { playersOrder, exchangeOrder } = ResolveBoardCoins(G, ctx);
                [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
                ChangePlayersPriorities(G);
            },
        },
        enlistmentMercenaries: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G, ctx) => {
                const players = G.publicPlayers.map((player) => player), playersIndexes = [];
                players.sort((nextPlayer, currentPlayer) => {
                    if (nextPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length < currentPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                        return 1;
                    }
                    else if (nextPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length > currentPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
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
                players.forEach((playerSorted) => {
                    if (playerSorted.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex((player) => player.nickname === playerSorted.nickname));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                const stack = [
                    {
                        action: DrawProfitCampAction.name,
                        playerId: G.publicPlayersOrder[0],
                        config: {
                            name: `startOrPassEnlistmentMercenaries`,
                            drawName: DrawNames.StartOrPassEnlistmentMercenaries,
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            },
        },
        endTier: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCardMove,
            },
        },
        getMjollnirProfit: {
            turn: {
                order,
            },
            moves: {
                GetMjollnirProfitMove,
            },
        },
        brisingamensEndGame: {
            turn: {
                order,
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
        },
        getDistinctions: {
            turn: {
                order,
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                },
            },
            next: Phases.PlaceCoins,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G, ctx) => {
                CheckDistinction(G, ctx);
                const distinctions = Object.values(G.distinctions).filter((distinction) => distinction !== null && distinction !== undefined);
                if (distinctions.every((distinction) => distinction !== null && distinction !== undefined)) {
                    G.publicPlayersOrder = distinctions;
                }
            },
            onEnd: (G) => {
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
                RefillTaverns(G);
            },
            endIf: (G) => Object.values(G.distinctions).every((distinction) => distinction === undefined),
        },
    },
    onEnd: (G, ctx) => {
        return ScoreWinner(G, ctx);
    },
    ai: {
        //@ts-ignore
        enumerate,
        iterations,
        objectives,
        playoutDepth,
    },
};
