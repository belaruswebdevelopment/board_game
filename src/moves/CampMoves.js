import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {
    AddActionsToStack,
    EndActionFromStackAndAddNew,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";
// todo Add logging
/**
 * Выбор карты из кэмпа.
 * Применения:
 * 1) Срабатывает при выборе карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export const ClickCampCard = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.playersOrder[0] ||
            (!G.campPicked && G.players[ctx.currentPlayer].buffs?.["goCamp"]));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStack(G, ctx, G.camp[cardId].stack);
    return StartActionFromStackOrEndActions(G, ctx, null, cardId);
};

/**
 * Выбор карты из кэмпа по действию персонажа Хольда.
 * Применения:
 * 1) Срабатывает при выборе карты из кэмпа по действию персонажа Хольда.
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export const ClickCampCardHolda = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.players[ctx.currentPlayer].buffs?.["goCampOneTime"];
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, G.camp[cardId].stack, cardId);
};

/**
 * Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.
 * Применения:
 * 1) Применяется при выборе первым игроком карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardCard2Players = (G, ctx, cardId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], cardId);
};

/**
 * Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.
 * Применения:
 * 1) Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardCardFromPlayerBoard = (G, ctx, suitId, cardId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

/**
 * Сбрасывает карту конкретной фракции в дискард по выбору игрока при действии артефакта Hofud.
 * Применения:
 * 1) Применяется при сбросе карты конкретной фракции в дискард при взятии артефакта Hofud.
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardSuitCardFromPlayerBoard = (G, ctx, suitId, cardId) => {
    // todo rework in action
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0]);
    if (ctx.activePlayers.length === 0) {
        ctx.events.endStage();
        AfterBasicPickCardActions(G, ctx);
    }
    return EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

/**
 * Выбирает фракцию для применения финального эффекта артефакта Mjollnir.
 * Применения:
 * 1) В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
export const GetMjollnirProfit = (G, ctx, suitId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
