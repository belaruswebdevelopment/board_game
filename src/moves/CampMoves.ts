import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, DiscardSuitCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsArtefactCard } from "../Camp";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampCardHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import type { CampCardTypes, IMyGameState, SuitTypes } from "../typescript/interfaces";

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
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.AddCoinToPouch, coinId);
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
export const ClickCampCardHoldaMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.PickCampCardHolda, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Move to function with Camp same logic
    const campCard: CampCardTypes | undefined = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта кэмпа.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта кэмпа.`);
    }
    G.camp.splice(cardId, 1, null);
    AddCampCardToCards(G, ctx, campCard);
    if (IsArtefactCard(campCard)) {
        AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
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
export const ClickCampCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default2, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Move to function with Holda same logic
    const campCard: CampCardTypes | undefined = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта кэмпа.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта кэмпа.`);
    }
    G.camp[cardId] = null;
    AddCampCardToCards(G, ctx, campCard);
    if (IsArtefactCard(campCard)) {
        AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
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
export const DiscardSuitCardFromPlayerBoardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: SuitTypes,
    playerId: number, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.DiscardSuitCard, {
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
export const UpgradeCoinVidofnirVedrfolnirMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: string, isInitial: boolean): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.UpgradeVidofnirVedrfolnirCoin, {
        coinId,
        type,
        isInitial,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction(G, ctx, coinId, type, isInitial);
};
