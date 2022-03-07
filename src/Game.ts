import type { Ctx, Game } from "boardgame.io";
import { PlayerView, TurnOrder } from "boardgame.io/core";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { SetupGame } from "./GameSetup";
import { CheckBrisingamensEndGameOrder, EndBrisingamensEndGameActions, OnBrisingamensEndGameMove, OnBrisingamensEndGameTurnBegin, StartGetMjollnirProfitOrEndGame } from "./hooks/BrisingamensEndGameHooks";
import { CheckEndEndTierPhase, CheckEndEndTierTurn, CheckEndTierOrder, EndEndTierActions, OnEndTierMove, OnEndTierTurnBegin, OnEndTierTurnEnd } from "./hooks/EndTierHooks";
import { CheckEndEnlistmentMercenariesPhase, CheckEndEnlistmentMercenariesTurn, EndEnlistmentMercenariesActions, OnEnlistmentMercenariesMove, OnEnlistmentMercenariesTurnBegin, OnEnlistmentMercenariesTurnEnd, PrepareMercenaryPhaseOrders } from "./hooks/EnlistmentMercenariesHooks";
import { CheckEndGame, ReturnEndGameData } from "./hooks/GameHooks";
import { CheckAndResolveDistinctionsOrders, CheckEndGetDistinctionsPhase, CheckNextGetDistinctionsTurn, EndGetDistinctionsPhaseActions, OnGetDistinctionsMove, OnGetDistinctionsTurnBegin, OnGetDistinctionsTurnEnd } from "./hooks/GetDistinctionsHooks";
import { CheckEndGetMjollnirProfitPhase, CheckGetMjollnirProfitOrder, OnGetMjollnirProfitMove, OnGetMjollnirProfitTurnBegin, StartEndGame } from "./hooks/GetMjollnirProfitHooks";
import { CheckEndPickCardsPhase, CheckEndPickCardsTurn, EndPickCardsActions, OnPickCardsMove, OnPickCardsTurnBegin, OnPickCardsTurnEnd, ResolveCurrentTavernOrders } from "./hooks/PickCardsHooks";
import { CheckEndPlaceCoinsPhase, CheckEndPlaceCoinsTurn, OnPlaceCoinsTurnEnd, PreparationPhaseActions } from "./hooks/PlaceCoinsHooks";
import { CheckEndPlaceCoinsUlinePhase, CheckUlinePlaceCoinsOrder, EndPlaceCoinsUlineActions } from "./hooks/PlaceCoinsUlineHooks";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { AddCoinToPouchMove, ClickCampCardHoldaMove, ClickCampCardMove, DiscardSuitCardFromPlayerBoardMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CampMoves";
import { ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove, ClickHandCoinUlineMove, ClickHandTradingCoinUlineMove } from "./moves/CoinMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceOlwinCardMove, PlaceThrudHeroMove, PlaceYludHeroMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PassEnlistmentMercenariesMove, PickDiscardCardMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/Moves";
import { Phases } from "./typescript/enums";
import type { IMyGameState, INext, IOrder } from "./typescript/interfaces";

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
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order,
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndPlaceCoinsTurn(G, ctx),
            },
            start: true,
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
            },
            onBegin: (G: IMyGameState, ctx: Ctx): void => PreparationPhaseActions(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): void | INext => CheckEndPlaceCoinsPhase(G, ctx),
            onEnd: (G: IMyGameState): void => OnPlaceCoinsTurnEnd(G),
        },
        placeCoinsUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoinUlineMove,
            },
            next: Phases.PickCards,
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckUlinePlaceCoinsOrder(G, ctx),
            endIf: (G: IMyGameState): boolean | void => CheckEndPlaceCoinsUlinePhase(G),
            onEnd: (G: IMyGameState): void => EndPlaceCoinsUlineActions(G),
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
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnPickCardsTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnPickCardsMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndPickCardsTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx) => OnPickCardsTurnEnd(G, ctx),
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
            },
            onBegin: (G: IMyGameState, ctx: Ctx): void => ResolveCurrentTavernOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx) => CheckEndPickCardsPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void | never => EndPickCardsActions(G, ctx),
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
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndEnlistmentMercenariesTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnEnlistmentMercenariesTurnEnd(G, ctx),
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G: IMyGameState): void => PrepareMercenaryPhaseOrders(G),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | INext | void => CheckEndEnlistmentMercenariesPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => EndEnlistmentMercenariesActions(G, ctx),
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
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnEndTierTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnEndTierMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndEndTierTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnEndTierTurnEnd(G, ctx),
            },
            moves: {
                PlaceYludHeroMove,
            },
            onBegin: (G: IMyGameState): void => CheckEndTierOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | INext | void | never => CheckEndEndTierPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => EndEndTierActions(G, ctx),
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
                onBegin: (G: IMyGameState, ctx: Ctx): void => OnGetDistinctionsTurnBegin(G, ctx),
                onMove: (G: IMyGameState, ctx: Ctx): void => OnGetDistinctionsMove(G, ctx),
                endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckNextGetDistinctionsTurn(G, ctx),
                onEnd: (G: IMyGameState, ctx: Ctx): void => OnGetDistinctionsTurnEnd(G, ctx),
            },
            next: Phases.PlaceCoins,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G: IMyGameState, ctx: Ctx): void => CheckAndResolveDistinctionsOrders(G, ctx),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndGetDistinctionsPhase(G, ctx),
            onEnd: (G: IMyGameState): void => EndGetDistinctionsPhaseActions(G),
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
            onBegin: (G: IMyGameState): void | never => CheckBrisingamensEndGameOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | INext | void => StartGetMjollnirProfitOrEndGame(G, ctx),
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
            onBegin: (G: IMyGameState): void | never => CheckGetMjollnirProfitOrder(G),
            endIf: (G: IMyGameState, ctx: Ctx): boolean | void => CheckEndGetMjollnirProfitPhase(G, ctx),
            onEnd: (G: IMyGameState, ctx: Ctx): void => StartEndGame(G, ctx),
        },
    },
    endIf: (G: IMyGameState): boolean | void => CheckEndGame(G),
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
