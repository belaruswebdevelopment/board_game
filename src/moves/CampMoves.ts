import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, DiscardSuitCardAction, PickCampCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsValidMove } from "../MoveValidator";
import { CoinTypes, Stages } from "../typescript/enums";
import type { IMyGameState } from "../typescript/interfaces";

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
export const AddCoinToPouchMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.AddCoinToPouch, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddCoinToPouchAction(G, ctx, coinId);
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
export const ClickCampCardHoldaMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PickCampCardHolda, cardId);
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
export const ClickCampCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default2, cardId);
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
export const DiscardSuitCardFromPlayerBoardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean =
        ctx.playerID !== ctx.currentPlayer && IsValidMove(G, ctx, Stages.DiscardSuitCard, {
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
 * @param isInitial Является ли базовой.
 * @returns
 */
export const UpgradeCoinVidofnirVedrfolnirMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypes, isInitial: boolean): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.UpgradeVidofnirVedrfolnirCoin, {
            coinId,
            type,
            isInitial,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction(G, ctx, coinId, type, isInitial);
};
