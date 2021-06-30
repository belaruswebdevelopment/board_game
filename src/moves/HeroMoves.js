import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
// todo Add logging
export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, G.heroes[heroId].stack);
};

export const PlaceCard = (G, ctx, suitId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit) {
        const suitId = GetSuitIndexByName(card.suit),
            index = G.players[ctx.currentPlayer].cards[suitId].findIndex(card => card.name === "Thrud");
        if (index !== -1) {
            G.players[ctx.currentPlayer].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

export const StartThrudMoving = (G, ctx, card) => {
    const stack = [
        {
            actionName: "DrawProfitAction",
            config: {
                hero: "Thrud",
                name: "placeCards",
                stageName: "placeCards",
                suit: card.suit,
                variants: {
                    blacksmith: {
                        suit: "blacksmith",
                        rank: 1,
                        points: null,
                    },
                    hunter: {
                        suit: "hunter",
                        rank: 1,
                        points: null,
                    },
                    explorer: {
                        suit: "explorer",
                        rank: 1,
                        points: null,
                    },
                    warrior: {
                        suit: "warrior",
                        rank: 1,
                        points: null,
                    },
                    miner: {
                        suit: "miner",
                        rank: 1,
                        points: null,
                    },
                },
            },
        },
        {
            actionName: "PlaceThrudAction",
            config: {
                hero: "Thrud",
                variants: {
                    blacksmith: {
                        suit: "blacksmith",
                        rank: 1,
                        points: null,
                    },
                    hunter: {
                        suit: "hunter",
                        rank: 1,
                        points: null,
                    },
                    explorer: {
                        suit: "explorer",
                        rank: 1,
                        points: null,
                    },
                    warrior: {
                        suit: "warrior",
                        rank: 1,
                        points: null,
                    },
                    miner: {
                        suit: "miner",
                        rank: 1,
                        points: null,
                    },
                },
            },
        },
    ];
    AddActionsToStackAfterCurrent(G, ctx, stack);
};

export const DiscardCard = (G, ctx, suitId, cardId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

export const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    // todo Rework it all!
    const ulinePlayerIndex = G.players.findIndex(player => player.buffs?.["everyTurn"] === "Uline");
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers?.[ctx.currentPlayer] !== "placeTradingCoinsUline" && ulinePlayerIndex === Number(ctx.currentPlayer) &&
            G.players[ctx.currentPlayer].boardCoins[G.currentTavern].isTriggerTrading) {
            if (G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null)) {
                G.actionsNum = G.suitsNum - G.tavernsNum;
                ctx.events.setStage("placeTradingCoinsUline");
                return "placeTradingCoinsUline";
            }
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && !G.actionsNum) {
            ctx.events.endStage();
            return "endPlaceTradingCoinsUline";
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        } else {
            return "placeCoinsUline";
        }
    } else if (ctx.phase !== "pickCards") {
        ctx.events.setPhase("pickCards");
    }
    return false;
};
