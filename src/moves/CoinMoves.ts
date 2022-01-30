import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsValidMove } from "../MoveValidator";
import { Stages, SuitNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

// TODO Add Place coins async
/**
 * <h3>Выбор места для монет на столе для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по месту для монет на столе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickBoardCoinMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player.boardCoins[coinId] !== null) {
        const tempId: number = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== undefined) {
        const tempId: number = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
    } else {
        // TODO FIX IT!
        return INVALID_MOVE;
    }
};

/**
 * <h3>Выбор монеты для улучшения.</h3>
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
export const ClickCoinToUpgradeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number, type: string,
    isInitial: boolean): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.UpgradeCoin, {
        coinId,
        type,
        isInitial,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // todo Move to distinction phase hook?
    if (Object.values(G.distinctions).length) {
        // TODO Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionWarrior: boolean = G.distinctions[SuitNames.WARRIOR] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.WARRIOR] = undefined;
        } else if (!isDistinctionWarrior && G.distinctions[SuitNames.EXPLORER] !== undefined) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
        }
    }
    const value: number | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config?.value;
    if (value !== undefined) {
        UpgradeCoinAction(G, ctx, value, coinId, type, isInitial);
    } else {
        // TODO Error logging!
    }
};

/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandCoinMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin = coinId;
};
