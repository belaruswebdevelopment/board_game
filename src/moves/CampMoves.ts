import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, ChooseCoinValueForVidofnirVedrfolnirUpgradeAction, DiscardSuitCardAction, PickCampCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, StageNames } from "../typescript/enums";
import type { BasicVidofnirVedrfolnirUpgradeValueType, CampCardArrayType, CanBeVoidType, Ctx, IMyGameState, IndexOf, InvalidMoveType, Move } from "../typescript/interfaces";

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
export const AddCoinToPouchMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.addCoinToPouch, coinId);
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
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx,
    value: BasicVidofnirVedrfolnirUpgradeValueType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.chooseCoinValueForVidofnirVedrfolnirUpgrade, value);
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
export const ClickCampCardHoldaMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx,
    cardId: IndexOf<CampCardArrayType>): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.pickCampCardHolda, cardId);
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
export const ClickCampCardMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx,
    cardId: IndexOf<CampCardArrayType>): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default2, cardId);
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
export const DiscardSuitCardFromPlayerBoardMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID !== ctx.currentPlayer && IsValidMove(G, ctx, StageNames.discardSuitCard, {
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
export const UpgradeCoinVidofnirVedrfolnirMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.upgradeVidofnirVedrfolnirCoin, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction(G, ctx, coinId, type);
};
