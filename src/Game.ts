import { Ctx, Game } from "boardgame.io";
import { PlayerView, TurnOrder } from "boardgame.io/core";
import { DrawProfitCampAction } from "./actions/CampActions";
import { enumerate, iterations, objectives, playoutDepth } from "./AI";
import { RefillCamp } from "./Camp";
import { ReturnCoinsToPlayerHands } from "./Coin";
import { CheckDistinction } from "./Distinction";
import { SetupGame } from "./GameSetup";
import { ResolveBoardCoins } from "./helpers/CoinHelpers";
import { AddActionsToStack } from "./helpers/StackHelpers";
import { BotsPlaceAllCoinsMove } from "./moves/BotMoves";
import { ClickCampCardHoldaMove, ClickCampCardMove, DiscardCard2PlayersMove, DiscardCardFromPlayerBoardMove, DiscardSuitCardFromPlayerBoardMove, GetEnlistmentMercenariesMove, GetMjollnirProfitMove, PlaceEnlistmentMercenariesMove, StartEnlistmentMercenariesMove } from "./moves/CampMoves";
import { AddCoinToPouchMove, ClickBoardCoinMove, ClickCoinToUpgradeMove, ClickHandCoinMove, UpgradeCoinVidofnirVedrfolnirMove } from "./moves/CoinMoves";
import { ClickHeroCardMove, DiscardCardMove, PlaceCardMove } from "./moves/HeroMoves";
import { ClickCardMove, ClickCardToPickDistinctionMove, ClickDistinctionCardMove, PassEnlistmentMercenariesMove, PickDiscardCardMove } from "./moves/Moves";
import { CheckPlayersBasicOrder } from "./Player";
import { ChangePlayersPriorities } from "./Priority";
import { ScoreWinner } from "./Score";
import { RefillTaverns } from "./Tavern";
import { IStack } from "./typescript/action_interfaces";
import { CampDeckCardTypes } from "./typescript/card_types";
import { ActionTypes, ConfigNames, DrawNames, Phases, RusCardTypes } from "./typescript/enums";
import { IOrder, IResolveBoardCoins, MyGameState } from "./typescript/game_data_interfaces";
import { IPublicPlayer } from "./typescript/player_interfaces";
import { DistinctionTypes } from "./typescript/types";

// todo Add logging
// todo Add colors for cards Points by suit colors!
// todo Add dock block
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
export const BoardGame: Game<MyGameState> = {
    // todo Add all hooks external functions to all {}
    // todo Check all endPhase / setPhase &  next (may be with G.condition ? 'phaseC' : 'phaseB') in it => add next or better move to hooks functions
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
                // todo Move endTurn to moveLimit
                // minMoves: 2,
                // maxMoves: 2,
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
                // todo Move to CampHelpers?
                const players: IPublicPlayer[] =
                    G.publicPlayers.map((player: IPublicPlayer): IPublicPlayer => player),
                    playersIndexes: string[] = [];
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
                        playersIndexes.push(String(G.publicPlayers
                            .findIndex((player: IPublicPlayer): boolean =>
                                player.nickname === playerSorted.nickname)));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                const stack: IStack[] = [
                    {
                        action: {
                            name: DrawProfitCampAction.name,
                            type: ActionTypes.Camp,
                        },
                        playerId: Number(G.publicPlayersOrder[0]),
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
                // todo Move endTurn to moveLimit
                // minMoves: 1,
                // maxMoves: 1,
            },
            moves: {
                GetMjollnirProfitMove,
            },
        },
        brisingamensEndGame: {
            turn: {
                order,
                // todo Move endTurn to moveLimit
                // minMoves: 1,
                // maxMoves: 1,
            },
            moves: {
                DiscardCardFromPlayerBoardMove,
            },
        },
        getDistinctions: {
            // todo Allow Pick Hero and all acions from hero pick to this phase
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
                    G.publicPlayersOrder = distinctions as string[];
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        enumerate,
        iterations,
        objectives,
        playoutDepth,
    },
};
