import {CampDeckCardTypes, DistinctionTypes, MyGameState, SetupGame} from "./GameSetup";
import {
    ClickCard,
    ClickCardToPickDistinction,
    ClickDistinctionCard,
    GetEnlistmentMercenaries,
    PassEnlistmentMercenaries,
    PickDiscardCard,
    PlaceEnlistmentMercenaries,
    StartEnlistmentMercenaries,
} from "./moves/Moves";
import {ChangePlayersPriorities} from "./Priority";
import {ScoreWinner} from "./Score";
import {enumerate, iterations, objectives, playoutDepth} from "./AI";
import {ReturnCoinsToPlayerHands} from "./Coin";
import {RefillTaverns} from "./Tavern";
import {RefillCamp} from "./Camp";
import {ClickHeroCard, DiscardCard, PlaceCard,} from "./moves/HeroMoves";
import {
    AddCoinToPouch,
    ClickBoardCoin,
    ClickCoinToUpgrade,
    ClickHandCoin,
    UpgradeCoinVidofnirVedrfolnir
} from "./moves/CoinMoves";
import {
    ClickCampCard,
    ClickCampCardHolda,
    DiscardCard2Players,
    DiscardCardFromPlayerBoard,
    DiscardSuitCardFromPlayerBoard,
    GetMjollnirProfit
} from "./moves/CampMoves";
import {AddActionsToStack} from "./helpers/StackHelpers";
import {BotsPlaceAllCoins} from "./moves/BotMoves";
import {ResolveBoardCoins} from "./helpers/CoinHelpers";
import {PlayerView} from "boardgame.io/core";
import {CheckDistinction} from "./Distinction";
import type {Ctx, Game} from "boardgame.io";
import {CheckPlayersBasicOrder, IPublicPlayer, IStack} from "./Player";

// todo Add logging
// todo Add colors for cards Points by suit colors!
/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 *
 * @type {{onEnd: (G: MyGameState, ctx: Ctx) => MyGameState | void, name: string, ai: {playoutDepth: (G: MyGameState, ctx: Ctx) => number, enumerate: (G: MyGameState, ctx: Ctx) => IMoves[], objectives: () => {isEarlyGame: {weight: number, checker: (G: MyGameState) => boolean}, isFirst: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}, isStronger: {weight: number, checker: (G: MyGameState, ctx: Ctx) => boolean}}, iterations: (G: MyGameState, ctx: Ctx) => number}, setup: (ctx: Ctx) => MyGameState, playerView: (G: any, ctx: Ctx, playerID: string) => any, phases: {placeCoins: {next: string, onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, BotsPlaceAllCoins: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, start: boolean, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, placeCoinsUline: {onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, getMjollnirProfit: {moves: {GetMjollnirProfit: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, brisingamensEndGame: {moves: {DiscardCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, pickCards: {onBegin: (G: MyGameState, ctx: Ctx) => void, onEnd: (G) => void, moves: {ClickCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickCampCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCard: {moves: {DiscardCard2Players: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeTradingCoinsUline: {moves: {ClickHandCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, ClickBoardCoin: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, getDistinctions: {next: string, onBegin: (G: MyGameState, ctx: Ctx) => void, onEnd: (G: MyGameState) => void, moves: {ClickDistinctionCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, endIf: (G: MyGameState) => boolean, turn: {stages: {upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDistinctionCard: {moves: {ClickCardToPickDistinction: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, enlistmentMercenaries: {onBegin: (G: MyGameState, ctx: Ctx) => void, moves: {PassEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, GetEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, StartEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>, PlaceEnlistmentMercenaries: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}, endTier: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}, turn: {stages: {upgradeCoinVidofnirVedrfolnir: {moves: {UpgradeCoinVidofnirVedrfolnir: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickDiscardCard: {moves: {PickDiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardCardFromBoard: {moves: {DiscardCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, discardSuitCard: {moves: {DiscardSuitCardFromPlayerBoard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, upgradeCoin: {moves: {ClickCoinToUpgrade: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickHero: {moves: {ClickHeroCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, addCoinToPouch: {moves: {AddCoinToPouch: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, placeCards: {moves: {PlaceCard: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}, pickCampCardHolda: {moves: {ClickCampCardHolda: ((G: MyGameState, ctx: Ctx, ...args: any[]) => any) | LongFormMove<MyGameState, Ctx>}}}, order: {next: (G: MyGameState, ctx: Ctx) => number, first: () => number, playOrder: (G: MyGameState) => string[]}}}}}}
 */
export const BoardGame: Game<MyGameState> = {
    name: "nidavellir",
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
            },
            start: true,
            moves: {
                ClickHandCoin,
                ClickBoardCoin,
                BotsPlaceAllCoins,
            },
            next: "pickCards",
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                G.currentTavern = -1;
                if (ctx.turn !== 0) {
                    ReturnCoinsToPlayerHands(G);
                }
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        placeCoinsUline: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
            },
            moves: {
                ClickHandCoin,
                ClickBoardCoin,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        pickCards: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2Players,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin,
                            ClickBoardCoin,
                        },
                    },
                },
            },
            moves: {
                ClickCard,
                ClickCampCard,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                G.currentTavern++;
                const {playersOrder, exchangeOrder}: { playersOrder: number[], exchangeOrder: number[] } =
                    ResolveBoardCoins(G, ctx);
                // [G.publicPlayersOrder, G.exchangeOrder]: number[] = [playersOrder, exchangeOrder];
                G.publicPlayersOrder = playersOrder;
                G.exchangeOrder = exchangeOrder;
            },
            onEnd: (G: MyGameState): void => {
                ChangePlayersPriorities(G);
            },
        },
        enlistmentMercenaries: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenaries,
                PassEnlistmentMercenaries,
                GetEnlistmentMercenaries,
                PlaceEnlistmentMercenaries,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                const players: IPublicPlayer[] = G.publicPlayers.map((player: IPublicPlayer): IPublicPlayer => player),
                    playersIndexes: number[] = [];
                players.sort((nextPlayer: IPublicPlayer, currentPlayer: IPublicPlayer): number => {
                    if (nextPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length <
                        currentPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length) {
                        return 1;
                    } else if (nextPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length >
                        currentPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length) {
                        return -1;
                    }
                    if (nextPlayer.priority.value < currentPlayer.priority.value) {
                        return 1;
                    } else if (nextPlayer.priority.value > currentPlayer.priority.value) {
                        return -1;
                    }
                    return 0;
                });
                players.forEach((playerSorted: IPublicPlayer): void => {
                    if (playerSorted.campCards
                        .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex((player: IPublicPlayer): boolean => player.nickname === playerSorted.nickname));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                const stack: IStack[] = [
                    {
                        actionName: "DrawProfitAction",
                        playerId: G.publicPlayersOrder[0],
                        config: {
                            name: "startOrPassEnlistmentMercenaries",
                            drawName: "Start or Pass Enlistment Mercenaries",
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            },
        },
        endTier: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCard,
            },
        },
        getMjollnirProfit: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
            },
            moves: {
                GetMjollnirProfit,
            },
        },
        brisingamensEndGame: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
            },
            moves: {
                DiscardCardFromPlayerBoard,
            },
        },
        getDistinctions: {
            turn: {
                order: {
                    first: (): number => 0,
                    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
                    playOrder: (G: MyGameState): string[] =>
                        G.publicPlayersOrder.map((order: number): string => String(order)),
                },
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinction,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade,
                        },
                    },
                },
            },
            next: "placeCoins",
            moves: {
                ClickDistinctionCard,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                CheckDistinction(G, ctx);
                const distinctions: (number | null | undefined)[] =
                    G.distinctions.filter((distinction: DistinctionTypes): boolean => distinction !== undefined);
                if (distinctions
                    .every((distinction: number | null | undefined): boolean => typeof distinction === "number")) {
                    G.publicPlayersOrder = distinctions as number[];
                }
            },
            onEnd: (G: MyGameState): void => {
                G.distinctions = Array(G.suitsNum).fill(undefined);
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
                RefillTaverns(G);
            },
            endIf: (G: MyGameState): boolean =>
                G.distinctions.every((distinction: DistinctionTypes): boolean => distinction === undefined),
        },
    },
    onEnd: (G: MyGameState, ctx: Ctx) => {
        return ScoreWinner(G, ctx);
    },
    ai: {
        enumerate,
        objectives,
        iterations,
        playoutDepth,
    },
};
