import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckBrisingamensEndGameOrder, EndBrisingamensEndGameActions, OnBrisingamensEndGamePhaseTurnBegin, StartGetMjollnirProfitOrEndGame } from "./hooks/BrisingamensEndGameHooks";
import { CheckEndEndTierPhase, CheckEndTierOrder, EndEndTierActions, OnEndTierPhaseTurnBegin } from "./hooks/EndTierHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesPhaseTurnBegin, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { ReturnEndGameData } from "./hooks/GameHooks";
import { CheckAndResolveDistinctionOrders, CheckEndDistinctionsPhase, CheckNextDistinctionTurn, EndDistinctionPhaseActions } from "./hooks/GetDistinctionsHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitPhaseTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckAndStartTrading, CheckEndPickCardsPhase, CheckEndPickCardsTurn, EndPickCardsActions, PickCardsDiscardCardsAfterLastPlayerTurnEnd, ResolveCurrentTavernOrders } from "./hooks/PickCardsHooks";
import { CheckEndPlaceCoinsPhase, CheckEndPlaceCoinsTurn, EndPlaceCoinsActions, PreparationPhaseActions } from "./hooks/PlaceCoinsHooks";
import { CheckEndPlaceCoinsUlinePhase, CheckUlinePlaceCoinsOrder, EndPlaceCoinsUlineActions } from "./hooks/PlaceCoinsUlineHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { ClickCampCardHoldaMove, ClickCampCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, DiscardSuitCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/CampMoves";
import { AddCoinToPouchMove, ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CoinMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, PassEnlistmentMercenariesMove, PickDiscardCardMove } from "./moves/Moves";
import { Phases } from "./typescript/enums";
// TODO Add logging
// TODO Add colors for cards Points by suit colors!
// TODO Add dock block
/**
 * <h3>Параметры порядка хода.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При определении хода в каждую фазу игры.</li>
 * </ol>
 */
const order = TurnOrder.CUSTOM_FROM(`publicPlayersOrder`);
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
export const BoardGame = {
    // TODO Add all hooks external functions to all {}
    // TODO Check all endPhase/setPhase & next (may be with G.condition ? 'phaseC' : 'phaseB') in it => add next or better move to hooks functions
    name: `nidavellir`,
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order,
                endIf: (G, ctx) => CheckEndPlaceCoinsTurn(G, ctx),
            },
            start: true,
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
            },
            onBegin: (G, ctx) => PreparationPhaseActions(G, ctx),
            endIf: (G, ctx) => CheckEndPlaceCoinsPhase(G, ctx),
            onEnd: (G) => EndPlaceCoinsActions(G),
        },
        placeCoinsUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
            },
            next: Phases.PickCards,
            onBegin: (G, ctx) => CheckUlinePlaceCoinsOrder(G, ctx),
            endIf: (G) => CheckEndPlaceCoinsUlinePhase(G),
            onEnd: (G) => EndPlaceCoinsUlineActions(G),
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
                onMove: (G, ctx) => CheckAndStartTrading(G, ctx),
                endIf: (G, ctx) => CheckEndPickCardsTurn(G, ctx),
                onEnd: (G, ctx) => PickCardsDiscardCardsAfterLastPlayerTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
            },
            onBegin: (G, ctx) => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G, ctx) => CheckEndPickCardsPhase(G, ctx),
            onEnd: (G) => EndPickCardsActions(G),
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
                onBegin: (G, ctx) => OnEnlistmentMercenariesPhaseTurnBegin(G, ctx),
                endIf: (G, ctx) => CheckEndEnlistmentMercenariesTurn(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G) => PrepareMercenaryPhaseOrders(G),
            endIf: (G, ctx) => CheckEndEnlistmentMercenariesPhase(G, ctx),
            onEnd: (G) => EndEnlistmentMercenariesActions(G),
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
                onBegin: (G, ctx) => OnEndTierPhaseTurnBegin(G, ctx),
            },
            moves: {
                PlaceCardMove,
            },
            onBegin: (G) => CheckEndTierOrder(G),
            endIf: (G, ctx) => CheckEndEndTierPhase(G, ctx),
            onEnd: (G) => EndEndTierActions(G),
        },
        getDistinctions: {
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
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                },
                endIf: (G, ctx) => CheckNextDistinctionTurn(G, ctx),
            },
            next: Phases.PlaceCoins,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G, ctx) => CheckAndResolveDistinctionOrders(G, ctx),
            endIf: (G, ctx) => CheckEndDistinctionsPhase(G, ctx),
            onEnd: (G) => EndDistinctionPhaseActions(G),
        },
        brisingamensEndGame: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnBrisingamensEndGamePhaseTurnBegin(G, ctx),
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
            onBegin: (G) => CheckBrisingamensEndGameOrder(G),
            endIf: (G, ctx) => StartGetMjollnirProfitOrEndGame(G, ctx),
            onEnd: (G) => EndBrisingamensEndGameActions(G),
        },
        getMjollnirProfit: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnGetMjollnirProfitPhaseTurnBegin(G, ctx),
            },
            moves: {
                GetMjollnirProfitMove,
            },
            onBegin: (G) => CheckGetMjollnirProfitOrder(G),
            endIf: (G) => CheckEndGetMjollnirProfitPhase(G),
            onEnd: (G, ctx) => StartEndGame(G, ctx),
        },
    },
    onEnd: (G, ctx) => ReturnEndGameData(G, ctx),
    ai: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        enumerate,
        iterations,
        objectives,
        playoutDepth,
    },
};
//# sourceMappingURL=Game.js.map