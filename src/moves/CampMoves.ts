import {IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {
    AddActionsToStack,
    EndActionFromStackAndAddNew,
    StartActionForChosenPlayer,
    StartActionFromStackOrEndActions,
} from "../helpers/StackHelpers";
import {Ctx, Move} from "boardgame.io";
import {CampCardTypes, CampDeckCardTypes, MyGameState} from "../GameSetup";
// todo Add logging

/**
 * <h3>Выбор карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id выбираемой карты из кэмпа.
 * @returns {string | void}
 * @constructor
 */
export const ClickCampCard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
            || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card: CampCardTypes | null = G.camp[cardId];
    if (card !== null) {
        AddActionsToStack(G, ctx, card.stack);
        StartActionFromStackOrEndActions(G, ctx, false, cardId);
    }
};

/**
 * <h3>Выбор карты из кэмпа по действию персонажа Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из кэмпа по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id выбираемой карты из кэмпа.
 * @returns {string | void}
 * @constructor
 */
export const ClickCampCardHolda: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({obj: G.camp[cardId], objId: cardId, range: [0, G.camp.length]})
        && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const campCard: CampDeckCardTypes | null = G.camp[cardId];
    if (campCard !== null) {
        EndActionFromStackAndAddNew(G, ctx, campCard.stack, cardId);
    }
};

/**
 * <h3>Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardCard2Players: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
};

/**
 * <h3>Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @param {number} cardId Id сбрасываемой карты.
 * @constructor
 */
export const DiscardCardFromPlayerBoard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number, cardId: number):
    void => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId, cardId);
};

/**
 * <h3>Сбрасывает карту конкретной фракции в дискард по выбору игрока при действии артефакта Hofud.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты конкретной фракции в дискард при взятии артефакта Hofud.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @param {number} playerId Id игрока.
 * @param {number} cardId Id сбрасываемой карты.
 * @returns {string | void}
 * @constructor
 */
export const DiscardSuitCardFromPlayerBoard: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number,
                                                                  playerId: number, cardId: number): string | void => {
    let isValidMove: boolean = false;
    if (typeof ctx.playerID === "string") {
        isValidMove = playerId !== Number(ctx.currentPlayer) && playerId === Number(ctx.playerID);
    }
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    StartActionForChosenPlayer(G, ctx, playerId, suitId, playerId, cardId);
};

/**
 * <h3>Выбирает фракцию для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} suitId Id фракции.
 * @constructor
 */
export const GetMjollnirProfit: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suitId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
