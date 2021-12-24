import type { Ctx, Game } from "boardgame.io";
import { PlayerView } from "boardgame.io/core";
import { ConfigNames, DrawNames } from "./actions/Actions";
import { DrawProfitCampAction } from "./actions/CampActions";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { RefillCamp } from "./Camp";
import { RusCardTypes } from "./Card";
import { ReturnCoinsToPlayerHands } from "./Coin";
import { CheckDistinction } from "./Distinction";
import { CampDeckCardTypes, DistinctionTypes, MyGameState, SetupGame } from "./GameSetup";
import { IResolveBoardCoins, ResolveBoardCoins } from "./helpers/CoinHelpers";
import { AddActionsToStack } from "./helpers/StackHelpers";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import {
    ClickCampCardHoldaMove, ClickCampCardMove, DiscardCard2PlayersMove,
    DiscardCardFromPlayerBoardMove,
    DiscardSuitCardFromPlayerBoardMove,
    GetMjollnirProfitMove
} from "./moves/CampMoves";
import {
    AddCoinToPouchMove,
    ClickBoardCoinMove,
    ClickCoinToUpgradeMove,
    ClickHandCoinMove,
    UpgradeCoinVidofnirVedrfolnirMove
} from "./moves/CoinMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove } from "./moves/HeroMoves";
import {
    ClickCardMove,
    ClickCardToPickDistinctionMove,
    ClickDistinctionCardMove,
    GetEnlistmentMercenariesMove,
    PassEnlistmentMercenariesMove,
    PickDiscardCardMove,
    PlaceEnlistmentMercenariesMove,
    StartEnlistmentMercenariesMove
} from "./moves/Moves";
import { CheckPlayersBasicOrder, IPublicPlayer, IStack } from "./Player";
import { ChangePlayersPriorities } from "./Priority";
import { ScoreWinner } from "./Score";
import { RefillTaverns } from "./Tavern";

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
interface IOrder {
    next: (G: MyGameState, ctx: Ctx) => number;
    first: () => number;
    playOrder: (G: MyGameState) => string[];
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum Phases {
    BrisingamensEndGame = `brisingamensEndGame`,
    EndTier = `endTier`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    GetDistinctions = `getDistinctions`,
    GetMjollnirProfit = `getMjollnirProfit`,
    PickCards = `pickCards`,
    PlaceCoins = `placeCoins`,
    PlaceCoinsUline = `placeCoinsUline`,
}

/**
 * <h3>Перечисление для стейджей игры.</h3>
 */
export const enum Stages {
    AddCoinToPouch = `addCoinToPouch`,
    DiscardCard = `discardCard`,
    DiscardCardFromBoard = `discardCardFromBoard`,
    DiscardSuitCard = `discardSuitCard`,
    PickCampCardHolda = `pickCampCardHolda`,
    PickDiscardCard = `pickDiscardCard`,
    PickDistinctionCard = `pickDistinctionCard`,
    PickHero = `pickHero`,
    PlaceCards = `placeCards`,
    PlaceTradingCoinsUline = `placeTradingCoinsUline`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeCoinVidofnirVedrfolnir = `upgradeCoinVidofnirVedrfolnir`,
}

// todo Add logging
// todo Add colors for cards Points by suit colors!
// todo Add dock block
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
                ClickHandCoinMove,
                ClickBoardCoinMove,
                BotsPlaceAllCoinsMove,
            },
            next: Phases.PickCards,
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
                order,
            },
            moves: {
                ClickHandCoinMove,
                ClickBoardCoinMove,
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
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
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
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
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
                            ClickHandCoinMove,
                            ClickBoardCoinMove,
                        },
                    },
                },
            },
            moves: {
                ClickCardMove,
                ClickCampCardMove,
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
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
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
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                StartEnlistmentMercenariesMove,
                PassEnlistmentMercenariesMove,
                GetEnlistmentMercenariesMove,
                PlaceEnlistmentMercenariesMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                const players: IPublicPlayer[] =
                    G.publicPlayers.map((player: IPublicPlayer): IPublicPlayer => player),
                    playersIndexes: number[] = [];
                players.sort((nextPlayer: IPublicPlayer, currentPlayer: IPublicPlayer): number => {
                    if (nextPlayer.campCards
                        .filter((card: CampDeckCardTypes): boolean =>
                            card.type === RusCardTypes.MERCENARY).length < currentPlayer.campCards
                                .filter((card: CampDeckCardTypes): boolean =>
                                    card.type === RusCardTypes.MERCENARY).length) {
                        return 1;
                    } else if (nextPlayer.campCards
                        .filter((card: CampDeckCardTypes): boolean =>
                            card.type === RusCardTypes.MERCENARY).length > currentPlayer.campCards
                                .filter((card: CampDeckCardTypes): boolean =>
                                    card.type === RusCardTypes.MERCENARY).length) {
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
                        .filter((card: CampDeckCardTypes): boolean =>
                            card.type === RusCardTypes.MERCENARY).length) {
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
                        action: DrawProfitCampAction.name,
                        playerId: G.publicPlayersOrder[0],
                        config: {
                            name: ConfigNames.StartOrPassEnlistmentMercenaries,
                            drawName: DrawNames.StartOrPassEnlistmentMercenaries,
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
                            DiscardCardMove,
                        },
                    },
                    placeCards: {
                        moves: {
                            PlaceCardMove,
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
                    addCoinToPouch: {
                        moves: {
                            AddCoinToPouchMove,
                        },
                    },
                    upgradeCoinVidofnirVedrfolnir: {
                        moves: {
                            UpgradeCoinVidofnirVedrfolnirMove,
                        },
                    },
                    discardSuitCard: {
                        moves: {
                            DiscardSuitCardFromPlayerBoardMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                    pickHero: {
                        moves: {
                            ClickHeroCardMove,
                        },
                    },
                    // End
                },
            },
            moves: {
                PlaceCardMove,
            },
        },
        getMjollnirProfit: {
            turn: {
                order,
            },
            moves: {
                GetMjollnirProfitMove,
            },
        },
        brisingamensEndGame: {
            turn: {
                order,
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
        },
        getDistinctions: {
            turn: {
                order,
                stages: {
                    pickDistinctionCard: {
                        moves: {
                            ClickCardToPickDistinctionMove,
                        },
                    },
                    upgradeCoin: {
                        moves: {
                            ClickCoinToUpgradeMove,
                        },
                    },
                },
            },
            next: Phases.PlaceCoins,
            moves: {
                ClickDistinctionCardMove,
            },
            onBegin: (G: MyGameState, ctx: Ctx): void => {
                CheckDistinction(G, ctx);
                const distinctions: DistinctionTypes[] =
                    Object.values(G.distinctions).filter((distinction: DistinctionTypes): boolean =>
                        distinction !== null && distinction !== undefined);
                if (distinctions.every((distinction: DistinctionTypes): boolean =>
                    distinction !== null && distinction !== undefined)) {
                    G.publicPlayersOrder = distinctions as number[];
                }
            },
            onEnd: (G: MyGameState): void => {
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
                RefillTaverns(G);
            },
            endIf: (G: MyGameState): boolean =>
                Object.values(G.distinctions).every((distinction: DistinctionTypes): boolean =>
                    distinction === undefined),
        },
    },
    onEnd: (G: MyGameState, ctx: Ctx) => {
        return ScoreWinner(G, ctx);
    },
    ai: {
        //@ts-ignore
        enumerate,
        iterations,
        objectives,
        playoutDepth,
    },
};
