import {INVALID_MOVE} from "boardgame.io/core";
import {AddCardToPlayer} from "../Player";
import {suitsConfig} from "../data/SuitData";
import {CheckIfCurrentTavernEmpty, RefillTaverns} from "../Tavern";
import {RemoveThrudFromPlayerBoardAfterGameEnd} from "../Hero";
import {IsValidMove} from "../MoveValidator";
import {DiscardCardIfCampCardPicked, RefillEmptyCampCards} from "../Camp";
import {CheckAndStartUlineActionsOrContinue, StartThrudMoving} from "./HeroMoves";
import {ActivateTrading} from "./CoinMoves";
import {DiscardCardFromTavern} from "../Card";
import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionFromStackAndAddNew,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
import {CheckAndMoveThrudOrPickHeroAction} from "../actions/HeroActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";

// todo Add logging
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
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export const AfterBasicPickCardActions = (G, ctx, isTrading) => {
    // todo rework it all!
    G.players[ctx.currentPlayer].pickedCard = null;
    if (G.players[ctx.currentPlayer].buffs?.["goCampOneTime"]) {
        // todo Rework it or delete in the Click camp card move?
        delete G.players[ctx.currentPlayer].buffs?.["goCampOneTime"];
    }
    if (ctx.phase === "pickCards") {
        const isUlinePlaceTradingCoin = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== "placeTradingCoinsUline" && isUlinePlaceTradingCoin !== "nextPlaceTradingCoinsUline") {
            let isTradingActivated = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1]) &&
                    ctx.playOrder.length < Number(ctx.numPlayers)) {
                    const cardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
                    DiscardCardFromTavern(G, cardIndex);
                }
                if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1])) {
                    G.campPicked = false;
                    DiscardCardIfCampCardPicked(G);
                }
                const isLastTavern = G.tavernsNum - 1 === G.currentTavern,
                    isCurrentTavernEmpty = CheckIfCurrentTavernEmpty(G, ctx);
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
        }
    } else if (ctx.phase === "endTier") {
        const isPlayerHasThrud = G.players[ctx.currentPlayer].heroes.findIndex(hero => hero.name === "Thrud") !== -1,
            isThrudOnThePlayerSuitBoard = G.players[ctx.currentPlayer].cards.flat().findIndex(card => card.name === "Thrud") !== -1;
        if (isPlayerHasThrud && !isThrudOnThePlayerSuitBoard) {
            const yludCard = G.players[ctx.currentPlayer].cards.flat().find(card => card.name === "Ylud");
            // todo FIXIT
            StartThrudMoving(G, ctx, yludCard);
        } else {
            CheckEndTierPhaseEnded(G, ctx);
        }
    } else if (ctx.phase === "getDistinctions") {
        ctx.events.endTurn();
    } else if (ctx.phase === "enlistmentMercenaries") {
        if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1])) {
            ctx.events.setPhase("endTier");
        } else {
            ctx.events.endTurn();
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
 * Проверяет есть ли у игроков наёмники для начала их вербовки.
 * Применения:
 * 1) При наличии у игроков наёмников в конце текущей эпохи.
 *
 * @param G
 * @param ctx
 * @constructor
 */
const CheckEnlistmentMercenaries = (G, ctx) => {
    let count = false;
    for (let i = 0; i < G.players.length; i++) {
        if (G.players[i].campCards.filter(card => card.type === "наёмник").length > 0) {
            count = true;
            break;
        }
    }
    if (count) {
        ctx.events.setPhase("enlistmentMercenaries");
    } else {
        CheckEndTierActions(G, ctx);
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
        if (G.expansions.thingvellir) {
            CheckEnlistmentMercenaries(G, ctx);
        } else {
            CheckEndTierActions(G, ctx);
        }
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
    let suitId = null;
    G.taverns[G.currentTavern][cardId] = null;
    const isAdded = AddCardToPlayer(G, ctx, card);
    if (isAdded) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
        suitId = GetSuitIndexByName(card.suit);
    } else {
        AddActionsToStack(G, ctx, card.stack);
    }
    if (G.stack[ctx.currentPlayer].length) {
        return StartActionFromStackOrEndActions(G, ctx, null, suitId);
    } else {
        AfterBasicPickCardActions(G, ctx);
    }
};

export const ClickDistinctionCard = (G, ctx, cardID) => {
    const index = G.distinctions.indexOf(Number(ctx.currentPlayer)),
        isValidMove = IsValidMove({objId: cardID, values: [index]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[Object.keys(suitsConfig)[cardID]].distinction.awarding(G, ctx, G.players[ctx.currentPlayer]);
};

export const ClickCardToPickDistinction = (G, ctx, cardId) => {
    const isAdded = AddCardToPlayer(G, ctx, G.decks[1][cardId]),
        pickedCard = G.decks[1].splice(cardId, 1)[0];
    let suitId = null;
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if (isAdded) {
        delete G.distinctions[4];
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
        suitId = GetSuitIndexByName(pickedCard.suit);
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    G.drawProfit = null;
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

export const PickDiscardCard = (G, ctx, cardId) => {
    G.actionsNum--;
    if (G.actionsNum) {
        return EndActionFromStackAndAddNew(G, ctx, [], cardId);
    } else {
        if (G.drawProfit === "BrisingamensAction" && G.stack[ctx.currentPlayer].length === 1) {
            return StartActionFromStackOrEndActions(G, ctx, null, cardId);
        } else {
            return EndActionFromStackAndAddNew(G, ctx, [], cardId);
        }
    }
};

export const StartEnlistmentMercenaries = (G, ctx) => {
    const stack = [
        {
            stack: {
                actionName: "DrawProfitAction",
                config: {
                    name: "enlistmentMercenaries",
                },
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack);
};

export const PassEnlistmentMercenaries = (G, ctx) => {
    const stack = [
        {
            stack: {
                actionName: "PassEnlistmentMercenariesAction",
                config: {},
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack);
};

export const GetEnlistmentMercenaries = (G, ctx, cardId) => {
    const stack = [
        {
            stack: {
                actionName: "GetEnlistmentMercenariesAction",
                config: {},
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack, cardId);
};

export const PlaceEnlistmentMercenaries = (G, ctx, suitId) => {
    const stack = [
        {
            stack: {
                actionName: "PlaceEnlistmentMercenariesAction",
                config: {},
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};
