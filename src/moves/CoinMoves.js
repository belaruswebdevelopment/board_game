import {CoinUpgradeValidation, IsValidMove} from "../MoveValidator";
import {INVALID_MOVE} from "boardgame.io/core";
import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";
import {CheckAndStartUlineActionsOrContinue} from "../helpers/HeroHelpers";

/**
 * Выбор монеты в руке для выкладки монет.
 * Применения:
 * 1) При клике по монете в руке.
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns {string}
 * @constructor
 */
export const ClickHandCoin = (G, ctx, coinId) => {
    const isValidMove = IsValidMove({
        obj: G.players[ctx.currentPlayer].handCoins[coinId],
        objId: coinId,
        range: [0, G.players[ctx.currentPlayer].handCoins.length]
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].selectedCoin = coinId;
};

/**
 * Выбор места для монет на столе для выкладки монет.
 * Применения:
 * 1) При клике по месту для монет на столе.
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns {string}
 * @constructor
 */
export const ClickBoardCoin = (G, ctx, coinId) => {
    const player = G.players[ctx.currentPlayer],
        isValidMove = IsValidMove({objId: coinId, range: [0, player.boardCoins.length]});
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (player.boardCoins[coinId] !== null) {
        const tempId = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== undefined) {
        const tempId = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
        if (ctx.phase === "placeCoinsUline") {
            ctx.events.setPhase("pickCards");
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline") {
            G.actionsNum--;
            if (G.actionsNum === 0) {
                G.actionsNum = null;
            }
            AfterBasicPickCardActions(G, ctx);
        } else {
            const isEveryPlayersHandCoinsEmpty = G.players.filter(player => player.buffs?.["everyTurn"] !== "Uline")
                .every(player => player.handCoins.every(coin => coin === null));
            if (isEveryPlayersHandCoinsEmpty) {
                if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
                    ctx.events.setPhase("placeCoinsUline");
                } else {
                    ctx.events.setPhase("pickCards");
                }
            } else {
                if (player.handCoins.every(coin => coin === null)) {
                    ctx.events.endTurn();
                }
            }
        }
    } else {
        return INVALID_MOVE;
    }
};

/**
 * Выбор монеты для улучшения.
 * Применения:
 * 1) При клике по монете.
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли базовой.
 * @returns {string|*}
 * @constructor
 */
export const ClickCoinToUpgrade = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.distinctions.length) {
        const isDistinction3 = G.distinctions[3] !== undefined;
        if (isDistinction3) {
            delete G.distinctions[3];
        } else if (!isDistinction3 && G.distinctions[4] !== undefined) {
            delete G.distinctions[4];
        }
    }
    return EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};

/**
 * Выбор монеты для улучшения по артефакту Vidofnir Vedrfolnir.
 * Применения:
 * 1) При клике по монете.
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли базовой.
 * @returns {string|*}
 * @constructor
 */
export const UpgradeCoinVidofnirVedrfolnir = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type) && G.stack[ctx.currentPlayer][0].config["coinId"] !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};

/**
 * Выбор монеты для выкладки монет в кошель при наличии героя Улина по артефакту Vidofnir Vedrfolnir.
 * Применения:
 * 1) При клике по монете.
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns {string|*}
 * @constructor
 */
export const AddCoinToPouch = (G, ctx, coinId) => {
    return EndActionFromStackAndAddNew(G, ctx, [], coinId);
};
