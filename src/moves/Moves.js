import {INVALID_MOVE} from "boardgame.io/core";
import {AddCardToPlayer} from "../Player";
import {suitsConfig} from "../data/SuitData";
import {CheckCurrentTavernEmpty, RefillTaverns} from "../Tavern";
import {CheckPickHero, RemoveThrudFromPlayerBoardAfterGameEnd} from "../Hero";
import {IsValidMove} from "../MoveValidator";
import {DiscardCardIfCampCardPicked, RefillEmptyCampCards} from "../Camp";
import {CheckAndMoveThrud, CheckAndStartUlineActionsOrContinue, StartThrudMoving} from "./HeroMoves";
import {ActivateTrading} from "./CoinMoves";
import {DiscardCardFromTavern} from "../Card";

export const CheckEndTierPhaseEnded = (G, ctx) => {
    if (G.tierToEnd) {
        ctx.events.setPhase("getDistinctions");
    } else {
        RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        if (G.players[G.playersOrder[1]]?.buffs?.["discardCardEndGame"]) {
            G.drawProfit = "BrisingamensEndGameAction";
            ctx.events.endTurn();
        } else {
            ctx.events.endPhase();
            ctx.events.endGame();
        }
    }
}

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
export const AfterBasicPickCardActions = (G, ctx) => {
    if (G.players[ctx.currentPlayer].buffs?.["noHero"]) {
        delete G.players[ctx.currentPlayer].buffs["noHero"];
    } else if (G.players[ctx.currentPlayer].buffs?.["goCampOneTime"]) {
        delete G.players[ctx.currentPlayer].buffs?.["goCampOneTime"];
    }
    if (ctx.phase !== "endTier") {
        if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1]) &&
            ctx.playOrder.length < Number(ctx.numPlayers)) {
            const cardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
            DiscardCardFromTavern(G, cardIndex);
        }
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
                if (Number(ctx.currentPlayer) === Number(ctx.playOrder[0]) && G.campPicked && ctx.numPlayers === 2) {
                    G.drawProfit = "discardCard";
                    ctx.events.setStage("discardCard");
                } else {
                    ctx.events.endTurn();
                }
            }
        }
    } else {
        const isPlayerHasThrud = G.players[ctx.currentPlayer].heroes.findIndex(hero => hero.name === "Thrud") !== -1,
            isThrudOnThePlayerSuitBoard = G.players[ctx.currentPlayer].cards.flat().findIndex(card => card.name === "Thrud") !== -1;
        if (isPlayerHasThrud && !isThrudOnThePlayerSuitBoard) {
            const yludCard = G.players[ctx.currentPlayer].cards.flat().find(card => card.name === "Ylud");
            StartThrudMoving(G, ctx, yludCard);
        } else {
            CheckEndTierPhaseEnded(G, ctx);
        }
    }
};

const CheckEndTierActions = (G, ctx) => {
    G.playersOrder = [];
    let ylud = false,
        index = -1;
    for (let i = 0; i < G.players.length; i++) {
        index = G.players[i].heroes.findIndex(hero => hero.name === "Ylud");
        if (index !== -1) {
            ylud = true;
            G.playersOrder.push(i);
        }
    }
    if (!ylud) {
        for (let i = 0; i < G.players.length; i++) {
            for (let j = 0; j < G.suitsNum; j++) {
                index = G.players[i].cards[j].findIndex(card => card.name === "Ylud");
                if (index !== -1) {
                    G.players[ctx.currentPlayer].cards[i].splice(index, 1);
                    G.playersOrder.push(i);
                }
            }
        }
    }
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (G.players[i].buffs?.["discardCardEndGame"]) {
            G.playersOrder.push(i);
            break;
        }
    }
    if (G.playersOrder.length) {
        G.drawProfit = "endTier";
        ctx.events.setPhase("endTier");
    } else {
        if (!G.tierToEnd) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
            ctx.events.endPhase();
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

export const ClickDistinctionCard = (G, ctx, cardID) => {
    const index = G.distinctions.findIndex(id => id === Number(ctx.currentPlayer)),
        isValidMove = IsValidMove({objId: cardID, values: [index]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[Object.keys(suitsConfig)[cardID]].distinction.awarding(G, ctx, G.players[ctx.currentPlayer]);
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
