import {CoinUpgradeValidation, IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";
import {CheckAndStartUlineActionsOrContinue} from "../helpers/HeroHelpers";

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
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type) && G.stack[ctx.currentPlayer][0].config.coinId !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.actionsNum === 2) {
        const stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 2,
                    value: 3,
                },
            },
            {
                actionName: "DrawProfitAction",
                config: {
                    coinId,
                    name: "VidofnirVedrfolnirAction",
                    stageName: "upgradeCoinVidofnirVedrfolnir",
                    number: 1,
                    value: 2,
                },
            },
            {
                actionName: "UpgradeCoinAction",
                config: {
                    coinId,
                    number: 1,
                    value: 2,
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
                actionName: "AddCoinToPouchAction",
                config: {
                    stageName: "addCoinToPouch",
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
        return EndActionFromStackAndAddNew(G, ctx, [], coinId);
    } else {
        return INVALID_MOVE;
    }
};
