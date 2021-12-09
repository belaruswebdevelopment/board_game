import { CoinUpgradeValidation, IsValidMove } from "../MoveValidator";
import { INVALID_MOVE } from "boardgame.io/core";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AfterBasicPickCardActions } from "../helpers/MovesHelpers";
import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
// todo Add logging
/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId Id монеты.
 * @returns {string | void}
 * @constructor
 */
export var ClickHandCoin = function (G, ctx, coinId) {
    var isValidMove = IsValidMove({
        obj: G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId],
        objId: coinId,
        range: [0, G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin = coinId;
};
/**
 * <h3>Выбор места для монет на столе для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по месту для монет на столе.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId Id монеты.
 * @returns {string | void}
 * @constructor
 */
export var ClickBoardCoin = function (G, ctx, coinId) {
    var player = G.publicPlayers[Number(ctx.currentPlayer)], isValidMove = IsValidMove({ objId: coinId, range: [0, player.boardCoins.length] });
    if (!isValidMove) {
        return INVALID_MOVE;
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
            AfterBasicPickCardActions(G, ctx, false);
        }
        else {
            var isEveryPlayersHandCoinsEmpty = G.publicPlayers
                .filter(function (player) { return player.buffs.everyTurn !== "Uline"; })
                .every(function (player) { return player.handCoins
                .every(function (coin) { return coin === null; }); });
            if (isEveryPlayersHandCoinsEmpty) {
                if (CheckAndStartUlineActionsOrContinue(G, ctx) === "placeCoinsUline") {
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId Id монеты.
 * @param {string} type Тип монеты.
 * @param {boolean} isInitial Является ли базовой.
 * @returns {string | void}
 * @constructor
 */
export var ClickCoinToUpgrade = function (G, ctx, coinId, type, isInitial) {
    var isValidMove = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
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
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};
/**
 * <h3>Выбор монеты для улучшения по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId Id монеты.
 * @param {string} type Тип монеты.
 * @param {boolean} isInitial Является ли базовой.
 * @returns {string | void}
 * @constructor
 */
export var UpgradeCoinVidofnirVedrfolnir = function (G, ctx, coinId, type, isInitial) {
    var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    var isValidMove = CoinUpgradeValidation(G, ctx, coinId, type) && (config === null || config === void 0 ? void 0 : config.coinId) !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};
/**
 * <h3>Выбор монеты для выкладки монет в кошель при наличии героя Улина по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {number} coinId Id монеты.
 * @constructor
 */
export var AddCoinToPouch = function (G, ctx, coinId) {
    EndActionFromStackAndAddNew(G, ctx, [], coinId);
};
