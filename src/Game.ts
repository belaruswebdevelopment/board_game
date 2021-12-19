import { CampDeckCardTypes, DistinctionTypes, MyGameState, SetupGame } from "./GameSetup";
import {
    ClickCardMove,
    ClickCardToPickDistinctionMove,
    ClickDistinctionCardMove,
    GetEnlistmentMercenariesMove,
    PassEnlistmentMercenariesMove,
    PickDiscardCardMove,
    PlaceEnlistmentMercenariesMove,
    StartEnlistmentMercenariesMove,
} from "./moves/Moves";
import { ChangePlayersPriorities } from "./Priority";
import { ScoreWinner } from "./Score";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { ReturnCoinsToPlayerHands } from "./Coin";
import { RefillTaverns } from "./Tavern";
import { RefillCamp } from "./Camp";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove, } from "./moves/HeroMoves";
import {
    AddCoinToPouchMove,
    ClickBoardCoinMove,
    ClickCoinToUpgradeMove,
    ClickHandCoinMove,
    UpgradeCoinVidofnirVedrfolnirMove
} from "./moves/CoinMoves";
import {
    ClickCampCardMove,
    ClickCampCardHoldaMove,
    DiscardCard2PlayersMove,
    DiscardCardFromPlayerBoardMove,
    DiscardSuitCardFromPlayerBoardMove,
    GetMjollnirProfitMove
} from "./moves/CampMoves";
import { AddActionsToStack } from "./helpers/StackHelpers";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { IResolveBoardCoins, ResolveBoardCoins } from "./helpers/CoinHelpers";
import { PlayerView } from "boardgame.io/core";
import { CheckDistinction } from "./Distinction";
import type { Ctx, Game } from "boardgame.io";
import { CheckPlayersBasicOrder, IPublicPlayer, IStack } from "./Player";
import { DrawProfitAction } from "./actions/Actions";

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
interface IOrder {
    next: (G: MyGameState, ctx: Ctx) => number;
    first: () => number;
    playOrder: (G: MyGameState) => string[];
}

// todo Add logging
// todo Add colors for cards Points by suit colors!
const order: IOrder = {
    first: (): number => 0,
    next: (G: MyGameState, ctx: Ctx): number => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
    playOrder: (G: MyGameState): string[] =>
        G.publicPlayersOrder.map((order: number): string => String(order)),
};

/**
 * <h3>Параметры игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игрового стола.</li>
 * </ol>
 */
export const BoardGame: Game<MyGameState> = {
    name: `nidavellir`,
    setup: SetupGame,
    playerView: PlayerView.STRIP_SECRETS,
    phases: {
        placeCoins: {
            turn: {
                order,
            },
            start: true,
            moves: {
                ClickHandCoin: ClickHandCoinMove,
                ClickBoardCoin: ClickBoardCoinMove,
                BotsPlaceAllCoins: BotsPlaceAllCoinsMove,
            },
            next: `pickCards`,
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                // G.test.testFunc();
                G.currentTavern = -1;
                if (ctx.turn !== 0) {
                    ReturnCoinsToPlayerHands(G);
                }
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        placeCoinsUline: {
            turn: {
                order,
            },
            moves: {
                ClickHandCoin: ClickHandCoinMove,
                ClickBoardCoin: ClickBoardCoinMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                CheckPlayersBasicOrder(G, ctx);
            },
        },
        pickCards: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCardMove,
                        },
                    },
                    // End
                    discardCard: {
                        moves: {
                            DiscardCard2Players: DiscardCard2PlayersMove,
                        },
                    },
                    placeTradingCoinsUline: {
                        moves: {
                            ClickHandCoin: ClickHandCoinMove,
                            ClickBoardCoin: ClickBoardCoinMove,
                        },
                    },
                },
            },
            moves: {
                ClickCard: ClickCardMove,
                ClickCampCard: ClickCampCardMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                G.currentTavern++;
                const { playersOrder, exchangeOrder }: IResolveBoardCoins = ResolveBoardCoins(G, ctx);
                [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G: MyGameState): void => {
                ChangePlayersPriorities(G);
            },
        },
        enlistmentMercenaries: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenaries: StartEnlistmentMercenariesMove,
                PassEnlistmentMercenaries: PassEnlistmentMercenariesMove,
                GetEnlistmentMercenaries: GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenaries: PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                const players: IPublicPlayer[] =
                    G.publicPlayers.map((player: IPublicPlayer): IPublicPlayer => player),
                    playersIndexes: number[] = [];
                players.sort((nextPlayer: IPublicPlayer, currentPlayer: IPublicPlayer): number => {
                    if (nextPlayer.campCards
                        .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length <
                        currentPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
                        return 1;
                    } else if (nextPlayer.campCards
                        .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length >
                        currentPlayer.campCards
                            .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
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
                        .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex((player: IPublicPlayer): boolean =>
                                player.nickname === playerSorted.nickname));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                const stack: IStack[] = [
                    {
                        action: DrawProfitAction,
                        playerId: G.publicPlayersOrder[0],
                        config: {
                            name: `startOrPassEnlistmentMercenaries`,
                            drawName: `Start or Pass Enlistment Mercenaries`,
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            },
        },
        endTier: {
            turn: {
                order,
                stages: {
                    // Start
                    discardCardFromBoard: {
                        moves: {
                            DiscardCard: DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCard: PlaceCardMove,
                        },
                    },
                    pickCampCardHolda: {
                        moves: {
                            ClickCampCardHolda: ClickCampCardHoldaMove,
                        },
                    },
                    pickDiscardCard: {
                        moves: {
                            PickDiscardCard: PickDiscardCardMove,
                        },
                    },
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouch: AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnir: UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoard: DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCard: ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCard: PlaceCardMove,
            },
        },
        getMjollnirProfit: {
            turn: {
                order,
            },
            moves: {
                GetMjollnirProfit: GetMjollnirProfitMove,
            },
        },
        brisingamensEndGame: {
            turn: {
                order,
            },
            moves: {
                DiscardCardFromPlayerBoard: DiscardCardFromPlayerBoardMove,
            },
        },
        getDistinctions: {
            turn: {
                order,
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinction: ClickCardToPickDistinctionMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgrade: ClickCoinToUpgradeMove,
                        },
                    },
                },
            },
            next: `placeCoins`,
            moves: {
                ClickDistinctionCard: ClickDistinctionCardMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                CheckDistinction(G, ctx);
                const distinctions: DistinctionTypes[] =
                    G.distinctions.filter((distinction: DistinctionTypes): boolean =>
                        distinction !== null && distinction !== undefined);
                if (distinctions.every((distinction: DistinctionTypes): boolean =>
                    distinction !== null && distinction !== undefined)) {
                    G.publicPlayersOrder = distinctions as number[];
                }
            },
            onEnd: (G: MyGameState): void => {
                // todo Useless action because all distinctions are undefined?
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
        //@ts-ignore
        enumerate,
        objectives,
        iterations,
        playoutDepth,
    },
};
