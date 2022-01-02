import { Move, Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GetEnlistmentMercenariesAction, PlaceEnlistmentMercenariesAction, DrawProfitCampAction } from "../actions/CampActions";
import { StartActionForChosenPlayer, StartActionFromStackOrEndActions } from "../helpers/ActionDispatcherHelpers";
import { EndActionFromStackAndAddNew, AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { CampCardTypes } from "../typescript/card_types";
import { LogTypes, ActionTypes, ConfigNames, DrawNames } from "../typescript/enums";
import { MyGameState, IStack } from "../typescript/interfaces";

// todo Add logging
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
export const ClickCampCardHoldaMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
        && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const campCard: CampCardTypes = G.camp[cardId];
    if (campCard !== null) {
        EndActionFromStackAndAddNew(G, ctx, campCard.stack, cardId);
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
export const ClickCampCardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({ obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length] })
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
            || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card: CampCardTypes = G.camp[cardId];
    if (card !== null) {
        AddActionsToStack(G, ctx, card.stack);
        StartActionFromStackOrEndActions(G, ctx, false, cardId);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта кэмпа.`);
    }
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
 * @param suit Название фракции.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCardFromPlayerBoardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suit: string,
    cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], suit, cardId);
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
 */
export const DiscardCard2PlayersMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
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
export const DiscardSuitCardFromPlayerBoardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suit: string,
    playerId: number, cardId: number): string | void => {
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
    StartActionForChosenPlayer(G, ctx, playerId, suit, playerId, cardId);
};

/**
 * <h3>Выбор игроком карты наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе какую карту наёмника будет вербовать игрок.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const GetEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    const stack: IStack[] = [
        {
            action: {
                name: GetEnlistmentMercenariesAction.name,
                type: ActionTypes.Camp,
            },
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, cardId);
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
 * @param suit Название фракции.
 */
export const GetMjollnirProfitMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suit: string): void => {
    EndActionFromStackAndAddNew(G, ctx, [], suit);
};

/**
 * <h3>Выбор фракции куда будет завербован наёмник.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции, куда будет завербован наёмник.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suit: string): void => {
    const stack: IStack[] = [
        {
            action: {
                name: PlaceEnlistmentMercenariesAction.name,
                type: ActionTypes.Camp,
            },
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, suit);
};

/**
 * <h3>Начало вербовки наёмников.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников выбирает старт вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            action: {
                name: DrawProfitCampAction.name,
                type: ActionTypes.Camp,
            },
            config: {
                name: ConfigNames.EnlistmentMercenaries,
                drawName: DrawNames.EnlistmentMercenaries,
            },
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack);
};
