import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckEndBidsPhase, CheckEndBidsTurn, EndBidsActions, PreparationPhaseActions } from "./hooks/BidsHooks";
import { CheckBidUlineOrder, CheckEndBidUlinePhase, EndBidUlineActions } from "./hooks/BidUlineHooks";
import { CheckBrisingamensEndGameOrder, CheckEndBrisingamensEndGamePhase, EndBrisingamensEndGameActions, OnBrisingamensEndGameMove, OnBrisingamensEndGameTurnBegin, StartGetMjollnirProfitPhase } from "./hooks/BrisingamensEndGameHooks";
import { CheckChooseDifficultySoloModeOrder, CheckEndChooseDifficultySoloModePhase, CheckEndChooseDifficultySoloModeTurn, EndChooseDifficultySoloModeActions, OnChooseDifficultySoloModeMove, OnChooseDifficultySoloModeTurnBegin, StartChooseDifficultySoloModeAndvariOrBidsPhase } from "./hooks/ChooseDifficultySoloModeHooks";
import { CheckChooseStrategyForSoloModeAndvariOrder, CheckChooseStrategyForSoloModeAndvariPhase, CheckEndChooseStrategyForSoloModeAndvariTurn, EndChooseStrategyForSoloModeAndvariActions, OnChooseStrategyForSoloModeAndvariMove, OnChooseStrategyForSoloModeAndvariTurnBegin } from "./hooks/ChooseStrategyForSoloModeAndvariHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitMove, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { StartBidUlineOrTavernsResolutionPhase, StartEndGameLastActions, StartEndTierPhaseOrEndGameLastActions } from "./hooks/NextPhaseHooks";
import { CheckEndPlaceYludPhase, CheckEndPlaceYludTurn, CheckPlaceYludOrder, EndPlaceYludActions, OnPlaceYludMove, OnPlaceYludTurnBegin } from "./hooks/PlaceYludHooks";
import { CheckEndTavernsResolutionPhase, CheckEndTavernsResolutionTurn, EndTavernsResolutionActions, OnTavernsResolutionMove, OnTavernsResolutionTurnBegin, OnTavernsResolutionTurnEnd, ResolveCurrentTavernOrders, StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase } from "./hooks/TavernsResolutionHooks";
import { CheckAndResolveTroopEvaluationOrders, CheckEndTroopEvaluationPhase, CheckEndTroopEvaluationTurn, EndTroopEvaluationPhaseActions, OnTroopEvaluationMove, OnTroopEvaluationTurnBegin, OnTroopEvaluationTurnEnd } from "./hooks/TroopEvaluationHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickConcreteCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove } from "./moves/CoinMoves";
import { ChooseDifficultyLevelForSoloModeMove, ChooseHeroForDifficultySoloModeMove, ChooseStrategyForSoloModeAndvariMove, ChooseStrategyVariantForSoloModeAndvariMove } from "./moves/GameConfigMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceMultiSuitCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { ChooseSuitOlrunMove, GetMythologyCardMove } from "./moves/MythologicalCreatureMoves";
import { SoloBotAndvariClickCardMove, SoloBotAndvariClickCardToPickDistinctionMove, SoloBotAndvariClickCoinToUpgradeMove, SoloBotAndvariClickHeroCardMove, SoloBotAndvariPlaceAllCoinsMove, SoloBotAndvariPlaceThrudHeroMove, SoloBotAndvariPlaceYludHeroMove } from "./moves/SoloBotAndvariMoves";
import { SoloBotClickCardMove, SoloBotClickCardToPickDistinctionMove, SoloBotClickCoinToUpgradeMove, SoloBotClickHeroCardMove, SoloBotPlaceAllCoinsMove, SoloBotPlaceThrudHeroMove, SoloBotPlaceYludHeroMove } from "./moves/SoloBotMoves";
import { PhaseNames } from "./typescript/enums";
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
const order = TurnOrder.CUSTOM_FROM(`publicPlayersOrder`);
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
export const BoardGame = {
    name: `nidavellir`,
    minPlayers: 2,
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
                onBegin: ({ G, ctx, ...rest }) => OnChooseDifficultySoloModeTurnBegin({ G, ctx, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnChooseDifficultySoloModeMove({ G, ctx, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndChooseDifficultySoloModeTurn({ G, ctx, ...rest }),
            },
            start: true,
            moves: {
                ChooseDifficultyLevelForSoloModeMove,
            },
            next: ({ G, ...rest }) => StartChooseDifficultySoloModeAndvariOrBidsPhase({ G, ...rest }),
            onBegin: ({ G, ctx, ...rest }) => CheckChooseDifficultySoloModeOrder({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndChooseDifficultySoloModePhase({ G, ctx, ...rest }),
            onEnd: ({ G, ...rest }) => EndChooseDifficultySoloModeActions({ G, ...rest }),
        },
        chooseDifficultySoloModeAndvari: {
            turn: {
                order,
                onBegin: ({ G, ctx, random, ...rest }) => OnChooseStrategyForSoloModeAndvariTurnBegin({ G, ctx, random, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnChooseStrategyForSoloModeAndvariMove({ G, ctx, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndChooseStrategyForSoloModeAndvariTurn({ G, ctx, ...rest }),
            },
            moves: {
                ChooseStrategyVariantForSoloModeAndvariMove,
                ChooseStrategyForSoloModeAndvariMove,
            },
            next: PhaseNames.Bids,
            onBegin: ({ G, ctx, ...rest }) => CheckChooseStrategyForSoloModeAndvariOrder({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckChooseStrategyForSoloModeAndvariPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ...rest }) => EndChooseStrategyForSoloModeAndvariActions({ G, ...rest }),
        },
        bids: {
            turn: {
                order,
                endIf: ({ G, ctx, ...rest }) => CheckEndBidsTurn({ G, ctx, ...rest }),
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
                SoloBotPlaceAllCoinsMove,
                SoloBotAndvariPlaceAllCoinsMove,
            },
            next: ({ G, ...rest }) => StartBidUlineOrTavernsResolutionPhase({ G, ...rest }),
            onBegin: ({ G, ctx, random, ...rest }) => PreparationPhaseActions({ G, ctx, random, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndBidsPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ...rest }) => EndBidsActions({ G, ...rest }),
        },
        bidUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinUlineMove,
            },
            next: PhaseNames.TavernsResolution,
            onBegin: ({ G, ctx, ...rest }) => CheckBidUlineOrder({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndBidUlinePhase({ G, ctx, ...rest }),
            onEnd: ({ G, ...rest }) => EndBidUlineActions({ G, ...rest }),
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
                    clickConcreteCoinToUpgrade: {
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
                    chooseSuitOlrun: {
                        moves: {
                            ChooseSuitOlrunMove,
                        },
                    },
                    getMythologyCard: {
                        moves: {
                            GetMythologyCardMove,
                        },
                    },
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
                onBegin: ({ G, ctx, ...rest }) => OnTavernsResolutionTurnBegin({ G, ctx, ...rest }),
                onMove: ({ G, ctx, events, ...rest }) => OnTavernsResolutionMove({ G, ctx, events, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndTavernsResolutionTurn({ G, ctx, ...rest }),
                onEnd: ({ G, ctx, ...rest }) => OnTavernsResolutionTurnEnd({ G, ctx, ...rest }),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
                SoloBotClickCardMove,
                SoloBotAndvariClickCardMove,
            },
            next: ({ G, ctx, ...rest }) => StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase({ G, ctx, ...rest }),
            onBegin: ({ G, ctx, ...rest }) => ResolveCurrentTavernOrders({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndTavernsResolutionPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ctx, ...rest }) => EndTavernsResolutionActions({ G, ctx, ...rest }),
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
                    clickConcreteCoinToUpgrade: {
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
                onBegin: ({ G, ctx, events, ...rest }) => OnEnlistmentMercenariesTurnBegin({ G, ctx, events, ...rest }),
                onMove: ({ G, ctx, events, ...rest }) => OnEnlistmentMercenariesMove({ G, ctx, events, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndEnlistmentMercenariesTurn({ G, ctx, ...rest }),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
            },
            next: ({ G, ...rest }) => StartEndTierPhaseOrEndGameLastActions({ G, ...rest }),
            onBegin: ({ G, ...rest }) => PrepareMercenaryPhaseOrders({ G, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndEnlistmentMercenariesPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ctx, ...rest }) => EndEnlistmentMercenariesActions({ G, ctx, ...rest }),
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
                    clickConcreteCoinToUpgrade: {
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
                onBegin: ({ G, ctx, events, ...rest }) => OnPlaceYludTurnBegin({ G, ctx, events, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnPlaceYludMove({ G, ctx, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndPlaceYludTurn({ G, ctx, ...rest }),
            },
            moves: {
                PlaceYludHeroMove,
                SoloBotPlaceYludHeroMove,
                SoloBotAndvariPlaceYludHeroMove,
            },
            next: ({ G, ...rest }) => StartEndGameLastActions({ G, ...rest }),
            onBegin: ({ G, ctx, ...rest }) => CheckPlaceYludOrder({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndPlaceYludPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ctx, ...rest }) => EndPlaceYludActions({ G, ctx, ...rest }),
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
                    clickConcreteCoinToUpgrade: {
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
                onBegin: ({ G, ctx, ...rest }) => OnTroopEvaluationTurnBegin({ G, ctx, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnTroopEvaluationMove({ G, ctx, ...rest }),
                endIf: ({ G, ctx, ...rest }) => CheckEndTroopEvaluationTurn({ G, ctx, ...rest }),
                onEnd: ({ G, ctx, random, ...rest }) => OnTroopEvaluationTurnEnd({ G, ctx, random, ...rest }),
            },
            next: PhaseNames.Bids,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: ({ G, ctx, ...rest }) => CheckAndResolveTroopEvaluationOrders({ G, ctx, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndTroopEvaluationPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ctx, ...rest }) => EndTroopEvaluationPhaseActions({ G, ctx, ...rest }),
        },
        brisingamensEndGame: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: ({ G, ctx, ...rest }) => OnBrisingamensEndGameTurnBegin({ G, ctx, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnBrisingamensEndGameMove({ G, ctx, ...rest }),
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
            next: ({ G, ...rest }) => StartGetMjollnirProfitPhase({ G, ...rest }),
            onBegin: ({ G, ...rest }) => CheckBrisingamensEndGameOrder({ G, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndBrisingamensEndGamePhase({ G, ctx, ...rest }),
            onEnd: ({ G, ...rest }) => EndBrisingamensEndGameActions({ G, ...rest }),
        },
        getMjollnirProfit: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: ({ G, ctx, events, ...rest }) => OnGetMjollnirProfitTurnBegin({ G, ctx, events, ...rest }),
                onMove: ({ G, ctx, ...rest }) => OnGetMjollnirProfitMove({ G, ctx, ...rest }),
            },
            moves: {
                GetMjollnirProfitMove,
            },
            onBegin: ({ G, ...rest }) => CheckGetMjollnirProfitOrder({ G, ...rest }),
            endIf: ({ G, ctx, ...rest }) => CheckEndGetMjollnirProfitPhase({ G, ctx, ...rest }),
            onEnd: ({ G, ctx, events, ...rest }) => StartEndGame({ G, ctx, events, ...rest }),
        },
    },
    endIf: ({ G, ctx, ...rest }) => CheckEndGame({ G, ctx, ...rest }),
    onEnd: ({ G, ctx, ...rest }) => ReturnEndGameData({ G, ctx, ...rest }),
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