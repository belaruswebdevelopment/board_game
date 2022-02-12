import { AddPickCardActionToStack, StartDiscardCardFromTavernActionFor2Players } from "../helpers/ActionHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { ResolveBoardCoins } from "../helpers/CoinHelpers";
import { AfterLastTavernEmptyActions, CheckAndStartPlaceCoinsUlineOrPickCardsPhase, CheckAndStartUlineActionsOrContinue, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { ActivateTrading } from "../helpers/TradingHelpers";
import { AddDataToLog } from "../Logging";
import { ChangePlayersPriorities } from "../Priority";
import { CheckIfCurrentTavernEmpty, tavernsConfig } from "../Tavern";
import { LogTypes, RusCardTypes, Stages } from "../typescript/enums";
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
            // TODO Do it before or after trading or not matter?
            CheckAndStartUlineActionsOrContinue(G, ctx);
            const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
            if (!G.actionsNum) {
                ActivateTrading(G, ctx);
            }
            else if ((G.actionsNum === 2 && tradingCoinPlacesLength === 1)
                || (G.actionsNum === 1 && !tradingCoinPlacesLength)) {
                G.actionsNum--;
            }
            else if (G.actionsNum === 2) {
                // TODO Rework it to actions
                (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setStage(Stages.PlaceTradingCoinsUline);
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
    if (!G.publicPlayers[Number(ctx.currentPlayer)].stack.length && G.publicPlayersOrder.length
        && !G.actionsNum && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
        && CheckIfCurrentTavernEmpty(G)) {
        const isLastTavern = G.tavernsNum - 1 === G.currentTavern;
        if (isLastTavern) {
            return AfterLastTavernEmptyActions(G);
        }
        else {
            return CheckAndStartPlaceCoinsUlineOrPickCardsPhase(G);
        }
    }
    else {
        // TODO Log error Can't have every card empty not on last player's turn
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
        // TODO Add error log for future possible bugs? DO TESTS!!!!=)))
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
                    startThrud = G.publicPlayers[i].campCards
                        .filter((card) => card.type === RusCardTypes.MERCENARY).length === 0;
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