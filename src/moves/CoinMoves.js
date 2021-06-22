import {CoinUpgradeValidation, IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {Trading} from "../Coin";
import {CheckAndStartUlineActionsOrContinue} from "./HeroMoves";
import {AfterBasicPickCardActions} from "./Moves";
import {
    AddActionsToStack, AddActionsToStackAfterCurrent,
    EndActionFromStackAndAddNew, StartActionFromStackOrEndActions,
} from "../helpers/StackHelpers";
import {ActivateVidofnirVedrfolnirAction, AddCoinToPouchAction} from "../actions/CampActions";
// todo Add logging
export const ActivateTrading = (G, ctx) => {
    if (G.players[ctx.currentPlayer].boardCoins[G.currentTavern].isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
            tradingCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
        }
        Trading(G, ctx, tradingCoins);
        return true;
    } else {
        return false;
    }
};

export const ClickHandCoin = (G, ctx, coinId) => {
    const isValidMove = IsValidMove({
        obj: G.players[ctx.currentPlayer].handCoins[coinId],
        objId: coinId,
        range: [0, G.players[ctx.currentPlayer].handCoins.length]
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].selectedCoin = coinId;
};

export const ClickBoardCoin = (G, ctx, coinId) => {
    const player = G.players[ctx.currentPlayer],
        isValidMove = IsValidMove({objId: coinId, range: [0, player.boardCoins.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (player.boardCoins[coinId] !== null) {
        const tempId = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== undefined) {
        const tempId = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
        if (ctx.phase === "placeCoinsUline") {
            ctx.events.setPhase("pickCards");
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline") {
            G.actionsNum--;
            if (G.actionsNum === 0) {
                G.actionsNum = null;
            }
            AfterBasicPickCardActions(G, ctx);
        } else {
            const isEveryPlayersHandCoinsEmpty = G.players.filter(player => player.buffs?.["everyTurn"] !== "Uline")
                .every(player => player.handCoins.every(coin => coin === null));
            if (isEveryPlayersHandCoinsEmpty) {
                if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
                    ctx.events.setPhase("placeCoinsUline");
                } else {
                    ctx.events.setPhase("pickCards");
                }
            } else {
                if (player.handCoins.every(coin => coin === null)) {
                    ctx.events.endTurn();
                }
            }
        }
    } else {
        return INVALID_MOVE;
    }
};

export const BotsPlaceAllCoins = (G, ctx, coinsOrder) => {
    for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin !== null);
        G.players[ctx.currentPlayer].boardCoins[i] = G.players[ctx.currentPlayer].handCoins[coinId];
        G.players[ctx.currentPlayer].handCoins[coinId] = null;
    }
    const isEveryPlayersHandCoinsEmpty = G.players.filter(player => player.buffs?.["everyTurn"] !== "Uline")
        .every(player => player.handCoins.every(coin => coin === null));
    if (isEveryPlayersHandCoinsEmpty) {
        if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
            ctx.events.setPhase("placeCoinsUline");
        } else {
            ctx.events.setPhase("pickCards");
        }
    } else {
        if (G.players[ctx.currentPlayer].handCoins.every(coin => coin === null)) {
            ctx.events.endTurn();
        }
    }
};

export const ResolveBoardCoins = (G, ctx) => {
    const playersOrder = [],
        coinValues = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (G.players[i].boardCoins[G.currentTavern]?.value !== undefined) {
            coinValues[i] = G.players[i].boardCoins[G.currentTavern].value;
            playersOrder.push(i);
            exchangeOrder.push(i);
        }
        for (let j = playersOrder.length - 1; j > 0; j--) {
            if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value >
                G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
                [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
            } else if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value ===
                G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
                if (G.players[playersOrder[j]].priority.value > G.players[playersOrder[j - 1]].priority.value) {
                    [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
                }
            } else {
                break;
            }
        }
    }
    const counts = {};
    for (let i = 0; i < coinValues.length; i++) {
        counts[coinValues[i]] = 1 + (counts[coinValues[i]] || 0);
    }
    for (let prop in counts) {
        if (counts[prop] <= 1) {
            continue;
        }
        const tiePlayers = G.players.filter(player => player.boardCoins[G.currentTavern]?.value === Number(prop) && player.priority.isExchangeable);
        while (tiePlayers.length > 1) {
            const tiePlayersPriorities = tiePlayers.map(player => player.priority.value),
                maxPriority = Math.max(...tiePlayersPriorities),
                minPriority = Math.min(...tiePlayersPriorities),
                maxIndex = G.players.findIndex(player => player.priority.value === maxPriority),
                minIndex = G.players.findIndex(player => player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex(player => player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex(player => player.priority.value === minPriority), 1);
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrder[maxIndex], exchangeOrder[minIndex]];
        }
    }
    return {playersOrder, exchangeOrder};
};

export const ClickCoinToUpgrade = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.distinctions.length) {
        const isDistinction3 = G.distinctions[3] !== undefined;
        if (isDistinction3) {
            delete G.distinctions[3];
        } else if (!isDistinction3 && G.distinctions[4] !== undefined) {
            delete G.distinctions[4];
        }
    }
    G.drawProfit = null;
    return EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};

export const UpgradeCoinVidofnirVedrfolnir = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type) && G.stack[ctx.currentPlayer][0].stack.config.coinId !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.actionsNum === 2) {
        const stack = [
            {
                stack: {
                    actionName: "UpgradeCoinAction",
                    config: {
                        number: 2,
                        value: 3,
                    },
                },
            },
            {
                stack: {
                    actionName: "DrawProfitAction",
                    config: {
                        coinId,
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        number: 1,
                        value: 2,
                    },
                },
            },
            {
                stack: {
                    actionName: "UpgradeCoinAction",
                    config: {
                        coinId,
                        number: 1,
                        value: 2,
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    return EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};

export const AddCoinToPouch = (G, ctx, coinId) => {
    if (G.players[ctx.currentPlayer].handCoins[coinId] !== null) {
        G.actionsNum--;
        const stack = [
            {
                stack: {
                    actionName: "AddCoinToPouchAction",
                    config: {
                        stageName: "addCoinToPouch",
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
        return EndActionFromStackAndAddNew(G, ctx, [], coinId);
    } else {
        return INVALID_MOVE;
    }
};
