import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {
    AddActionsToStack,
    EndActionFromStackAndAddNew, StartActionForChosenPlayer,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
// todo Add logging
/**
 * <h3>Выбор карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export const ClickCampCard = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
            (!G.campPicked && G.publicPlayers[ctx.currentPlayer].buffs["goCamp"]));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStack(G, ctx, G.camp[cardId].stack);
    return StartActionFromStackOrEndActions(G, ctx, null, cardId);
};

/**
 * <h3>Выбор карты из кэмпа по действию персонажа Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из кэмпа.
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export const ClickCampCardHolda = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.publicPlayers[ctx.currentPlayer].buffs["goCampOneTime"];
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, G.camp[cardId].stack, cardId);
};

/**
 * <h3>Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
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
 * <h3>Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
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
 * <h3>Сбрасывает карту конкретной фракции в дискард по выбору игрока при действии артефакта Hofud.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты конкретной фракции в дискард при взятии артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitId Id фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardSuitCardFromPlayerBoard = (G, ctx, suitId, playerId, cardId) => {
    const isValidMove = Number(playerId) !== Number(ctx.currentPlayer) && Number(playerId) ===
        Number(ctx.playerID);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return StartActionForChosenPlayer(G, ctx, playerId, suitId, playerId, cardId);
};

/**
 * <h3>Выбирает фракцию для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
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
