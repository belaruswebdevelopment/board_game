import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { OpenCurrentTavernClosedCoinsOnPlayerBoard, ResolveBoardCoins } from "../helpers/CoinHelpers";
import { ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { ChangePlayersPriorities } from "../helpers/PriorityHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { ActivateTrading, StartTrading } from "../helpers/TradingHelpers";
import { AddDataToLog } from "../Logging";
import { CheckIfCurrentTavernEmpty, DiscardCardIfTavernHasCardFor2Players, tavernsConfig } from "../Tavern";
import { BuffNames, ErrorNames, GameModeNames, LogTypeNames, PhaseNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const boardCoin = player.boardCoins[G.currentTavern];
    if (boardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета на месте текущей таверны с id '${G.currentTavern}'.`);
    }
    if (boardCoin !== null && (!IsCoin(boardCoin) || !boardCoin.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета на месте текущей таверны с id '${G.currentTavern}'.`);
    }
    if (boardCoin === null || boardCoin === void 0 ? void 0 : boardCoin.isTriggerTrading) {
        const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
        if (tradingCoinPlacesLength > 0) {
            const handCoinsLength = handCoins.filter(IsCoin).length;
            const actionsNum = G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
            if (actionsNum > handCoinsLength) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть меньше монет, чем нужно положить в кошель - '${handCoinsLength}'.`);
            }
            AddActionsToStack(G, ctx, [StackData.placeTradingCoinsUline()]);
            DrawCurrentProfit(G, ctx);
        }
    }
};
/**
 * <h3>Проверяет необходимость завершения фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом пике карты в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndTavernsResolutionPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && CheckIfCurrentTavernEmpty(G)) {
            return true;
        }
    }
};
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом пике карты в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndTavernsResolutionTurn = (G, ctx) => EndTurnActions(G, ctx);
/**
 * <h3>Действия при завершении фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const EndTavernsResolutionActions = (G, ctx) => {
    const currentTavernConfig = tavernsConfig[G.currentTavern];
    if (!CheckIfCurrentTavernEmpty(G)) {
        throw new Error(`Таверна '${currentTavernConfig.name}' не может не быть пустой в конце фазы '${PhaseNames.TavernsResolution}'.`);
    }
    if (G.mode === GameModeNames.Solo && (G.currentTavern === (G.tavernsNum - 1))) {
        StartTrading(G, ctx, true);
    }
    AddDataToLog(G, LogTypeNames.Game, `Таверна '${currentTavernConfig.name}' пустая.`);
    const currentDeck = G.secret.decks[G.secret.decks.length - G.tierToEnd];
    if (currentDeck === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTierDeckIsUndefined);
    }
    if (G.tavernsNum - 1 === G.currentTavern && currentDeck.length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            let startThrud = true;
            if (G.expansions.thingvellir.active) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    const player = G.publicPlayers[i];
                    if (player === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                    }
                    startThrud = player.campCards.filter(IsMercenaryCampCard).length === 0;
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
    if (G.expansions.thingvellir.active) {
        G.mustDiscardTavernCardJarnglofi = null;
    }
    if (ctx.numPlayers === 2) {
        G.tavernCardDiscarded2Players = false;
    }
    G.publicPlayersOrder = [];
    if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
        ChangePlayersPriorities(G, ctx);
    }
    if (G.currentTavern !== G.tavernsNum - 1) {
        G.currentTavern++;
    }
};
/**
 * <h3>Действия при завершении мува в фазе 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTavernsResolutionMove = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    StartOrEndActions(G, ctx);
    if (!player.stack.length) {
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && ctx.numPlayers === 2 && G.campPicked && ctx.currentPlayer === ctx.playOrder[0]
            && !CheckIfCurrentTavernEmpty(G) && !G.tavernCardDiscarded2Players) {
            AddActionsToStack(G, ctx, [StackData.discardTavernCard()]);
            DrawCurrentProfit(G, ctx);
        }
        else {
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                // TODO Need it every time or 1 time add 0-2 AddCoinsToPouch actions to stack
                CheckAndStartUlineActionsOrContinue(G, ctx);
            }
            if (!player.stack.length) {
                // TODO For solo mode `And if the zero value coin is on the purse, the Neutral clan also increases the value of the other coin in the purse, replacing it with the higher value available in the Royal Treasure.`
                ActivateTrading(G, ctx);
            }
        }
    }
};
/**
 * <h3>Действия при начале хода в фазе 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTavernsResolutionTurnBegin = (G, ctx) => {
    if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
        AddActionsToStack(G, ctx, [StackData.pickCardSoloBot()]);
    }
    else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
        AddActionsToStack(G, ctx, [StackData.pickCardSoloBotAndvari()]);
    }
    else {
        AddActionsToStack(G, ctx, [StackData.pickCard()]);
    }
};
/**
 * <h3>Действия при завершении хода в фазе 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTavernsResolutionTurnEnd = (G, ctx) => {
    ClearPlayerPickedCard(G, ctx);
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        if (ctx.numPlayers === 2 && !CheckIfCurrentTavernEmpty(G)) {
            DiscardCardIfTavernHasCardFor2Players(G, ctx);
        }
        if (G.expansions.thingvellir.active) {
            if (ctx.numPlayers === 2) {
                G.campPicked = false;
            }
            else {
                DiscardCardIfCampCardPicked(G, ctx);
            }
            if (ctx.playOrder.length < ctx.numPlayers) {
                if (G.mustDiscardTavernCardJarnglofi === null) {
                    G.mustDiscardTavernCardJarnglofi = true;
                }
                if (G.mustDiscardTavernCardJarnglofi) {
                    DiscardCardFromTavernJarnglofi(G, ctx);
                }
            }
        }
    }
};
/**
 * <h3>Определяет порядок взятия карт из таверны и обмена кристалами при начале фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const ResolveCurrentTavernOrders = (G, ctx) => {
    const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if (ulinePlayerIndex === -1) {
        OpenCurrentTavernClosedCoinsOnPlayerBoard(G, ctx);
    }
    const { playersOrder, exchangeOrder } = ResolveBoardCoins(G, ctx);
    [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
};
//# sourceMappingURL=TavernsResolutionHooks.js.map