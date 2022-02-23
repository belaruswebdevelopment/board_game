import { IsMercenaryCard } from "../Camp";
import { isCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddPickCardActionToStack, DrawCurrentProfit, StartDiscardCardFromTavernActionFor2Players } from "../helpers/ActionHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { ResolveBoardCoins } from "../helpers/CoinHelpers";
import { AfterLastTavernEmptyActions, CheckAndStartPlaceCoinsUlineOrPickCardsPhase, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { ActivateTrading } from "../helpers/TradingHelpers";
import { AddDataToLog } from "../Logging";
import { ChangePlayersPriorities } from "../Priority";
import { CheckIfCurrentTavernEmpty, tavernsConfig } from "../Tavern";
import { LogTypes, Phases, Stages } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], ulinePlayerIndex = G.publicPlayers.findIndex((findPlayer) => Boolean(findPlayer.buffs.find((buff) => buff.everyTurn !== undefined)));
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin = player.boardCoins[G.currentTavern];
            if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    const handCoinsLength = player.handCoins.filter((coin) => isCoin(coin)).length;
                    player.actionsNum =
                        G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
                    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeTradingCoinsUline(player.actionsNum)]);
                    DrawCurrentProfit(G, ctx);
                }
            }
        }
    }
};
/**
 * <h3>Проверяет необходимость завершения хода/фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом пике карты в фазе 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndPickCardsPhase = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (G.publicPlayersOrder.length && !player.stack.length
        && !player.actionsNum && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
        && CheckIfCurrentTavernEmpty(G)) {
        const isLastTavern = G.tavernsNum - 1 === G.currentTavern;
        if (isLastTavern) {
            return AfterLastTavernEmptyActions(G);
        }
        else {
            return CheckAndStartPlaceCoinsUlineOrPickCardsPhase(G);
        }
    }
};
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом пике карты в фазе 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndPickCardsTurn = (G, ctx) => {
    return EndTurnActions(G, ctx);
};
/**
 * <h3>Порядок обмена кристаллов при завершении фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndPickCardsActions = (G, ctx) => {
    if (CheckIfCurrentTavernEmpty(G)) {
        AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
    }
    else {
        throw new Error(`Таверна ${tavernsConfig[G.currentTavern].name} не может не быть пустой в конце фазы ${Phases.PickCards}.`);
    }
    if (G.tavernsNum - 1 === G.currentTavern && G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
        if (yludIndex !== -1) {
            let startThrud = true;
            if (G.expansions.thingvellir.active) {
                for (let i = 0; i < G.publicPlayers.length; i++) {
                    startThrud = G.publicPlayers[i].campCards.filter((card) => IsMercenaryCard(card)).length === 0;
                    if (!startThrud) {
                        break;
                    }
                }
            }
            if (startThrud) {
                RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
            }
        }
    }
    G.publicPlayersOrder = [];
    ChangePlayersPriorities(G);
};
export const OnPickCardsMove = (G, ctx) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    StartOrEndActions(G, ctx);
    if (!player.stack.length) {
        if (ctx.numPlayers === 2 && G.campPicked && ctx.currentPlayer === ctx.playOrder[0]
            && !CheckIfCurrentTavernEmpty(G)) {
            StartDiscardCardFromTavernActionFor2Players(G, ctx);
        }
        else {
            if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== Stages.PlaceTradingCoinsUline) {
                CheckAndStartUlineActionsOrContinue(G, ctx);
            }
            if (!player.actionsNum) {
                ActivateTrading(G, ctx);
            }
        }
    }
};
export const OnPickCardsTurnBegin = (G, ctx) => {
    AddPickCardActionToStack(G, ctx);
};
export const OnPickCardsTurnEnd = (G, ctx) => {
    ClearPlayerPickedCard(G, ctx);
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        if (G.expansions.thingvellir.active) {
            DiscardCardIfCampCardPicked(G);
            if (ctx.playOrder.length < ctx.numPlayers) {
                DiscardCardFromTavernJarnglofi(G);
            }
        }
    }
};
/**
 * <h3>Определяет порядок взятия карт из таверны и обмена кристалами при начале фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ResolveCurrentTavernOrders = (G, ctx) => {
    G.currentTavern++;
    const { playersOrder, exchangeOrder } = ResolveBoardCoins(G, ctx);
    [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
};
//# sourceMappingURL=PickCardsHooks.js.map