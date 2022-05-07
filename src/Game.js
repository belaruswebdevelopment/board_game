import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckBrisingamensEndGameOrder, EndBrisingamensEndGameActions, OnBrisingamensEndGameMove, OnBrisingamensEndGameTurnBegin, StartGetMjollnirProfitOrEndGame } from "./hooks/BrisingamensEndGameHooks";
import { CheckChooseDifficultySoloModeOrder, CheckEndChooseDifficultySoloModePhase, EndChooseDifficultySoloModeActions } from "./hooks/ChooseDifficultySoloModeHooks";
import { CheckEndEndTierPhase, CheckEndEndTierTurn, CheckEndTierOrder, EndEndTierActions, OnEndTierMove, OnEndTierTurnBegin, OnEndTierTurnEnd } from "./hooks/EndTierHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, OnEnlistmentMercenariesTurnEnd, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckAndResolveDistinctionsOrders, CheckEndGetDistinctionsPhase, CheckNextGetDistinctionsTurn, EndGetDistinctionsPhaseActions, OnGetDistinctionsMove, OnGetDistinctionsTurnBegin, OnGetDistinctionsTurnEnd } from "./hooks/GetDistinctionsHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitMove, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckEndPickCardsPhase, CheckEndPickCardsTurn, EndPickCardsActions, OnPickCardsMove, OnPickCardsTurnBegin, OnPickCardsTurnEnd, ResolveCurrentTavernOrders } from "./hooks/PickCardsHooks";
import { CheckEndPlaceCoinsPhase, CheckEndPlaceCoinsTurn, EndPlaceCoinsActions, PreparationPhaseActions } from "./hooks/PlaceCoinsHooks";
import { CheckEndPlaceCoinsUlinePhase, CheckUlinePlaceCoinsOrder, EndPlaceCoinsUlineActions } from "./hooks/PlaceCoinsUlineHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickConcreteCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove } from "./moves/CoinMoves";
import { ChooseDifficultyLevelForSoloModeMove, ChooseHeroForDifficultySoloModeMove } from "./moves/GameConfigMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceOlwinCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { SoloBotPlaceAllCoinsMove } from "./moves/SoloBotMoves";
import { Phases } from "./typescript/enums";
// TODO Check all coins for solo (player===public, bot=private+sometimes public)
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
                },
            },
            start: true,
            moves: {
                ChooseDifficultyLevelForSoloModeMove,
            },
            next: Phases.PlaceCoins,
            onBegin: (G, ctx) => CheckChooseDifficultySoloModeOrder(G, ctx),
            endIf: (G) => CheckEndChooseDifficultySoloModePhase(G),
            onEnd: (G) => EndChooseDifficultySoloModeActions(G),
        },
        placeCoins: {
            turn: {
                order,
                endIf: (G, ctx) => CheckEndPlaceCoinsTurn(G, ctx),
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
                SoloBotPlaceAllCoinsMove,
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
                ClickHandCoinUlineMove,
            },
            next: Phases.PickCards,
            onBegin: (G, ctx) => CheckUlinePlaceCoinsOrder(G, ctx),
            endIf: (G, ctx) => CheckEndPlaceCoinsUlinePhase(G, ctx),
            onEnd: (G) => EndPlaceCoinsUlineActions(G),
        },
        pickCards: {
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
                    placeOlwinCards: {
                        moves: {
                            PlaceOlwinCardMove,
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
            onEnd: (G, ctx) => EndPickCardsActions(G, ctx),
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
                    placeOlwinCards: {
                        moves: {
                            PlaceOlwinCardMove,
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
        endTier: {
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
                    placeOlwinCards: {
                        moves: {
                            PlaceOlwinCardMove,
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
                },
                onBegin: (G, ctx) => OnEndTierTurnBegin(G, ctx),
                onMove: (G, ctx) => OnEndTierMove(G, ctx),
                endIf: (G, ctx) => CheckEndEndTierTurn(G, ctx),
                onEnd: (G, ctx) => OnEndTierTurnEnd(G, ctx),
            },
            moves: {
                PlaceYludHeroMove,
            },
            onBegin: (G) => CheckEndTierOrder(G),
            endIf: (G, ctx) => CheckEndEndTierPhase(G, ctx),
            onEnd: (G, ctx) => EndEndTierActions(G, ctx),
        },
        getDistinctions: {
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
                    placeOlwinCards: {
                        moves: {
                            PlaceOlwinCardMove,
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
            onBegin: (G) => CheckBrisingamensEndGameOrder(G),
            endIf: (G, ctx) => StartGetMjollnirProfitOrEndGame(G, ctx),
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