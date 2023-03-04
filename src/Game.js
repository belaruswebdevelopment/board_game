import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckBidUlineOrder, CheckEndBidUlinePhase, EndBidUlineActions } from "./hooks/BidUlineHooks";
import { CheckEndBidsPhase, CheckEndBidsTurn, EndBidsActions, PreparationPhaseActions } from "./hooks/BidsHooks";
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
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove, PickConcreteCoinToUpgradeMove } from "./moves/CoinMoves";
import { ChooseDifficultyLevelForSoloModeMove, ChooseHeroForDifficultySoloModeMove, ChooseStrategyForSoloModeAndvariMove, ChooseStrategyVariantForSoloModeAndvariMove } from "./moves/GameConfigMoves";
import { ClickHeroCardMove, DiscardTopCardFromSuitMove, PlaceMultiSuitCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { ActivateGodAbilityMove, ChooseCoinValueForHrungnirUpgradeMove, ChooseSuitOlrunMove, ClickCardNotGiantAbilityMove, ClickGiantAbilityNotCardMove, GetMythologyCardMove, NotActivateGodAbilityMove } from "./moves/MythologicalCreatureMoves";
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
        ChooseDifficultySoloMode: {
            turn: {
                order,
                stages: {
                    ChooseHeroForDifficultySoloMode: {
                        moves: {
                            ChooseHeroForDifficultySoloModeMove,
                        },
                    },
                    SoloBotClickCoinToUpgrade: {
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
        ChooseDifficultySoloModeAndvari: {
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
        Bids: {
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
        BidUline: {
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
        TavernsResolution: {
            turn: {
                order,
                stages: {
                    // Start
                    AddCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
                        },
                    },
                    DiscardTopCardFromSuit: {
                        moves: {
                            DiscardTopCardFromSuitMove,
                        },
                    },
                    DiscardSuitCardFromPlayerBoard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    ClickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    PickConcreteCoinToUpgrade: {
                        moves: {
                            PickConcreteCoinToUpgradeMove,
                        },
                    },
                    PickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    ClickHeroCard: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    PlaceMultiSuitCard: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    PlaceThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    ClickCoinToUpgrade: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    UpgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    ActivateGiantAbilityOrPickCard: {
                        moves: {
                            ClickCardNotGiantAbilityMove,
                            ClickGiantAbilityNotCardMove,
                        },
                    },
                    ActivateGodAbilityOrNot: {
                        moves: {
                            ActivateGodAbilityMove,
                            NotActivateGodAbilityMove,
                        },
                    },
                    ChooseCoinValueForHrungnirUpgrade: {
                        moves: {
                            ChooseCoinValueForHrungnirUpgradeMove,
                        },
                    },
                    ChooseSuitOlrun: {
                        moves: {
                            ChooseSuitOlrunMove,
                        },
                    },
                    GetMythologyCard: {
                        moves: {
                            GetMythologyCardMove,
                        },
                    },
                    DiscardCard2Players: {
                        moves: {
                            DiscardCard2PlayersMove,
                        },
                    },
                    ClickHandTradingCoinUline: {
                        moves: {
                            ClickHandTradingCoinUlineMove,
                        },
                    },
                    // Common Solo Bot Start
                    SoloBotClickHeroCard: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    SoloBotPlaceThrudHero: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    SoloBotClickCoinToUpgrade: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Common Solo Bot Andvari Start
                    SoloBotAndvariClickHeroCard: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    SoloBotAndvariPlaceThrudHero: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    SoloBotAndvariClickCoinToUpgrade: {
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
        EnlistmentMercenaries: {
            turn: {
                order,
                stages: {
                    // Start
                    AddCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
                        },
                    },
                    DiscardTopCardFromSuit: {
                        moves: {
                            DiscardTopCardFromSuitMove,
                        },
                    },
                    DiscardSuitCardFromPlayerBoard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    ClickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    PickConcreteCoinToUpgrade: {
                        moves: {
                            PickConcreteCoinToUpgradeMove,
                        },
                    },
                    PickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    ClickHeroCard: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    PlaceMultiSuitCard: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    PlaceThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    ClickCoinToUpgrade: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    UpgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    PlaceEnlistmentMercenaries: {
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
        PlaceYlud: {
            turn: {
                order,
                stages: {
                    // Start
                    AddCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
                        },
                    },
                    DiscardTopCardFromSuit: {
                        moves: {
                            DiscardTopCardFromSuitMove,
                        },
                    },
                    DiscardSuitCardFromPlayerBoard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    ClickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    PickConcreteCoinToUpgrade: {
                        moves: {
                            PickConcreteCoinToUpgradeMove,
                        },
                    },
                    PickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    ClickHeroCard: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    PlaceMultiSuitCard: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    PlaceThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    ClickCoinToUpgrade: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    UpgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    // Common Solo Bot Start
                    SoloBotClickHeroCard: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    SoloBotPlaceThrudHero: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    SoloBotClickCoinToUpgrade: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Common Solo Bot Andvari Start
                    SoloBotAndvariClickHeroCard: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    SoloBotAndvariPlaceThrudHero: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    SoloBotAndvariClickCoinToUpgrade: {
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
        TroopEvaluation: {
            turn: {
                order,
                stages: {
                    // Start
                    AddCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
                        moves: {
                            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
                        },
                    },
                    DiscardTopCardFromSuit: {
                        moves: {
                            DiscardTopCardFromSuitMove,
                        },
                    },
                    DiscardSuitCardFromPlayerBoard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    ClickCampCardHolda: {
                        moves: {
                            ClickCampCardHoldaMove,
                        },
                    },
                    PickConcreteCoinToUpgrade: {
                        moves: {
                            PickConcreteCoinToUpgradeMove,
                        },
                    },
                    PickDiscardCard: {
                        moves: {
                            PickDiscardCardMove,
                        },
                    },
                    ClickHeroCard: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    PlaceMultiSuitCard: {
                        moves: {
                            PlaceMultiSuitCardMove,
                        },
                    },
                    PlaceThrudHero: {
                        moves: {
                            PlaceThrudHeroMove,
                        },
                    },
                    ClickCoinToUpgrade: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    UpgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    // End
                    ClickCardToPickDistinction: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                    // Solo Bot
                    SoloBotClickCardToPickDistinction: {
                        moves: {
                            SoloBotClickCardToPickDistinctionMove,
                        },
                    },
                    // Common Solo Bot Start
                    SoloBotClickHeroCard: {
                        moves: {
                            SoloBotClickHeroCardMove,
                        },
                    },
                    SoloBotPlaceThrudHero: {
                        moves: {
                            SoloBotPlaceThrudHeroMove,
                        },
                    },
                    SoloBotClickCoinToUpgrade: {
                        moves: {
                            SoloBotClickCoinToUpgradeMove,
                        },
                    },
                    // Common Solo Bot End
                    // Solo Bot Andvari
                    SoloBotAndvariClickCardToPickDistinction: {
                        moves: {
                            SoloBotAndvariClickCardToPickDistinctionMove,
                        },
                    },
                    // Common Solo Bot Andvari Start
                    SoloBotAndvariClickHeroCard: {
                        moves: {
                            SoloBotAndvariClickHeroCardMove,
                        },
                    },
                    SoloBotAndvariPlaceThrudHero: {
                        moves: {
                            SoloBotAndvariPlaceThrudHeroMove,
                        },
                    },
                    SoloBotAndvariClickCoinToUpgrade: {
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
        BrisingamensEndGame: {
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
        GetMjollnirProfit: {
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