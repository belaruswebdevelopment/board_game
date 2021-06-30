import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
// todo Add logging
export const ClickHeroCard = (G, ctx, heroId) => {
    const isValidMove = IsValidMove({obj: G.heroes[heroId], objId: heroId, range: [0, G.heroes.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, G.heroes[heroId].stack);
};

export const PlaceCard = (G, ctx, suitId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

export const DiscardCard = (G, ctx, suitId, cardId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

