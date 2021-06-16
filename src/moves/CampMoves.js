import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {ActionDispatcher} from "../Actions";
import {DiscardCardFromTavern} from "../Card";
import {AfterBasicPickCardActions} from "./Moves";

/**
 * Выбор карты из кэмпа.
 * Применения:
 * 1) Срабатывает при выборе карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param cardId ID выбираемой карты из кэмпа.
 * @returns {string|*} Диспетчер экшенов.
 * @constructor
 */
export const ClickCampCard = (G, ctx, cardId) => {
    const isValidMove = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.expansions.thingvellir && (Number(ctx.currentPlayer) === G.playersOrder[0] ||
            (G.players[ctx.currentPlayer].buffs?.["goCamp"] && G.campPicked === false) ||
            G.players[ctx.currentPlayer].buffs?.["goCampOneTime"]);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ctx.events.setStage("campAction");
    return ActionDispatcher(G, ctx, G.camp[cardId].action);
};

/**
 * Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.
 * Применения:
 * 1) Применяется при выборе первым игроком карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param cardId ID сбрасываемой карты.
 * @constructor
 */
export const DiscardCard2Players = (G, ctx, cardId) => {
    DiscardCardFromTavern(G, cardId);
    G.drawProfit = null;
    ctx.events.endTurn();
};

/**
 * Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.
 * Применения:
 * 1) Применяется при сбрасе карты в дискард в конце игры при наличии артефакта Brisingamens.
 *
 * @param G
 * @param ctx
 * @param suitId ID фракции.
 * @param cardId ID сбрасываемой карты.
 * @constructor
 */
export const DiscardCardFromPlayerBoard = (G, ctx, suitId, cardId) => {
    G.players[ctx.currentPlayer].cards[suitId].filter(card => card.type !== "герой").splice(cardId, 1);
    delete G.players[ctx.currentPlayer].buffs["discardCardEndGame"];
    ctx.events.endPhase();
    ctx.events.endGame();
};

/**
 * Сбрасывает карту конкретной фракции в дискард по выбору игрока при действии артефакта Hofud.
 * Применения:
 * 1) Применяется при сбрасе карты конкретной фракции в дискард при взятии артефакта Hofud.
 *
 * @param G
 * @param ctx
 * @param suitId ID фракции.
 * @param cardId ID сбрасываемой карты.
 * @constructor
 */
export const DiscardSuitCardFromPlayerBoard = (G, ctx, suitId, cardId) => {
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0]);
    if (!ctx.activePlayers.length) {
        ctx.events.endStage();
        AfterBasicPickCardActions(G, ctx);
    }
};
