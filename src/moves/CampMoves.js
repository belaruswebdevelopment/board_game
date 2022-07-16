import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, ChooseCoinValueForVidofnirVedrfolnirUpgradeAction, DiscardSuitCardAction, PickCampCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, StageNames } from "../typescript/enums";
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
 * @returns
 */
export const AddCoinToPouchMove = (G, ctx, coinId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.AddCoinToPouch, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddCoinToPouchAction(G, ctx, coinId);
};
/**
 * <h3>Выбор значения улучшения монеты при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по конкретному значению обмена монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param value Значение улучшения монеты.
 * @returns
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeMove = (G, ctx, value) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade, value);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ChooseCoinValueForVidofnirVedrfolnirUpgradeAction(G, ctx, value);
};
/**
 * <h3>Выбор карты из лагеря по действию персонажа Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из лагеря по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из лагеря.
 * @returns
 */
export const ClickCampCardHoldaMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickCampCardHolda, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCampCardAction(G, ctx, cardId);
};
/**
 * <h3>Выбор карты из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты из лагеря.
 * @returns
 */
export const ClickCampCardMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default2, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCampCardAction(G, ctx, cardId);
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
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardFromPlayerBoardMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID !== ctx.currentPlayer && IsValidMove(G, ctx, StageNames.DiscardSuitCard, {
        playerId: Number(ctx.playerID),
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardSuitCardAction(G, ctx, cardId);
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
 * @returns
 */
export const UpgradeCoinVidofnirVedrfolnirMove = (G, ctx, coinId, type) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.UpgradeVidofnirVedrfolnirCoin, {
        coinId,
        type,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction(G, ctx, coinId, type);
};
//# sourceMappingURL=CampMoves.js.map