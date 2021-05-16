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
    const isLastTavernEmpty = !G.taverns[G.tavernsNum - 1].some((element) => element !== null);
    if (isLastTavernEmpty) {
        if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
            G.tierToEnd--;
            if (G.tierToEnd === 0) return;
        }
        for (let i = 0; i < G.tavernsNum; i++) {
            G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        }
    }
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
        console.log(G.players[ctx.currentPlayer].handCoins[coinId]);
        const tempId = G.players[ctx.currentPlayer].handCoins.indexOf(null);
        G.players[ctx.currentPlayer].handCoins[tempId] = G.players[ctx.currentPlayer].boardCoins[coinId];
        G.players[ctx.currentPlayer].boardCoins[coinId] = null;
    } else if (G.players[ctx.currentPlayer].selectedCoin !== undefined) {
        const tempId = G.players[ctx.currentPlayer].selectedCoin;
        G.players[ctx.currentPlayer].boardCoins[coinId] = G.players[ctx.currentPlayer].handCoins[tempId];
        G.players[ctx.currentPlayer].handCoins[tempId] = null;
        G.players[ctx.currentPlayer].selectedCoin = undefined;
    } else {
        return INVALID_MOVE;
    }
}
