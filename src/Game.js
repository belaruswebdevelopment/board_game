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
                onBegin: (G, ctx) => OnChooseDifficultySoloModeTurnBegin(G, ctx),
                onMove: (G, ctx) => OnChooseDifficultySoloModeMove(G, ctx),
                endIf: (G, ctx) => CheckEndChooseDifficultySoloModeTurn(G, ctx),
            },
            start: true,
            moves: {
                ChooseDifficultyLevelForSoloModeMove,
            },
            next: (G) => StartChooseDifficultySoloModeAndvariOrBidsPhase(G),
            onBegin: (G, ctx) => CheckChooseDifficultySoloModeOrder(G, ctx),
            endIf: (G, ctx) => CheckEndChooseDifficultySoloModePhase(G, ctx),
            onEnd: (G) => EndChooseDifficultySoloModeActions(G),
        },
        chooseDifficultySoloModeAndvari: {
            turn: {
                order,
                onBegin: (G, ctx) => OnChooseStrategyForSoloModeAndvariTurnBegin(G, ctx),
                onMove: (G, ctx) => OnChooseStrategyForSoloModeAndvariMove(G, ctx),
                endIf: (G, ctx) => CheckEndChooseStrategyForSoloModeAndvariTurn(G, ctx),
            },
            moves: {
                ChooseStrategyVariantForSoloModeAndvariMove,
                ChooseStrategyForSoloModeAndvariMove,
            },
            next: PhaseNames.Bids,
            onBegin: (G, ctx) => CheckChooseStrategyForSoloModeAndvariOrder(G, ctx),
            endIf: (G, ctx) => CheckChooseStrategyForSoloModeAndvariPhase(G, ctx),
            onEnd: (G) => EndChooseStrategyForSoloModeAndvariActions(G),
        },
        bids: {
            turn: {
                order,
                endIf: (G, ctx) => CheckEndBidsTurn(G, ctx),
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
                SoloBotPlaceAllCoinsMove,
                SoloBotAndvariPlaceAllCoinsMove,
            },
            next: (G) => StartBidUlineOrTavernsResolutionPhase(G),
            onBegin: (G, ctx) => PreparationPhaseActions(G, ctx),
            endIf: (G, ctx) => CheckEndBidsPhase(G, ctx),
            onEnd: (G) => EndBidsActions(G),
        },
        bidUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinUlineMove,
            },
            next: PhaseNames.TavernsResolution,
            onBegin: (G, ctx) => CheckBidUlineOrder(G, ctx),
            endIf: (G, ctx) => CheckEndBidUlinePhase(G, ctx),
            onEnd: (G) => EndBidUlineActions(G),
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
                onBegin: (G, ctx) => OnTavernsResolutionTurnBegin(G, ctx),
                onMove: (G, ctx) => OnTavernsResolutionMove(G, ctx),
                endIf: (G, ctx) => CheckEndTavernsResolutionTurn(G, ctx),
                onEnd: (G, ctx) => OnTavernsResolutionTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
                SoloBotClickCardMove,
                SoloBotAndvariClickCardMove,
                UseGodCardPowerMove,
            },
            next: (G, ctx) => StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase(G, ctx),
            onBegin: (G, ctx) => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G, ctx) => CheckEndTavernsResolutionPhase(G, ctx),
            onEnd: (G, ctx) => EndTavernsResolutionActions(G, ctx),
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
                onBegin: (G, ctx) => OnEnlistmentMercenariesTurnBegin(G, ctx),
                onMove: (G, ctx) => OnEnlistmentMercenariesMove(G, ctx),
                endIf: (G, ctx) => CheckEndEnlistmentMercenariesTurn(G, ctx),
                onEnd: (G, ctx) => OnEnlistmentMercenariesTurnEnd(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
            },
            next: (G) => StartEndTierPhaseOrEndGameLastActions(G),
            onBegin: (G) => PrepareMercenaryPhaseOrders(G),
            endIf: (G, ctx) => CheckEndEnlistmentMercenariesPhase(G, ctx),
            onEnd: (G, ctx) => EndEnlistmentMercenariesActions(G, ctx),
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
                onBegin: (G, ctx) => OnPlaceYludTurnBegin(G, ctx),
                onMove: (G, ctx) => OnPlaceYludMove(G, ctx),
                endIf: (G, ctx) => CheckEndPlaceYludTurn(G, ctx),
                onEnd: (G, ctx) => OnPlaceYludTurnEnd(G, ctx),
            },
            moves: {
                PlaceYludHeroMove,
                SoloBotPlaceYludHeroMove,
                SoloBotAndvariPlaceYludHeroMove,
            },
            next: (G) => StartEndGameLastActions(G),
            onBegin: (G, ctx) => CheckPlaceYludOrder(G, ctx),
            endIf: (G, ctx) => CheckEndPlaceYludPhase(G, ctx),
            onEnd: (G, ctx) => EndPlaceYludActions(G, ctx),
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
                onBegin: (G, ctx) => OnTroopEvaluationTurnBegin(G, ctx),
                onMove: (G, ctx) => OnTroopEvaluationMove(G, ctx),
                endIf: (G, ctx) => CheckEndTroopEvaluationTurn(G, ctx),
                onEnd: (G, ctx) => OnTroopEvaluationTurnEnd(G, ctx),
            },
            next: PhaseNames.Bids,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G, ctx) => CheckAndResolveTroopEvaluationOrders(G, ctx),
            endIf: (G, ctx) => CheckEndTroopEvaluationPhase(G, ctx),
            onEnd: (G) => EndTroopEvaluationPhaseActions(G),
        },
        brisingamensEndGame: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnBrisingamensEndGameTurnBegin(G, ctx),
                onMove: (G, ctx) => OnBrisingamensEndGameMove(G, ctx),
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
            next: (G) => StartGetMjollnirProfitPhase(G),
            onBegin: (G) => CheckBrisingamensEndGameOrder(G),
            endIf: (G, ctx) => CheckEndBrisingamensEndGamePhase(G, ctx),
            onEnd: (G) => EndBrisingamensEndGameActions(G),
        },
        getMjollnirProfit: {
            turn: {
                order,
                minMoves: 1,
                maxMoves: 1,
                onBegin: (G, ctx) => OnGetMjollnirProfitTurnBegin(G, ctx),
                onMove: (G, ctx) => OnGetMjollnirProfitMove(G, ctx),
            },
            moves: {
                GetMjollnirProfitMove,
            },
            onBegin: (G) => CheckGetMjollnirProfitOrder(G),
            endIf: (G, ctx) => CheckEndGetMjollnirProfitPhase(G, ctx),
            onEnd: (G, ctx) => StartEndGame(G, ctx),
        },
    },
    endIf: (G, ctx) => CheckEndGame(G, ctx),
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