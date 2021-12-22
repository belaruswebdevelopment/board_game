import { CoinUpgradeValidation, IsValidMove } from "../MoveValidator";
import { INVALID_MOVE } from "boardgame.io/core";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AfterBasicPickCardActions } from "../helpers/MovesHelpers";
import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
// todo Add logging
// todo Add Place coins async
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
export const AddCoinToPouchMove = (G, ctx, coinId) => {
    EndActionFromStackAndAddNew(G, ctx, [], coinId);
};
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
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)], isValidMove = IsValidMove({ objId: coinId, range: [0, player.boardCoins.length] });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (player.boardCoins[coinId] !== null) {
        const tempId = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    }
    else if (player.selectedCoin !== undefined) {
        const tempId = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
        if (ctx.phase === "placeCoinsUline") {
            ctx.events.setPhase("pickCards");
        }
        else if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[ctx.currentPlayer]) === `placeTradingCoinsUline`) {
            G.actionsNum--;
            AfterBasicPickCardActions(G, ctx, false);
        }
        else {
            const isEveryPlayersHandCoinsEmpty = G.publicPlayers
                .filter((player) => player.buffs.everyTurn !== `Uline`)
                .every((player) => player.handCoins
                .every((coin) => coin === null));
            if (isEveryPlayersHandCoinsEmpty) {
                if (CheckAndStartUlineActionsOrContinue(G, ctx) === `placeCoinsUline`) {
                    ctx.events.setPhase(`placeCoinsUline`);
                }
                else {
                    ctx.events.setPhase(`pickCards`);
                }
            }
            else {
                if (player.handCoins.every((coin) => coin === null)) {
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
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли базовой.
 * @returns
 */
export const ClickCoinToUpgradeMove = (G, ctx, coinId, type, isInitial) => {
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.distinctions.length) {
        // todo Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionExplorer = G.distinctions[1] !== undefined;
        if (isDistinctionExplorer) {
            delete G.distinctions[1];
        }
        else if (!isDistinctionExplorer && G.distinctions[4] !== undefined) {
            delete G.distinctions[4];
        }
    }
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
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
    const isValidMove = IsValidMove({
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
export const UpgradeCoinVidofnirVedrfolnirMove = (G, ctx, coinId, type, isInitial) => {
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    const isValidMove = CoinUpgradeValidation(G, ctx, coinId, type) && (config === null || config === void 0 ? void 0 : config.coinId) !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};
