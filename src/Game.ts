import type { Ctx, Game } from "boardgame.io";
import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase, StartBidUlineOrTavernsResolutionPhase, StartEndGameLastActions, StartEndTierPhaseOrEndGameLastActions, StartGetMjollnirProfitPhase } from "./helpers/GameHooksHelpers";
import { CheckEndBidsPhase, CheckEndBidsTurn, EndBidsActions, PreparationPhaseActions } from "./hooks/BidsHooks";
import { CheckBidUlineOrder, CheckEndBidUlinePhase, EndBidUlineActions } from "./hooks/BidUlineHooks";
import { CheckBrisingamensEndGameOrder, CheckEndBrisingamensEndGamePhase, EndBrisingamensEndGameActions, OnBrisingamensEndGameMove, OnBrisingamensEndGameTurnBegin } from "./hooks/BrisingamensEndGameHooks";
import { CheckChooseDifficultySoloModeOrder, CheckEndChooseDifficultySoloModePhase, CheckEndChooseDifficultySoloModeTurn, EndChooseDifficultySoloModeActions, OnChooseDifficultySoloModeMove, OnChooseDifficultySoloModeTurnBegin } from "./hooks/ChooseDifficultySoloModeHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, OnEnlistmentMercenariesTurnEnd, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitMove, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckEndPlaceYludPhase, CheckEndPlaceYludTurn, CheckPlaceYludOrder, EndPlaceYludActions, OnPlaceYludMove, OnPlaceYludTurnBegin, OnPlaceYludTurnEnd } from "./hooks/PlaceYludHooks";
import { CheckEndTavernsResolutionPhase, CheckEndTavernsResolutionTurn, EndTavernsResolutionActions, OnTavernsResolutionMove, OnTavernsResolutionTurnBegin, OnTavernsResolutionTurnEnd, ResolveCurrentTavernOrders } from "./hooks/TavernsResolutionHooks";
import { CheckAndResolveTroopEvaluationOrders, CheckEndTroopEvaluationPhase, CheckEndTroopEvaluationTurn, EndTroopEvaluationPhaseActions, OnTroopEvaluationMove, OnTroopEvaluationTurnBegin, OnTroopEvaluationTurnEnd } from "./hooks/TroopEvaluationHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickConcreteCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove } from "./moves/CoinMoves";
import { ChooseDifficultyLevelForSoloModeMove, ChooseHeroForDifficultySoloModeMove } from "./moves/GameConfigMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceMultiSuitCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { UseGodPowerMove } from "./moves/MythologicalCreatureMoves";
import { SoloBotClickHeroCardMove, SoloBotPlaceAllCoinsMove } from "./moves/SoloBotMoves";
import { PhaseNames } from "./typescript/enums";
import type { IMyGameState, IOrder } from "./typescript/interfaces";

// TODO Check all coins for solo (player===public, bot=private+sometimes public)
// TODO Add Log data fo Solo Bot fo all files!
// TODO Add logging
// TODO Add dock block
// TODO Add all logs errors and other text in ENUMS!
/**
 * <h3>Параметры порядка хода.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При определении хода в каждую фазу игры.</li>
 * </ol>
 */
const order: IOrder = TurnOrder.CUSTOM_FROM(`publicPlayersOrder`);

/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
export const BoardGame: Game<IMyGameState> = {
    name: `nidavellir`,
    minPlayers: 1,
    maxPlayers: 5,
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        chooseDifficultySoloMode: {
            turn: {
                order,
                stages: {
                    chooseHeroesForSoloMode: {
                        moves: {
                            ChooseHeroForDifficultySoloModeMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnChooseDifficultySoloModeTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnChooseDifficultySoloModeMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndChooseDifficultySoloModeTurn(G, ctx),
            },
            start: true,
            moves: {
                ChooseDifficultyLevelForSoloModeMove,
            },
            next: PhaseNames.Bids,
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckChooseDifficultySoloModeOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndChooseDifficultySoloModePhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndChooseDifficultySoloModeActions(G),
        },
        bids: {
            turn: {
                order,
                endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndBidsTurn(G, ctx),
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
                SoloBotPlaceAllCoinsMove,
            },
            next: (G: IMyGameState): string => StartBidUlineOrTavernsResolutionPhase(G),
            onBegin: (G: IMyGameState, ctx: Ctx): void => PreparationPhaseActions(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndBidsPhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndBidsActions(G),
        },
        bidUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinUlineMove,
            },
            next: PhaseNames.TavernsResolution,
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckBidUlineOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndBidUlinePhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndBidUlineActions(G),
        },
        tavernsResolution: {
            turn: {
                order,
                stages: {
                    // Start
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    discardBoardCard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    pickConcreteCoinToUpgrade: {
                        moves: {
                            ClickConcreteCoinToUpgradeMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    placeMultiSuitsCards: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    placeThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    upgradeVidofnirVedrfolnirCoin: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
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
                            ClickHandTradingCoinUlineMove,
                        },
                    },
                    // Solo Mode
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndTavernsResolutionTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
                // TODO Check it and add to all needed phases!
                UseGodPowerMove,
            },
            next: (G: IMyGameState, ctx: Ctx): string | void =>
                StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase(G, ctx),
            onBegin: (G: IMyGameState, ctx: Ctx): void => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndTavernsResolutionPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => EndTavernsResolutionActions(G, ctx),
        },
        enlistmentMercenaries: {
            turn: {
                order,
                stages: {
                    // Start
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    discardBoardCard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
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
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    placeMultiSuitsCards: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    placeThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    upgradeVidofnirVedrfolnirCoin: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    placeEnlistmentMercenaries: {
                        moves: {
                            PlaceEnlistmentMercenariesMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndEnlistmentMercenariesTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnEnd(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
            },
            next: (G: IMyGameState, ctx: Ctx): string | void => StartEndTierPhaseOrEndGameLastActions(G, ctx),
            onBegin: (G: IMyGameState): void => PrepareMercenaryPhaseOrders(G),
            endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndEnlistmentMercenariesPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => EndEnlistmentMercenariesActions(G, ctx),
        },
        placeYlud: {
            turn: {
                order,
                stages: {
                    // Start
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    discardBoardCard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
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
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    placeMultiSuitsCards: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    placeThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    upgradeVidofnirVedrfolnirCoin: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    // Solo Mode
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndPlaceYludTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludTurnEnd(G, ctx),
            },
            moves: {
                PlaceYludHeroMove,
            },
            next: (G: IMyGameState, ctx: Ctx): string | void => StartEndGameLastActions(G, ctx),
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckPlaceYludOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndPlaceYludPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => EndPlaceYludActions(G, ctx),
        },
        troopEvaluation: {
            turn: {
                order,
                stages: {
                    // Start
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    discardBoardCard: {
                        moves: {
                            DiscardCardMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
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
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    placeMultiSuitsCards: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    placeThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    upgradeVidofnirVedrfolnirCoin: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                    // Solo Mode
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndTroopEvaluationTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationTurnEnd(G, ctx),
            },
            next: PhaseNames.Bids,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckAndResolveTroopEvaluationOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndTroopEvaluationPhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndTroopEvaluationPhaseActions(G),
        },
        brisingamensEndGame: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnBrisingamensEndGameTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnBrisingamensEndGameMove(G, ctx),
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
            next: (G: IMyGameState): string | void => StartGetMjollnirProfitPhase(G),
            onBegin: (G: IMyGameState): void => CheckBrisingamensEndGameOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): true | void => CheckEndBrisingamensEndGamePhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndBrisingamensEndGameActions(G),
        },
        getMjollnirProfit: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnGetMjollnirProfitTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnGetMjollnirProfitMove(G, ctx),
            },
            moves: {
                GetMjollnirProfitMove,
            },
            onBegin: (G: IMyGameState): void => CheckGetMjollnirProfitOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndGetMjollnirProfitPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => StartEndGame(G, ctx),
        },
    },
    endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndGame(G, ctx),
    onEnd: (G: IMyGameState, ctx: Ctx): IMyGameState | void => ReturnEndGameData(G, ctx),
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
