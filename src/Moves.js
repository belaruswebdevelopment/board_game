import {INVALID_MOVE} from "boardgame.io/core";
import {AddCampCardToPlayer, AddCardToPlayer} from "./Player";
import {suitsConfigArray} from "./data/SuitData";
import {Trading, UpgradeCoin} from "./Coin";
import {CheckCurrentTavernEmpty, CheckEmptyLastTavern} from "./Tavern";
import {CheckPickHero} from "./Hero";

export const ClickHeroCard = (G, ctx, heroID) => {
    G.players[ctx.currentPlayer].heroes.push(G.heroes[heroID]);
    G.heroes[heroID] = null;
    if (CheckPickHero(G, ctx)) {
        ctx.events.endStage();
        ctx.events.setStage('pickHero');
    } else {
        ActivateTrading(G, ctx, G.currentTavern);
        CheckEmptyLastTavern(G, ctx);
        CheckCurrentTavernEmpty(G, ctx, G.currentTavern);
        ctx.events.endStage();
        ctx.events.endTurn();
    }
};

export const ClickCampCard = (G, ctx, cardId) => {
    // todo check if currentPlayer and win tavern! Add delete 1 card after all pick and correct next phase and draw camp cards
    AddCampCardToPlayer(G.players[ctx.currentPlayer], G.camp[cardId]);
    G.camp[cardId] = null;
    ctx.events.endTurn();
};

const ActivateTrading = (G, ctx, tavernId) => {
    if (G.players[ctx.currentPlayer].boardCoins[tavernId].isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.taverns.length; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
            tradingCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
        }
        Trading(G, ctx, tradingCoins);
    }
}

export const ClickCard = (G, ctx, tavernId, cardId) => {
    const isEarlyPick = tavernId > 0 && G.taverns[tavernId - 1].some((element) => element !== null),
        isEmptyPick = G.taverns[tavernId][cardId] === null;
    if (isEmptyPick || isEarlyPick) {
        return INVALID_MOVE;
    }
    const isAdded = AddCardToPlayer(G.players[ctx.currentPlayer], G.taverns[tavernId][cardId]);
    G.taverns[tavernId][cardId] = null;
    if (isAdded) {
        if (CheckPickHero(G, ctx)) {
            ctx.events.setStage('pickHero');
        } else {
            ActivateTrading(G, ctx, tavernId);
            CheckEmptyLastTavern(G, ctx);
            CheckCurrentTavernEmpty(G, ctx, tavernId);
            ctx.events.endTurn();
        }
    } else {
        ctx.events.setStage('upgradeCoin');
        G.drawProfit = "upgradeCoin";
    }
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

export const ClickDistinctionCard = (G, ctx, cardID) => {
    if (G.distinctions.some(item => item !== null)) {
        const index = G.distinctions.findIndex(id => id === Number(ctx.currentPlayer));
        if (index !== -1) {
            if (index === cardID) {
                suitsConfigArray[cardID].distinction.awarding(G, ctx, G.players[ctx.currentPlayer]);
            }
        } else {
            return INVALID_MOVE;
        }
    } else {
        return INVALID_MOVE;
    }
};

export const ClickCoinToUpgradeDistinction = (G, ctx, coinID) => {
    G.drawProfit = null;
    UpgradeCoin(G, ctx, coinID, 5);
    delete G.distinctions[3];
    ctx.events.endTurn();
};

export const ClickCoinToUpgrade = (G, ctx, coinID) => {
    G.drawProfit = null;
    UpgradeCoin(G, ctx, coinID, G.players[ctx.currentPlayer].boardCoins[coinID],
        G.players[ctx.currentPlayer].boardCoins[coinID].value + G.players[ctx.currentPlayer].pickedCard.value);
    ActivateTrading(G, ctx, G.currentTavern);
    CheckEmptyLastTavern(G, ctx);
    CheckCurrentTavernEmpty(G, ctx, G.currentTavern);
    ctx.events.endStage();
    ctx.events.endTurn();
};

export const ClickCardToPickDistinction = (G, ctx, cardID) => {
    G.drawProfit = null;
    G.players[ctx.currentPlayer].cards[G.decks[1][cardID].suit].push(G.decks[1][cardID]);
    G.decks[1].splice(cardID, 1);
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    delete G.distinctions[4];
    ctx.events.endTurn();
};
