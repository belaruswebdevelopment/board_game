import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, DiscardSuitCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { isArtefactCardNotMercenary } from "../Camp";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampMovesHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { CampCardTypes } from "../typescript/card_types";
import { LogTypes, Stages } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";

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
    const campCard: CampCardTypes = G.camp[cardId];
    if (campCard !== null) {
        G.camp[cardId] = null;
        AddCampCardToCards(G, ctx, campCard);
        if (isArtefactCardNotMercenary(campCard)) {
            StartAutoAction(G, ctx, campCard.actions);
            AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        }
    } else {
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
export const ClickCampCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default2, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Move to function with Holda same logic
    const campCard: CampCardTypes = G.camp[cardId];
    if (campCard !== null) {
        G.camp[cardId] = null;
        AddCampCardToCards(G, ctx, campCard);
        if (isArtefactCardNotMercenary(campCard)) {
            StartAutoAction(G, ctx, campCard.actions);
            AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
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
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardFromPlayerBoardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string,
    playerId: number, cardId: number): string | void => {
    // TODO Or [suit, cardId]!?
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.DiscardSuitCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // TODO Uncomment it for players and fix it for bots
    /*let isValidMove: boolean = false;
    if (ctx.playerID !== undefined) {
        isValidMove = playerId !== Number(ctx.currentPlayer) && playerId === Number(ctx.playerID);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
    }
    if (!isValidMove) {
        return INVALID_MOVE;
    }*/
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
