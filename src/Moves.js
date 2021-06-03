import {INVALID_MOVE} from "boardgame.io/core";
import {AddCampCardToPlayer, AddCardToPlayer} from "./Player";
import {suitsConfigArray} from "./data/SuitData";
import {Trading} from "./Coin";
import {CheckCurrentTavernEmpty, CheckEmptyLastTavern} from "./Tavern";
import {CheckPickHero} from "./Hero";
import {IsValidMove} from "./MoveValidator";
import {ActionDispatcher} from "./Actions";

export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].heroes.push(G.heroes[heroId]);
    G.heroes[heroId] = null;
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
    // todo Is it real to create isValidMove with different conditions? {condition: [G.expansions.thingvellir], [Number(ctx.currentPlayer), G.playersOrder[0]]]}
    //  -> if 1 argument check on true, if 2 arguments compare === on true
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]}) &&
        G.expansions.thingvellir && Number(ctx.currentPlayer) === G.playersOrder[0];
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // todo Add delete 1 card after all pick and correct next phase and draw camp cards
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
    const isValidMove = IsValidMove({objId: tavernId, values: [G.currentTavern]}) &&
        IsValidMove({obj: G.taverns[tavernId][cardId], objId: cardId, range: [0, G.taverns[tavernId].length]});
    if (!isValidMove) {
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
    const isValidMove = IsValidMove({obj: G.players[ctx.currentPlayer].handCoins[coinId], objId: coinId, range: [0, G.players[ctx.currentPlayer].handCoins.length]});
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
        const isHandCoinsEmpty = G.players.every((element) => element.handCoins.every((e) => e === null));
        if (isHandCoinsEmpty) {
            ctx.events.endPhase({next: 'pickCards'});
        }
        if (player.handCoins.every((element) => element === null)) {
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
    const isHandCoinsEmpty = G.players.every((element) => element.handCoins.every((e) => e === null));
    if (isHandCoinsEmpty) {
        ctx.events.endPhase({next: 'pickCards'});
    }
    ctx.events.endTurn();
};

export const ResolveBoardCoins = (G, ctx) => {
    const playersOrder = [],
        coinValues = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersOrder.push(i);
        exchangeOrder.push(i);
        coinValues[i] = G.players[i].boardCoins[G.currentTavern].value;
        for (let j = playersOrder.length - 1; j > 0; j--) {
            if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value > G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
                [playersOrder[j], playersOrder[j - 1]] = [playersOrder[j - 1], playersOrder[j]];
            } else if (G.players[playersOrder[j]].boardCoins[G.currentTavern].value === G.players[playersOrder[j - 1]].boardCoins[G.currentTavern].value) {
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
        const tiePlayers = G.players.filter(player => player.boardCoins[G.currentTavern].value === Number(prop) && player.priority.isExchangeable);
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
    const index = G.distinctions.findIndex(id => id === Number(ctx.currentPlayer)),
        isValidMove = IsValidMove({objId: cardID, values: [index]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfigArray[Object.keys(suitsConfigArray)[cardID]].distinction.awarding(G, ctx, G.players[ctx.currentPlayer]);
};

const ActivateCoinUpgrade = (G, ctx, coinID) => {
    if (G.players[ctx.currentPlayer].boardCoins[coinID].isTriggerTrading) {
        return INVALID_MOVE;
    }
    G.drawProfit = null;
    ActionDispatcher(G.players[ctx.currentPlayer].pickedCard.action, G, ctx, coinID, G.players[ctx.currentPlayer].boardCoins[coinID], G.players[ctx.currentPlayer].boardCoins[coinID].value);
}

export const ClickCoinToUpgradeDistinction = (G, ctx, coinID) => {
    ActivateCoinUpgrade(G, ctx, coinID);
    delete G.distinctions[3];
    ctx.events.endTurn();
};

export const ClickCoinToUpgradeInDistinction = (G, ctx, coinID) => {
    ActivateCoinUpgrade(G, ctx, coinID);
    delete G.distinctions[4];
    ctx.events.endStage();
    ctx.events.endTurn();
};

export const ClickCoinToUpgrade = (G, ctx, coinID) => {
    ActivateCoinUpgrade(G, ctx, coinID);
    ActivateTrading(G, ctx, G.currentTavern);
    CheckEmptyLastTavern(G, ctx);
    CheckCurrentTavernEmpty(G, ctx, G.currentTavern);
    ctx.events.endStage();
    ctx.events.endTurn();
};

export const ClickCardToPickDistinction = (G, ctx, cardID) => {
    G.drawProfit = null;
    const isAdded = AddCardToPlayer(G.players[ctx.currentPlayer], G.decks[1][cardID]);
    G.decks[1].splice(cardID, 1);
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if (isAdded) {
        delete G.distinctions[4];
        ctx.events.endStage();
        ctx.events.endTurn();
    } else {
        ctx.events.setStage('upgradeCoinInDistinction');
        G.drawProfit = "upgradeCoinDistinction";
    }
};
