import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckBrisingamensEndGameOrder, EndBrisingamensEndGameActions, OnBrisingamensEndGameTurnBegin, StartGetMjollnirProfitOrEndGame } from "./hooks/BrisingamensEndGameHooks";
import { CheckEndEndTierPhase, CheckEndTierOrder, EndEndTierActions, OnEndTierMove, OnEndTierTurnBegin, OnEndTierTurnEnd } from "./hooks/EndTierHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, OnEnlistmentMercenariesTurnEnd, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckAndResolveDistinctionsOrders, CheckEndGetDistinctionsPhase, CheckNextGetDistinctionsTurn, EndGetDistinctionsPhaseActions, OnGetDistinctionsMove, OnGetDistinctionsTurnBegin, OnGetDistinctionsTurnEnd } from "./hooks/GetDistinctionsHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckEndPickCardsPhase, CheckEndPickCardsTurn, EndPickCardsActions, OnPickCardsMove, OnPickCardsTurnBegin, OnPickCardsTurnEnd, ResolveCurrentTavernOrders } from "./hooks/PickCardsHooks";
import { CheckEndPlaceCoinsPhase, CheckEndPlaceCoinsTurn, OnPlaceCoinsTurnEnd, PreparationPhaseActions } from "./hooks/PlaceCoinsHooks";
import { CheckEndPlaceCoinsUlinePhase, CheckUlinePlaceCoinsOrder, EndPlaceCoinsUlineActions } from "./hooks/PlaceCoinsUlineHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove } from "./moves/CoinMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { Phases, Stages } from "./typescript/enums";
// TODO Add logging
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
        [Phases.PlaceCoins]: {
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
            onEnd: (G) => OnPlaceCoinsTurnEnd(G),
        },
        [Phases.PlaceCoinsUline]: {
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
        [Phases.PickCards]: {
            turn: {
                order,
                stages: {
                    // Start
                    [Stages.AddCoinToPouch]: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    [Stages.DiscardBoardCard]: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    [Stages.DiscardSuitCard]: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    [Stages.PickCampCardHolda]: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    [Stages.PickDiscardCard]: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    [Stages.PickHero]: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    [Stages.PlaceCards]: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    [Stages.UpgradeCoin]: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    [Stages.UpgradeVidofnirVedrfolnirCoin]: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    [Stages.DiscardCard]: {
                        moves: {
                            DiscardCard2PlayersMove,
                        },
                    },
                    [Stages.PlaceTradingCoinsUline]: {
                        moves: {
                            ClickHandCoinMove,
                            ClickBoardCoinMove,
                        },
                    },
                },
                onBegin: (G, ctx) => OnPickCardsTurnBegin(G, ctx),
                onMove: (G, ctx) => OnPickCardsMove(G, ctx),
                endIf: (G, ctx) => CheckEndPickCardsTurn(G, ctx),
                onEnd: (G, ctx) => OnPickCardsTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
            },
            onBegin: (G, ctx) => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G, ctx) => CheckEndPickCardsPhase(G, ctx),
            onEnd: (G) => EndPickCardsActions(G),
        },
        [Phases.EnlistmentMercenaries]: {
            turn: {
                order,
                stages: {
                    // Start
                    [Stages.AddCoinToPouch]: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    [Stages.DiscardBoardCard]: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    [Stages.DiscardSuitCard]: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    [Stages.PickCampCardHolda]: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    [Stages.PickDiscardCard]: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    [Stages.PickHero]: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    [Stages.PlaceCards]: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    [Stages.UpgradeCoin]: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    [Stages.UpgradeVidofnirVedrfolnirCoin]: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                },
                onBegin: (G, ctx) => OnEnlistmentMercenariesTurnBegin(G, ctx),
                onMove: (G, ctx) => OnEnlistmentMercenariesMove(G, ctx),
                endIf: (G, ctx) => CheckEndEnlistmentMercenariesTurn(G, ctx),
                onEnd: (G, ctx) => OnEnlistmentMercenariesTurnEnd(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G) => PrepareMercenaryPhaseOrders(G),
            endIf: (G, ctx) => CheckEndEnlistmentMercenariesPhase(G, ctx),
            onEnd: (G, ctx) => EndEnlistmentMercenariesActions(G, ctx),
        },
        [Phases.EndTier]: {
            turn: {
                order,
                stages: {
                    // Start
                    [Stages.AddCoinToPouch]: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    [Stages.DiscardBoardCard]: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    [Stages.DiscardSuitCard]: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    [Stages.PickCampCardHolda]: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    [Stages.PickDiscardCard]: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    [Stages.PickHero]: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    [Stages.PlaceCards]: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    [Stages.UpgradeCoin]: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    [Stages.UpgradeVidofnirVedrfolnirCoin]: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                },
                onBegin: (G, ctx) => OnEndTierTurnBegin(G, ctx),
                onMove: (G, ctx) => OnEndTierMove(G, ctx),
                onEnd: (G, ctx) => OnEndTierTurnEnd(G, ctx),
            },
            moves: {
                PlaceCardMove,
            },
            onBegin: (G) => CheckEndTierOrder(G),
            endIf: (G, ctx) => CheckEndEndTierPhase(G, ctx),
            onEnd: (G, ctx) => EndEndTierActions(G, ctx),
        },
        [Phases.GetDistinctions]: {
            turn: {
                order,
                stages: {
                    // Start
                    [Stages.AddCoinToPouch]: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    [Stages.DiscardBoardCard]: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    [Stages.DiscardSuitCard]: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    [Stages.PickCampCardHolda]: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    [Stages.PickDiscardCard]: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    [Stages.PickHero]: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    [Stages.PlaceCards]: {
                        moves: {
                            PlaceCardMove,
                        },
                    },
                    [Stages.UpgradeCoin]: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    [Stages.UpgradeVidofnirVedrfolnirCoin]: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    [Stages.PickDistinctionCard]: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                },
                onBegin: (G, ctx) => OnGetDistinctionsTurnBegin(G, ctx),
                onMove: (G, ctx) => OnGetDistinctionsMove(G, ctx),
                endIf: (G, ctx) => CheckNextGetDistinctionsTurn(G, ctx),
                onEnd: (G, ctx) => OnGetDistinctionsTurnEnd(G, ctx),
            },
            next: Phases.PlaceCoins,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G, ctx) => CheckAndResolveDistinctionsOrders(G, ctx),
            endIf: (G, ctx) => CheckEndGetDistinctionsPhase(G, ctx),
            onEnd: (G) => EndGetDistinctionsPhaseActions(G),
        },
        [Phases.BrisingamensEndGame]: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnBrisingamensEndGameTurnBegin(G, ctx),
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
            onBegin: (G) => CheckBrisingamensEndGameOrder(G),
            endIf: (G, ctx) => StartGetMjollnirProfitOrEndGame(G, ctx),
            onEnd: (G) => EndBrisingamensEndGameActions(G),
        },
        [Phases.GetMjollnirProfit]: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnGetMjollnirProfitTurnBegin(G, ctx),
            },
            moves: {
                GetMjollnirProfitMove,
            },
            onBegin: (G) => CheckGetMjollnirProfitOrder(G),
            endIf: (G) => CheckEndGetMjollnirProfitPhase(G),
            onEnd: (G, ctx) => StartEndGame(G, ctx),
        },
    },
    endIf: (G) => CheckEndGame(G),
    onEnd: (G, ctx) => ReturnEndGameData(G, ctx),
    ai: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        enumerate,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        iterations,
        objectives,
        playoutDepth,
    },
};
//# sourceMappingURL=Game.js.map