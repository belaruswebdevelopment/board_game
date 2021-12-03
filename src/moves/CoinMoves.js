"use strict";
exports.__esModule = true;
exports.AddCoinToPouch = exports.UpgradeCoinVidofnirVedrfolnir = exports.ClickCoinToUpgrade = exports.ClickBoardCoin = exports.ClickHandCoin = void 0;
var MoveValidator_1 = require("../MoveValidator");
var core_1 = require("boardgame.io/core");
var StackHelpers_1 = require("../helpers/StackHelpers");
var MovesHelpers_1 = require("../helpers/MovesHelpers");
var HeroHelpers_1 = require("../helpers/HeroHelpers");
// todo Add logging
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
 * @returns {string}
 * @constructor
 */
var ClickHandCoin = function (G, ctx, coinId) {
    var isValidMove = (0, MoveValidator_1.IsValidMove)({
        obj: G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId],
        objId: coinId,
        range: [0, G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]
    });
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin = coinId;
};
exports.ClickHandCoin = ClickHandCoin;
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
 * @returns {string}
 * @constructor
 */
var ClickBoardCoin = function (G, ctx, coinId) {
    var player = G.publicPlayers[Number(ctx.currentPlayer)], isValidMove = (0, MoveValidator_1.IsValidMove)({ objId: coinId, range: [0, player.boardCoins.length] });
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    if (player.boardCoins[coinId] !== null) {
        var tempId = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    }
    else if (player.selectedCoin !== undefined) {
        var tempId = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
        if (ctx.phase === "placeCoinsUline") {
            ctx.events.setPhase("pickCards");
        }
        else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline") {
            G.actionsNum--;
            if (G.actionsNum === 0) {
                G.actionsNum = null;
            }
            (0, MovesHelpers_1.AfterBasicPickCardActions)(G, ctx, false);
        }
        else {
            var isEveryPlayersHandCoinsEmpty = G.publicPlayers.filter(function (player) {
                return player.buffs.everyTurn !== "Uline";
            }).every(function (player) {
                return player.handCoins.every(function (coin) { return coin === null; });
            });
            if (isEveryPlayersHandCoinsEmpty) {
                if ((0, HeroHelpers_1.CheckAndStartUlineActionsOrContinue)(G, ctx) === "placeCoinsUline") {
                    ctx.events.setPhase("placeCoinsUline");
                }
                else {
                    ctx.events.setPhase("pickCards");
                }
            }
            else {
                if (player.handCoins.every(function (coin) { return coin === null; })) {
                    ctx.events.endTurn();
                }
            }
        }
    }
    else {
        return core_1.INVALID_MOVE;
    }
};
exports.ClickBoardCoin = ClickBoardCoin;
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
 * @returns {string|*}
 * @constructor
 */
var ClickCoinToUpgrade = function (G, ctx, coinId, type, isInitial) {
    var isValidMove = (0, MoveValidator_1.CoinUpgradeValidation)(G, ctx, coinId, type);
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    if (G.distinctions.length) {
        var isDistinction3 = G.distinctions[3] !== undefined;
        if (isDistinction3) {
            delete G.distinctions[3];
        }
        else if (!isDistinction3 && G.distinctions[4] !== undefined) {
            delete G.distinctions[4];
        }
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], coinId, type, isInitial);
};
exports.ClickCoinToUpgrade = ClickCoinToUpgrade;
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
 * @returns {string|*}
 * @constructor
 */
var UpgradeCoinVidofnirVedrfolnir = function (G, ctx, coinId, type, isInitial) {
    var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    var isValidMove = false;
    if (config) {
        isValidMove = (0, MoveValidator_1.CoinUpgradeValidation)(G, ctx, coinId, type) && config.coinId !== coinId;
    }
    if (!isValidMove) {
        return core_1.INVALID_MOVE;
    }
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], coinId, type, isInitial);
};
exports.UpgradeCoinVidofnirVedrfolnir = UpgradeCoinVidofnirVedrfolnir;
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
 * @returns {string|*}
 * @constructor
 */
var AddCoinToPouch = function (G, ctx, coinId) {
    (0, StackHelpers_1.EndActionFromStackAndAddNew)(G, ctx, [], coinId);
};
exports.AddCoinToPouch = AddCoinToPouch;
