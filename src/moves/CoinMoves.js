import { INVALID_MOVE } from "boardgame.io/core";
import { UpgradeCoinAction } from "../actions/AutoActions";
import { IsCoin } from "../Coin";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const publicBoardCoin = player.boardCoins[coinId];
    if (publicBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${coinId}.`);
    }
    let handCoins;
    let privateBoardCoin;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока на столе отсутствует монета ${coinId}.`);
        }
    }
    else {
        handCoins = player.handCoins;
    }
    if ((multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null && IsCoin(privateBoardCoin))
        || (!multiplayer && IsCoin(publicBoardCoin))) {
        const tempId = handCoins.indexOf(null);
        if (IsCoin(publicBoardCoin)) {
            handCoins[tempId] = publicBoardCoin;
        }
        else {
            if (IsCoin(privateBoardCoin)) {
                handCoins[tempId] = privateBoardCoin;
            }
        }
        player.boardCoins[coinId] = null;
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[coinId] = null;
        }
    }
    else if (player.selectedCoin !== null) {
        const tempSelectedId = player.selectedCoin, handCoin = handCoins[tempSelectedId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует нужная монета ${tempSelectedId}.`);
        }
        if (multiplayer && privatePlayer !== undefined) {
            player.boardCoins[coinId] = {};
            privatePlayer.boardCoins[coinId] = handCoin;
        }
        else {
            player.boardCoins[coinId] = handCoin;
        }
        handCoins[tempSelectedId] = null;
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.UpgradeCoin, {
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default1, coinId);
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
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoin;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoin = privatePlayer === null || privatePlayer === void 0 ? void 0 : privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.boardCoins[G.currentTavern + 1] = handCoin;
    }
    player.boardCoins[G.currentTavern + 1] = handCoin;
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.handCoins[coinId] = null;
    }
    else {
        player.handCoins[coinId] = null;
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
export const ClickHandTradingCoinUlineMove = (G, ctx, coinId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PlaceTradingCoinsUline, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoin;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    const firstTradingBoardCoin = player.boardCoins[G.tavernsNum];
    if (firstTradingBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${G.tavernsNum}.`);
    }
    if (firstTradingBoardCoin === null) {
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[G.tavernsNum] = handCoin;
        }
        player.boardCoins[G.tavernsNum] = handCoin;
    }
    else {
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[G.tavernsNum + 1] = handCoin;
        }
        player.boardCoins[G.tavernsNum + 1] = handCoin;
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.handCoins[coinId] = null;
    }
    else {
        player.handCoins[coinId] = null;
    }
};
//# sourceMappingURL=CoinMoves.js.map