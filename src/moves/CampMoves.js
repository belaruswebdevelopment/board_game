import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, DiscardSuitCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsArtefactCardNotMercenary } from "../Camp";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampMovesHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { LogTypes, Stages } from "../typescript/enums";
/**
 * <h3>Выбор монеты для выкладки монет в кошель при наличии героя Улина по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchMove = (G, ctx, coinId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.AddCoinToPouch, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddCoinToPouchAction(G, ctx, coinId);
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
 * @returns
 */
export const ClickCampCardHoldaMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PickCampCardHolda, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Move to function with Camp same logic
    const campCard = G.camp[cardId];
    if (campCard !== null) {
        G.camp[cardId] = null;
        AddCampCardToCards(G, ctx, campCard);
        if (IsArtefactCardNotMercenary(campCard)) {
            AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
            StartAutoAction(G, ctx, campCard.actions);
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
};
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
 * @returns
 */
export const ClickCampCardMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default2, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Move to function with Holda same logic
    const campCard = G.camp[cardId];
    if (campCard !== null) {
        G.camp[cardId] = null;
        AddCampCardToCards(G, ctx, campCard);
        if (IsArtefactCardNotMercenary(campCard)) {
            AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
            StartAutoAction(G, ctx, campCard.actions);
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
};
/**
 * <h3>Сбрасывает карту конкретной фракции в колоду сброса по выбору игрока при действии артефакта Hofud.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты конкретной фракции в колоду сброса при взятии артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardFromPlayerBoardMove = (G, ctx, suit, playerId, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.DiscardSuitCard, {
        playerId,
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardSuitCardAction(G, ctx, suit, playerId, cardId);
};
/**
 * <h3>Выбор монеты для улучшения по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли базовой.
 * @returns
 */
export const UpgradeCoinVidofnirVedrfolnirMove = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = IsValidMove(G, ctx, Stages.UpgradeVidofnirVedrfolnirCoin, {
        coinId,
        type,
        isInitial,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction(G, ctx, coinId, type, isInitial);
};
//# sourceMappingURL=CampMoves.js.map