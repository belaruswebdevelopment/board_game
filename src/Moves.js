import {INVALID_MOVE} from "boardgame.io/core";
import {AddCampCardToPlayer, AddCardToPlayer} from "./Player";

export const ClickHeroCard = (G, ctx, heroId) => {
    // todo Add logic
};

export const ClickCampCard = (G, ctx, cardId) => {
    // todo check if currentPlayer and win tavern! Add delete 1 card after all pick and correct next phase and draw camp cards
    AddCampCardToPlayer(G.players[ctx.currentPlayer], G.camp[cardId]);
    G.camp[cardId] = null;
    ctx.events.endTurn();
};

export const ClickCard = (G, ctx, tavernId, cardId) => {
    const isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null),
        isEmptyPick = G.taverns[tavernId][cardId] === null;
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
    const isLastTavernEmpty = G.taverns[G.tavernsNum - 1].every((element) => element === null);
    if (isLastTavernEmpty) {
        if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
            G.tierToEnd--;
            if (G.tierToEnd === 0) {
                return;
            }
        }
        for (let i = 0; i < G.tavernsNum; i++) {
            G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        }
        ctx.events.setPhase('placeCoins');
    }
    const isCurrentTavernEmpty = G.taverns[tavernId].every((element) => element === null);
    if (isCurrentTavernEmpty) {
        ctx.events.setPhase('pickCards');
    }
    ctx.events.endTurn();
};

export const ClickHandCoin = (G, ctx, coinId) => {
    const isEmptyPick = G.players[ctx.currentPlayer].handCoins[coinId] === null;
    if (isEmptyPick) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].selectedCoin = coinId;
};

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
        const isAllHandCoinsEmpty = G.players.every((element) => element.handCoins.every((e) => e === null));
        if (isAllHandCoinsEmpty) {
            ctx.events.endPhase({next: 'pickCards'});
        }
        if (G.players[ctx.currentPlayer].handCoins.every((element) => element === null)) {
            ctx.events.endTurn();
        }
    } else {
        return INVALID_MOVE;
    }
};

export const PlaceAllCoins = (G, ctx, coinsOrder) => {
    for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
        const coinId = coinsOrder[i] || G.players[ctx.currentPlayer].handCoins.findIndex(element => element !== null);
        G.players[ctx.currentPlayer].boardCoins[i] = G.players[ctx.currentPlayer].handCoins[coinId];
        G.players[ctx.currentPlayer].handCoins[coinId] = null;
    }
    const isAllHandCoinsEmpty = G.players.every((element) => element.handCoins.every((e) => e === null));
    if (isAllHandCoinsEmpty) {
        ctx.events.endPhase({next: 'pickCards'});
    }
    ctx.events.endTurn();
};

export const ResolveBoardCoins = (G, ctx) => {
    const playersOrder = [],
        coinValues = [],
        exchangeOrder = [],
        tavernId = G.taverns.findIndex(element => element.some(item => item !== null));
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersOrder.push(i);
        exchangeOrder.push(i);
        coinValues[i] = G.players[i].boardCoins[tavernId].value;
        for (let j = playersOrder.length - 1; j > 0; j--) {
            if (G.players[playersOrder[j]].boardCoins[tavernId].value > G.players[playersOrder[j - 1]].boardCoins[tavernId].value) {
                [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
            } else if (G.players[playersOrder[j]].boardCoins[tavernId].value === G.players[playersOrder[j - 1]].boardCoins[tavernId].value) {
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
        const tiePlayers = G.players.filter(player => player.boardCoins[tavernId].value === Number(prop) && player.priority.isExchangeable);
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
const Trading = (G, ctx, tradingCoins) => {
    const coinsTotalValue = tradingCoins.reduce((prev, current) => prev + current.value, 0),
        coinsMaxValue = tradingCoins.reduce((prev, current) => (prev < current.value) ? current.value : prev, 0);
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
    if (G.marketCoins.length) {
        if (coinsTotalValue > G.marketCoins[G.marketCoins.length - 1].value) {
            tradedCoin = G.marketCoins[G.marketCoins.length - 1];
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                if (G.marketCoins[i].value < coinsTotalValue) {
                    tradedCoin = G.marketCoins[i];
                } else if (G.marketCoins[i].value >= coinsTotalValue) {
                    tradedCoin = G.marketCoins[i];
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = null;
    if (tradedCoin !== null) {
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
};
