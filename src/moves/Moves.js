import {INVALID_MOVE} from "boardgame.io/core";
import {AddCardToPlayer} from "../Player";
import {suitsConfig} from "../data/SuitData";
import {IsValidMove} from "../MoveValidator";
import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionFromStackAndAddNew,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
import {CheckAndMoveThrudOrPickHeroAction} from "../actions/HeroActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";
// todo Add logging
export const ClickCard = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({objId: G.currentTavern, values: [G.currentTavern]}) &&
        IsValidMove({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length],
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
    return EndActionFromStackAndAddNew(G, ctx, [], cardId);
};

export const StartEnlistmentMercenaries = (G, ctx) => {
    const stack = [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "enlistmentMercenaries",
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack);
};

export const PassEnlistmentMercenaries = (G, ctx) => {
    const stack = [
        {
            actionName: "PassEnlistmentMercenariesAction",
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack);
};

export const GetEnlistmentMercenaries = (G, ctx, cardId) => {
    const stack = [
        {
            actionName: "GetEnlistmentMercenariesAction",
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack, cardId);
};

export const PlaceEnlistmentMercenaries = (G, ctx, suitId) => {
    const stack = [
        {
            actionName: "PlaceEnlistmentMercenariesAction",
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};
