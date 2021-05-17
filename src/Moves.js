import {INVALID_MOVE} from "boardgame.io/core";
import {AddCardToPlayer} from "./Player";

export const ClickCard = (G, ctx, tavernId, cardId) => {
    const isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null);
    const isEmptyPick = G.taverns[tavernId][cardId] === null;
    if (isEmptyPick || isEarlyPick) {
        return INVALID_MOVE;
    }
    AddCardToPlayer(G.players[ctx.currentPlayer], G.taverns[tavernId][cardId]);
    G.taverns[tavernId][cardId] = null;
    if (G.players[ctx.currentPlayer].boardCoins[tavernId].isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.taverns.length; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
            tradingCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
        }
        Trading(G, ctx, tradingCoins);
    }
    const isLastTavernEmpty = !G.taverns[G.tavernsNum - 1].some((element) => element !== null);
    if (isLastTavernEmpty) {
        if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
            G.tierToEnd--;
            if (G.tierToEnd === 0) return;
        }
        for (let i = 0; i < G.tavernsNum; i++) {
            G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        }
        ctx.events.endPhase({next: 'placeCoins'});
    }
    ctx.events.endTurn();
}
export const ClickHandCoin = (G, ctx, coinId) => {
    const isEmptyPick = G.players[ctx.currentPlayer].handCoins[coinId] === null;
    if (isEmptyPick) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].selectedCoin = coinId;
}

export const ClickBoardCoin = (G, ctx, coinId) => {
    const isWrongPick = false;
    if (isWrongPick) {
        return INVALID_MOVE;
    }
    if (G.players[ctx.currentPlayer].boardCoins[coinId] !== null) {
        const tempId = G.players[ctx.currentPlayer].handCoins.indexOf(null);
        G.players[ctx.currentPlayer].handCoins[tempId] = G.players[ctx.currentPlayer].boardCoins[coinId];
        G.players[ctx.currentPlayer].boardCoins[coinId] = null;
    } else if (G.players[ctx.currentPlayer].selectedCoin !== undefined) {
        const tempId = G.players[ctx.currentPlayer].selectedCoin;
        G.players[ctx.currentPlayer].boardCoins[coinId] = G.players[ctx.currentPlayer].handCoins[tempId];
        G.players[ctx.currentPlayer].handCoins[tempId] = null;
        G.players[ctx.currentPlayer].selectedCoin = undefined;
        const isAllHandCoinsEmpty = !G.players.some((element) => element.handCoins.some((e) => e !== null));
        if (isAllHandCoinsEmpty) {
            ctx.events.endPhase({next: 'placeCoins'});
        }
        if (!G.players[ctx.currentPlayer].handCoins.some((element) => element !== null)) {
            ctx.events.endTurn();
        }
    } else {
        return INVALID_MOVE;
    }
}

export const ResolveBoardCoins = (G, ctx, tavernId) => {
    const boardCoins = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        boardCoins.push(G.players[i].boardCoins[tavernId]);
    }
    const indexedBoardCoins = boardCoins.map((coin, index) => ({
        coin,
        index,
    }));
    indexedBoardCoins.sort((currentCoin, nextCoin) =>
        (currentCoin.coin.value < nextCoin.coin.value) ||
        ((currentCoin.coin.value === nextCoin.coin.value) && (G.players[currentCoin.index].priority < G.players[nextCoin.index].priority)) ? 1 : -1);
    const playersOrder = indexedBoardCoins.map(coin => coin.index);
    // todo Priority exchange order
    const priorityExchangeOrder = [];
    return {playersOrder, priorityExchangeOrder};
}

const Trading = (G, ctx, tradingCoins) => {
    const coinsTotalValue = tradingCoins.reduce((prev, current) => prev + current.value, 0);
    const coinsMaxValue = tradingCoins.reduce((prev, current) => (prev.value > current.value) ? prev.value : current.value, 0);
    let coinMaxIndex = null;
    for (let i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            if (tradingCoins[i].isInitial) {
                break;
            }
        }
    }
    let tradedCoin = null;
    if (coinsTotalValue > G.marketCoins[G.marketCoins.length - 1].value) {
        tradedCoin = G.marketCoins[G.marketCoins.length - 1];
    } else {
        for (let i = 0; i < G.marketCoins.length; i++) {
            if (G.marketCoins[i].value < coinsTotalValue) {
                tradedCoin = G.marketCoins[i];
            } else if (G.marketCoins[i].value === coinsTotalValue) {
                tradedCoin = G.marketCoins[i];
                G.marketCoins.splice(i, 1);
                break;
            } else {
                tradedCoin = G.marketCoins[i];
                G.marketCoins.splice(i, 1);
                break;
            }
            if (i === G.marketCoins.length - 1) {
                G.marketCoins.splice(i, 1);
            }
        }
    }
    G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = null;
    if (tradedCoin) {
        G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = tradedCoin;
        if (!tradingCoins[coinMaxIndex].isInitial) {
            let returningIndex = null;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                if (G.marketCoins[i].value > tradingCoins[coinMaxIndex].value) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, tradingCoins[coinMaxIndex]);
        }
    } else {
        G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = tradingCoins[coinMaxIndex];
    }
}