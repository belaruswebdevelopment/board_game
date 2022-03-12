import { INVALID_MOVE } from "boardgame.io/core";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { IsValidMove } from "../MoveValidator";
import { Stages, SuitNames } from "../typescript/enums";
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
export const ClickBoardCoinMove = (G, ctx, coinId) => {
    // TODO Add Place coins async
    const isValidMove = IsValidMove(G, ctx, Stages.Default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const boardCoin = player.boardCoins[coinId];
    if (boardCoin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${coinId}.`);
    }
    if (IsCoin(player.boardCoins[coinId])) {
        const tempId = player.handCoins.indexOf(null);
        player.handCoins[tempId] = boardCoin;
        player.boardCoins[coinId] = null;
    }
    else if (player.selectedCoin !== null) {
        const tempId = player.selectedCoin, handCoin = player.handCoins[tempId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует нужная монета ${tempId}.`);
        }
        player.boardCoins[coinId] = handCoin;
        player.handCoins[tempId] = null;
        player.selectedCoin = null;
    }
    else {
        throw new Error(`Неразрешённый мув - это должно проверяться в MoveValidator.`);
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
export const ClickCoinToUpgradeMove = (G, ctx, coinId, type, isInitial) => {
    var _a;
    const isValidMove = IsValidMove(G, ctx, Stages.UpgradeCoin, {
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
        const isDistinctionWarrior = G.distinctions[SuitNames.WARRIOR] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.WARRIOR] = undefined;
        }
        else if (!isDistinctionWarrior && G.distinctions[SuitNames.EXPLORER] !== undefined) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
        }
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const value = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.value;
    if (value === undefined) {
        throw new Error(`У игрока в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction(G, ctx, value, coinId, type, isInitial);
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
export const ClickHandCoinMove = (G, ctx, coinId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    player.selectedCoin = coinId;
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
export const ClickHandCoinUlineMove = (G, ctx, coinId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const handCoin = player.handCoins[coinId];
    if (handCoin === undefined) {
        throw new Error(`В массиве монет игрока в руке отсутствует нужная монета ${coinId}.`);
    }
    player.boardCoins[G.currentTavern + 1] = handCoin;
    player.handCoins[coinId] = null;
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
export const ClickHandTradingCoinUlineMove = (G, ctx, coinId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PlaceTradingCoinsUline, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const handCoin = player.handCoins[coinId];
    if (handCoin === undefined) {
        throw new Error(`В массиве монет игрока в руке отсутствует нужная монета ${coinId}.`);
    }
    if (player.boardCoins[G.tavernsNum] === null) {
        player.boardCoins[G.tavernsNum] = handCoin;
    }
    else {
        player.boardCoins[G.tavernsNum + 1] = handCoin;
    }
    player.handCoins[coinId] = null;
};
//# sourceMappingURL=CoinMoves.js.map