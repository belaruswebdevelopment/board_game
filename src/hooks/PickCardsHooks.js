import { IsMercenaryCampCard } from "../Camp";
import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddPickCardActionToStack, DrawCurrentProfit, StartDiscardCardFromTavernActionFor2Players } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { ResolveBoardCoins } from "../helpers/CoinHelpers";
import { AfterLastTavernEmptyActions, CheckAndStartPlaceCoinsUlineOrPickCardsPhase, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { ActivateTrading } from "../helpers/TradingHelpers";
import { AddDataToLog } from "../Logging";
import { ChangePlayersPriorities } from "../Priority";
import { CheckIfCurrentTavernEmpty, tavernsConfig } from "../Tavern";
import { BuffNames, LogTypes, Phases, Stages } from "../typescript/enums";
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const ulinePlayerIndex = G.publicPlayers.findIndex((findPlayer) => CheckPlayerHasBuff(findPlayer, BuffNames.EveryTurn));
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin = player.boardCoins[G.currentTavern];
            if (coin === undefined) {
                throw new Error(`В массиве монет игрока на поле отсутствует монета на месте текущей эпохи.`);
            }
            if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    const handCoinsLength = player.handCoins.filter((coin) => IsCoin(coin)).length;
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
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && !player.actionsNum && CheckIfCurrentTavernEmpty(G)) {
            const isLastTavern = G.tavernsNum - 1 === G.currentTavern;
            if (isLastTavern) {
                return AfterLastTavernEmptyActions(G);
            }
            else {
                return CheckAndStartPlaceCoinsUlineOrPickCardsPhase(G);
            }
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
    var _a;
    const currentTavernConfig = tavernsConfig[G.currentTavern];
    if (currentTavernConfig === undefined) {
        throw new Error(`Отсутствует конфиг текущей таверны.`);
    }
    if (!CheckIfCurrentTavernEmpty(G)) {
        throw new Error(`Таверна ${currentTavernConfig.name} не может не быть пустой в конце фазы ${Phases.PickCards}.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Таверна ${currentTavernConfig.name} пустая.`);
    const deck = G.decks[G.decks.length - G.tierToEnd];
    if (deck === undefined) {
        throw new Error(`Отсутствует колода карт текущей эпохи.`);
    }
    if (G.tavernsNum - 1 === G.currentTavern && deck.length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            let startThrud = true;
            if ((_a = G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) {
                for (let i = 0; i < G.publicPlayers.length; i++) {
                    const player = G.publicPlayers[i];
                    if (player === undefined) {
                        throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
                    }
                    startThrud = player.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
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
    G.mustDiscardTavernCardJarnglofi = null;
    G.publicPlayersOrder = [];
    ChangePlayersPriorities(G);
};
export const OnPickCardsMove = (G, ctx) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
    var _a;
    ClearPlayerPickedCard(G, ctx);
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        if ((_a = G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) {
            DiscardCardIfCampCardPicked(G);
            if (ctx.playOrder.length < ctx.numPlayers) {
                if (G.mustDiscardTavernCardJarnglofi === null) {
                    G.mustDiscardTavernCardJarnglofi = true;
                }
                if (G.mustDiscardTavernCardJarnglofi) {
                    DiscardCardFromTavernJarnglofi(G);
                }
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