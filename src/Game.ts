import type { Ctx } from "boardgame.io";
import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase, StartBidUlineOrTavernsResolutionPhase, StartEndGameLastActions, StartEndTierPhaseOrEndGameLastActions, StartGetMjollnirProfitPhase } from "./helpers/GameHooksHelpers";
import { CheckEndBidsPhase, CheckEndBidsTurn, EndBidsActions, PreparationPhaseActions } from "./hooks/BidsHooks";
import { CheckBidUlineOrder, CheckEndBidUlinePhase, EndBidUlineActions } from "./hooks/BidUlineHooks";
import { CheckBrisingamensEndGameOrder, CheckEndBrisingamensEndGamePhase, EndBrisingamensEndGameActions, OnBrisingamensEndGameMove, OnBrisingamensEndGameTurnBegin } from "./hooks/BrisingamensEndGameHooks";
import { CheckChooseDifficultySoloModeOrder, CheckEndChooseDifficultySoloModePhase, CheckEndChooseDifficultySoloModeTurn, EndChooseDifficultySoloModeActions, OnChooseDifficultySoloModeMove, OnChooseDifficultySoloModeTurnBegin, StartChooseDifficultySoloModeAndvariOrBidsPhase } from "./hooks/ChooseDifficultySoloModeHooks";
import { CheckChooseStrategyForSoloModeAndvariOrder, CheckChooseStrategyForSoloModeAndvariPhase, CheckEndChooseStrategyForSoloModeAndvariTurn, EndChooseStrategyForSoloModeAndvariActions, OnChooseStrategyForSoloModeAndvariMove, OnChooseStrategyForSoloModeAndvariTurnBegin } from "./hooks/ChooseStrategyForSoloModeAndvariHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, OnEnlistmentMercenariesTurnEnd, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitMove, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckEndPlaceYludPhase, CheckEndPlaceYludTurn, CheckPlaceYludOrder, EndPlaceYludActions, OnPlaceYludMove, OnPlaceYludTurnBegin, OnPlaceYludTurnEnd } from "./hooks/PlaceYludHooks";
import { CheckEndTavernsResolutionPhase, CheckEndTavernsResolutionTurn, EndTavernsResolutionActions, OnTavernsResolutionMove, OnTavernsResolutionTurnBegin, OnTavernsResolutionTurnEnd, ResolveCurrentTavernOrders } from "./hooks/TavernsResolutionHooks";
import { CheckAndResolveTroopEvaluationOrders, CheckEndTroopEvaluationPhase, CheckEndTroopEvaluationTurn, EndTroopEvaluationPhaseActions, OnTroopEvaluationMove, OnTroopEvaluationTurnBegin, OnTroopEvaluationTurnEnd } from "./hooks/TroopEvaluationHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickConcreteCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove } from "./moves/CoinMoves";
import { ChooseDifficultyLevelForSoloModeMove, ChooseHeroForDifficultySoloModeMove, ChooseStrategyForSoloModeAndvariMove, ChooseStrategyVariantForSoloModeAndvariMove } from "./moves/GameConfigMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceMultiSuitCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { UseGodCardPowerMove } from "./moves/MythologicalCreatureMoves";
import { SoloBotAndvariClickCardMove, SoloBotAndvariClickCardToPickDistinctionMove, SoloBotAndvariClickCoinToUpgradeMove, SoloBotAndvariClickHeroCardMove, SoloBotAndvariPlaceAllCoinsMove, SoloBotAndvariPlaceThrudHeroMove, SoloBotAndvariPlaceYludHeroMove } from "./moves/SoloBotAndvariMoves";
import { SoloBotClickCardMove, SoloBotClickCardToPickDistinctionMove, SoloBotClickCoinToUpgradeMove, SoloBotClickHeroCardMove, SoloBotPlaceAllCoinsMove, SoloBotPlaceThrudHeroMove, SoloBotPlaceYludHeroMove } from "./moves/SoloBotMoves";
import { PhaseNames } from "./typescript/enums";
import type { CanBeVoidType, Game, IMyGameState, IOrder } from "./typescript/interfaces";

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
export const BoardGame: Game<IMyGameState, Ctx> = {
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
                    upgradeCoinSoloBot: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnChooseDifficultySoloModeTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnChooseDifficultySoloModeMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> =>
                    CheckEndChooseDifficultySoloModeTurn(G, ctx),
            },
            start: true,
            moves: {
                ChooseDifficultyLevelForSoloModeMove,
            },
            next: (G: IMyGameState): PhaseNames => StartChooseDifficultySoloModeAndvariOrBidsPhase(G),
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckChooseDifficultySoloModeOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndChooseDifficultySoloModePhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndChooseDifficultySoloModeActions(G),
        },
        chooseDifficultySoloModeAndvari: {
            turn: {
                order,
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnChooseStrategyForSoloModeAndvariTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnChooseStrategyForSoloModeAndvariMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> =>
                    CheckEndChooseStrategyForSoloModeAndvariTurn(G, ctx),
            },
            moves: {
                ChooseStrategyVariantForSoloModeAndvariMove,
                ChooseStrategyForSoloModeAndvariMove,
            },
            next: PhaseNames.Bids,
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckChooseStrategyForSoloModeAndvariOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> =>
                CheckChooseStrategyForSoloModeAndvariPhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndChooseStrategyForSoloModeAndvariActions(G),
        },
        bids: {
            turn: {
                order,
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndBidsTurn(G, ctx),
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
                SoloBotPlaceAllCoinsMove,
                SoloBotAndvariPlaceAllCoinsMove,
            },
            next: (G: IMyGameState): PhaseNames => StartBidUlineOrTavernsResolutionPhase(G),
            onBegin: (G: IMyGameState, ctx: Ctx): void => PreparationPhaseActions(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndBidsPhase(G, ctx),
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
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndBidUlinePhase(G, ctx),
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
                    chooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
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
                    // Common Solo Bot Start
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBot: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBot: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Common Solo Bot Andvari Start
                    pickHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot Andvari End
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndTavernsResolutionTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnTavernsResolutionTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
                SoloBotClickCardMove,
                SoloBotAndvariClickCardMove,
                UseGodCardPowerMove,
            },
            next: (G: IMyGameState, ctx: Ctx): CanBeVoidType<PhaseNames> =>
                StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase(G, ctx),
            onBegin: (G: IMyGameState, ctx: Ctx): void => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndTavernsResolutionPhase(G, ctx),
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
                    chooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
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
                    placeEnlistmentMercenaries: {
                        moves: {
                            PlaceEnlistmentMercenariesMove,
                        },
                    },
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndEnlistmentMercenariesTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnEnd(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
            },
            next: (G: IMyGameState): CanBeVoidType<PhaseNames> => StartEndTierPhaseOrEndGameLastActions(G),
            onBegin: (G: IMyGameState): void => PrepareMercenaryPhaseOrders(G),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndEnlistmentMercenariesPhase(G, ctx),
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
                    chooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
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
                    // Common Solo Bot Start
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBot: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBot: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Common Solo Bot Andvari Start
                    pickHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot Andvari End
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndPlaceYludTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnPlaceYludTurnEnd(G, ctx),
            },
            moves: {
                PlaceYludHeroMove,
                SoloBotPlaceYludHeroMove,
                SoloBotAndvariPlaceYludHeroMove,
            },
            next: (G: IMyGameState): CanBeVoidType<PhaseNames> => StartEndGameLastActions(G),
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckPlaceYludOrder(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndPlaceYludPhase(G, ctx),
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
                    chooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
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
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                    // Solo Bot
                    pickDistinctionCardSoloBot: {
                        moves: {
                            SoloBotClickCardToPickDistinctionMove,
                        },
                    },
                    // Common Solo Bot Start
                    pickHeroSoloBot: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBot: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBot: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Solo Bot Andvari
                    pickDistinctionCardSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickCardToPickDistinctionMove,
                        },
                    },
                    // Common Solo Bot Andvari Start
                    pickHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    placeThrudHeroSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    upgradeCoinSoloBotAndvari: {
                        moves: {
                            SoloBotAndvariClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot Andvari End
                },
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndTroopEvaluationTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnTroopEvaluationTurnEnd(G, ctx),
            },
            next: PhaseNames.Bids,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckAndResolveTroopEvaluationOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndTroopEvaluationPhase(G, ctx),
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
            next: (G: IMyGameState): CanBeVoidType<PhaseNames> => StartGetMjollnirProfitPhase(G),
            onBegin: (G: IMyGameState): void => CheckBrisingamensEndGameOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<true> => CheckEndBrisingamensEndGamePhase(G, ctx),
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
            endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndGetMjollnirProfitPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => StartEndGame(G, ctx),
        },
    },
    endIf: (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => CheckEndGame(G, ctx),
    onEnd: (G: IMyGameState, ctx: Ctx): CanBeVoidType<IMyGameState> => ReturnEndGameData(G, ctx),
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
