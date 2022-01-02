import { PlayerView } from "boardgame.io/core";
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
import { ActionTypes, ConfigNames, DrawNames, Phases, RusCardTypes } from "./typescript/enums";
// todo Add logging
// todo Add colors for cards Points by suit colors!
// todo Add dock block
const order = {
    first: () => 0,
    next: (G, ctx) => (ctx.playOrderPos + 1) % G.publicPlayersOrder.length,
    playOrder: (G) => G.publicPlayersOrder.map((order) => String(order)),
};
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
            onBegin: (G, ctx) => {
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
            onBegin: (G, ctx) => {
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
            onBegin: (G, ctx) => {
                G.currentTavern++;
                const { playersOrder, exchangeOrder } = ResolveBoardCoins(G, ctx);
                [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
            },
            onEnd: (G) => {
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
            onBegin: (G, ctx) => {
                // todo Move to CampHelpers?
                const players = G.publicPlayers.map((player) => player), playersIndexes = [];
                players.sort((nextPlayer, currentPlayer) => {
                    if (nextPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length < currentPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                        return 1;
                    }
                    else if (nextPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length > currentPlayer.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                        return -1;
                    }
                    if (nextPlayer.priority.value < currentPlayer.priority.value) {
                        return 1;
                    }
                    else if (nextPlayer.priority.value > currentPlayer.priority.value) {
                        return -1;
                    }
                    return 0;
                });
                players.forEach((playerSorted) => {
                    if (playerSorted.campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                        playersIndexes.push(G.publicPlayers
                            .findIndex((player) => player.nickname === playerSorted.nickname));
                    }
                });
                G.publicPlayersOrder = playersIndexes;
                if (playersIndexes.length > 1) {
                    G.publicPlayersOrder.push(playersIndexes[0]);
                }
                const stack = [
                    {
                        action: {
                            name: DrawProfitCampAction.name,
                            type: ActionTypes.Camp,
                        },
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
            onBegin: (G, ctx) => {
                CheckDistinction(G, ctx);
                const distinctions = Object.values(G.distinctions).filter((distinction) => distinction !== null && distinction !== undefined);
                if (distinctions.every((distinction) => distinction !== null && distinction !== undefined)) {
                    G.publicPlayersOrder = distinctions;
                }
            },
            onEnd: (G) => {
                if (G.expansions.thingvellir.active) {
                    RefillCamp(G);
                }
                RefillTaverns(G);
            },
            endIf: (G) => Object.values(G.distinctions).every((distinction) => distinction === undefined),
        },
    },
    onEnd: (G, ctx) => {
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
