import {INVALID_MOVE} from "boardgame.io/core";
import {AddCampCardToPlayer, AddCardToPlayer} from "./Player";
import {suitsConfig} from "./data/SuitData";
import {Trading} from "./Coin";
import {CheckCurrentTavernEmpty, RefillTaverns} from "./Tavern";
import {CheckPickHero} from "./Hero";
import {CoinUpgradeValidation, IsValidMove} from "./MoveValidator";
import {ActionDispatcher} from "./Actions";
import {heroesConfig} from "./data/HeroData";
import {DiscardCardIfCampCardPicked, RefillEmptyCampCards} from "./Camp";
import {CreateCard, DiscardCardFromTavern} from "./Card";

// todo Add checking if only with thingvellir expansion action?
export const GridAction = (G, ctx, coinID, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinID, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, heroesConfig["Grid"].action.config.action.config.action, coinID, type, isInitial);
};

export const PickDiscardCard = (G, ctx, cardId) => {
    G.drawProfit = null;
    const isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]);
    G.discardCardsDeck.splice(cardId, 1);
    delete G.players[ctx.currentPlayer].buffs["pickDiscardCard"];
    if (isAdded) {
        if (CheckPickHero(G, ctx)) {
            ctx.events.setStage("pickHero");
        } else {
            EndHeroAction(G, ctx);
        }
    } else {
        G.drawProfit = "upgradeCoinFromDiscard";
    }
};

export const UpgradeCoinFromDiscard = (G, ctx, coinID, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinID, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, G.players[ctx.currentPlayer].pickedCard.action, coinID, type, isInitial);
    EndHeroAction(G, ctx);
};

export const PlaceCard = (G, ctx, suitId) => {
    G.players[ctx.currentPlayer].pickedCard = {
        suit: suitId,
    };
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    }
    const olwinDouble = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        name: "Olwin",
    });
    AddCardToPlayer(G, ctx, olwinDouble);
    G.actionsNum--;
    if (!G.actionsNum) {
        G.drawProfit = null;
        G.actionsNum = null;
        EndHeroAction(G, ctx);
    }
};

export const PlaceYlud = (G, ctx, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    } else if (suit === "explorer") {
        points = 11;
    } else if (suit === "warrior") {
        points = 7;
    } else if (suit === "miner") {
        points = 1;
    }
    let index;
    for (let i = 0; i < G.suitsNum; i++) {
        index = G.players[ctx.currentPlayer].cards[i].findIndex(card => card.name === "Ylud");
        if (index !== -1) {
            G.players[ctx.currentPlayer].cards[i].splice(index, 1);
        }
    }
    const yludCard = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        name: "Ylud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, yludCard);
    const isMoveThrud = CheckAndMoveThrud(G, ctx, yludCard);
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        if (!isMoveThrud) {
            ctx.events.endPhase();
        } else {
            StartThrudMoving(G, ctx, yludCard);
        }
    }
};

export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit) {
        const suitId = Object.keys(suitsConfig).findIndex(suit => suit === card.suit),
            index = G.players[ctx.currentPlayer].cards[suitId].findIndex(card => card.name === "Thrud");
        if (index !== -1) {
            G.players[ctx.currentPlayer].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

const AddThrudOnPlayerBoard = (G, ctx, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    } else if (suit === "explorer" || suit === "warrior" || suit === "miner") {
        points = 0;
    }
    const thrudCard = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        name: "Thrud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, thrudCard);
};

export const StartThrudMoving = (G, ctx, card) => {
    G.players[ctx.currentPlayer].pickedCard = card;
    G.drawProfit = "moveThrud";
    ctx.events.setStage("moveThrud");
};

export const PlaceThrud = (G, ctx, suitId) => {
    AddThrudOnPlayerBoard(G, ctx, suitId);
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        EndHeroAction(G, ctx);
    }
};

export const MoveThrud = (G, ctx, suitId) => {
    AddThrudOnPlayerBoard(G, ctx, suitId);
    G.drawProfit = null;
    if (CheckPickHero(G, ctx)) {
        ctx.events.setStage("pickHero");
    } else {
        AfterBasicPickCardActions(G, ctx);
    }
};

export const DiscardCard = (G, ctx, suitId, cardId, hero = null) => {
    G.players[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].cards[suitId][cardId];
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1));
    G.actionsNum--;
    if (!G.actionsNum) {
        G.drawProfit = null;
        G.actionsNum = null;
        ActionDispatcher(G, ctx, heroesConfig[hero].action.config.action);
    }
};

export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ctx.events.endStage();
    ctx.events.setStage("heroAction");
    return ActionDispatcher(G, ctx, G.heroes[heroId].action);
};

export const PickCampCardHolda = (G, ctx, cardId) => {
    AddCampCardToPlayer(G, ctx, G.camp[cardId]);
    G.camp[cardId] = null;
    EndHeroAction(G, ctx);
};

export const EndHeroAction = (G, ctx) => {
    G.drawProfit = null;
    if (CheckPickHero(G, ctx)) {
        ctx.events.endStage();
        ctx.events.setStage("pickHero");
    } else {
        ctx.events.endStage();
        AfterBasicPickCardActions(G, ctx);
    }
};

export const ClickCampCard = (G, ctx, cardId) => {
    // todo Is it real to create isValidMove with different conditions? {condition: [G.expansions.thingvellir], [Number(ctx.currentPlayer), G.playersOrder[0]]]}
    //  -> if 1 argument check on true, if 2 arguments compare === on true
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.expansions.thingvellir && Number(ctx.currentPlayer) === G.playersOrder[0];
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddCampCardToPlayer(G, ctx, G.camp[cardId]);
    G.camp[cardId] = null;
    G.campPicked = true;
    if (ctx.numPlayers === 2) {
        G.drawProfit = "discardCard";
        ctx.events.setStage("discardCard");
    } else {
        AfterBasicPickCardActions(G, ctx);
    }
};

export const DiscardCard2Players = (G, ctx, cardId) => {
    DiscardCardFromTavern(G, cardId);
    G.drawProfit = null;
    AfterBasicPickCardActions(G, ctx);
};

const ActivateTrading = (G, ctx) => {
    if (G.players[ctx.currentPlayer].boardCoins[G.currentTavern].isTriggerTrading) {
        const tradingCoins = [];
        for (let i = G.tavernsNum; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
            tradingCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
        }
        Trading(G, ctx, tradingCoins);
    }
};

const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    const ulinePlayerIndex = G.players.findIndex(player => player.buffs?.["everyTurn"] === "Uline");
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers?.[ctx.currentPlayer] !== "placeTradingCoinsUline" && ulinePlayerIndex === Number(ctx.currentPlayer) &&
            G.players[ctx.currentPlayer].boardCoins[G.currentTavern].isTriggerTrading) {
            G.actionsNum = G.suitsNum - G.tavernsNum;
            ctx.events.setStage("placeTradingCoinsUline");
            return "placeTradingCoinsUline";
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && !G.actionsNum ) {
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

/**
 * Выполняет основные действия после выбора базовых карт.
 * Применения:
 * 1) После выбора карты дворфа из таверны.
 * 2) После выбора карты улучшения монеты из таверны.
 * 3) После выбора карты из кэмпа.
 * 3) После выбора героев.
 *
 * @param G
 * @param ctx
 * @constructor
 */
const AfterBasicPickCardActions = (G, ctx) => {
    if (ctx.phase !== "endTier") {
        const isUlinePlaceTradingCoin = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== "placeTradingCoinsUline" && isUlinePlaceTradingCoin !== "nextPlaceTradingCoinsUline") {
            ActivateTrading(G, ctx);
            if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1])) {
                DiscardCardIfCampCardPicked(G);
            }
            const isLastTavern = G.tavernsNum - 1 === G.currentTavern,
                isCurrentTavernEmpty = CheckCurrentTavernEmpty(G, ctx);
            if (isCurrentTavernEmpty && isLastTavern) {
                AfterLastTavernEmptyActions(G, ctx);
            } else if (isCurrentTavernEmpty) {
                const isPlaceCoinsUline = CheckAndStartUlineActionsOrContinue(G, ctx);
                if (isPlaceCoinsUline !== "endPlaceTradingCoinsUline" && isPlaceCoinsUline !== "placeCoinsUline") {
                    ctx.events.setPhase("pickCards");
                } else {
                    ctx.events.setPhase("placeCoinsUline")
                }
            } else {
                ctx.events.endTurn();
            }
        }
    } else {
        const isPlayerHasThrud = G.players[ctx.currentPlayer].heroes.findIndex(hero => hero.name === "Thrud") !== -1,
            isThrudOnThePlayerSuitBoard = G.players[ctx.currentPlayer].cards.flat().findIndex(card => card.name === "Thrud") !== -1;
        if (isPlayerHasThrud && !isThrudOnThePlayerSuitBoard) {
                const yludCard = G.players[ctx.currentPlayer].cards.flat().find(card => card.name === "Ylud");
                StartThrudMoving(G, ctx, yludCard);
        } else {
            if (G.tierToEnd) {
                ctx.events.setPhase("getDistinctions");
            } else {
                ctx.events.endGame();
            }
        }
    }
};

const CheckEndTierActions = (G, ctx) => {
    G.playersOrder = [];
    let ylud = false;
    for (let i = 0; i < G.players.length; i++) {
        const index = G.players[i].heroes.findIndex(hero => hero.name === "Ylud");
        if (index !== -1) {
            ylud = true;
            G.playersOrder.push(i);
        }
    }
    if (!ylud) {
        for (let i = 0; i < G.players.length; i++) {
            for (let j = 0; j < G.suitsNum; j++) {
                const index = G.players[i].cards[j].findIndex(card => card?.name === "Ylud");
                if (index !== -1) {
                    G.playersOrder.push(i);
                }
            }
        }
    }
    if (G.playersOrder.length) {
        G.drawProfit = "endTier";
        ctx.events.setPhase("endTier");
    } else {
        if (!G.tierToEnd) {
            ctx.events.endGame();
        } else {
            ctx.events.setPhase("getDistinctions");
        }
    }
};

/**
 * Выполняет основные действия после того как опустела последняя таверна.
 * Применения:
 * 1) После того как опустела последняя таверна.
 *
 * @todo Refill taverns only on the beginning of the round (Add phase Round?)!
 * @param G
 * @param ctx
 * @constructor
 */
const AfterLastTavernEmptyActions = (G, ctx) => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
        CheckEndTierActions(G, ctx);
    } else {
        RefillEmptyCampCards(G);
        RefillTaverns(G);
        ctx.events.setPhase("placeCoins");
    }
};

export const ClickCard = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({objId: G.currentTavern, values: [G.currentTavern]}) &&
        IsValidMove({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length]
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card = G.taverns[G.currentTavern][cardId];
    G.taverns[G.currentTavern][cardId] = null;
    const isAdded = AddCardToPlayer(G, ctx, card),
        thrud = CheckAndMoveThrud(G, ctx, card);
    if (thrud) {
        StartThrudMoving(G, ctx, card);
    } else {
        if (isAdded) {
            if (CheckPickHero(G, ctx)) {
                ctx.events.setStage("pickHero");
            } else {
                AfterBasicPickCardActions(G, ctx);
            }
        } else {
            ctx.events.setStage("upgradeCoin");
            G.drawProfit = "upgradeCoin";
        }
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
            if (!G.actionsNum) {
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
        playersOrder.push(i);
        exchangeOrder.push(i);
        coinValues[i] = G.players[i].boardCoins[G.currentTavern].value;
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
    suitsConfig[Object.keys(suitsConfig)[cardID]].distinction.awarding(G, ctx, G.players[ctx.currentPlayer]);
};

const ActivateCoinUpgrade = (G, ctx, action, coinID, type, isInitial) => {
    G.drawProfit = null;
    ActionDispatcher(G, ctx, action, coinID, type, isInitial, G.players[ctx.currentPlayer].boardCoins[coinID], G.players[ctx.currentPlayer].boardCoins[coinID].value);
};

export const ClickCoinToUpgradeDistinction = (G, ctx, coinID, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinID, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, G.players[ctx.currentPlayer].pickedCard.action, coinID, type, isInitial);
    delete G.distinctions[3];
    ctx.events.endTurn();
};

export const ClickCoinToUpgradeInDistinction = (G, ctx, coinID, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinID, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, G.players[ctx.currentPlayer].pickedCard.action, coinID, type, isInitial);
    delete G.distinctions[4];
    ctx.events.endTurn();
};

export const ClickCoinToUpgrade = (G, ctx, coinID, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinID, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ActivateCoinUpgrade(G, ctx, G.players[ctx.currentPlayer].pickedCard.action, coinID, type, isInitial);
    AfterBasicPickCardActions(G, ctx);
};

export const ClickCardToPickDistinction = (G, ctx, cardID) => {
    G.drawProfit = null;
    const isAdded = AddCardToPlayer(G, ctx, G.decks[1][cardID]);
    G.decks[1].splice(cardID, 1);
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if (isAdded) {
        delete G.distinctions[4];
        ctx.events.endStage();
        ctx.events.endTurn();
    } else {
        ctx.events.setStage("upgradeCoinInDistinction");
        G.drawProfit = "upgradeCoinDistinction";
    }
};
