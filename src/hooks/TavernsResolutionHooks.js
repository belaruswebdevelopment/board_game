import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { OpenCurrentTavernClosedCoinsOnPlayerBoard, ResolveAllBoardCoins } from "../helpers/CoinHelpers";
import { EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { CheckIsStartUseGodAbility } from "../helpers/GodAbilityHelpers";
import { ChangePlayersPriorities } from "../helpers/PriorityHelpers";
import { IsLastRound } from "../helpers/RoundHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { ActivateTrading, StartTrading } from "../helpers/TradingHelpers";
import { AssertSecretAllDwarfDecksIndex } from "../is_helpers/AssertionTypeHelpers";
import { IsMercenaryCampCard } from "../is_helpers/IsCampTypeHelpers";
import { IsCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CheckIfCurrentTavernEmpty, DiscardCardIfTavernHasCardFor2Players, tavernsConfig } from "../Tavern";
import { ErrorNames, GameModeNames, GodNames, HeroBuffNames, LogTypeNames, PhaseNames } from "../typescript/enums";
import { StartBidUlineOrTavernsResolutionPhase, StartEndTierPhaseOrEndGameLastActions } from "./NextPhaseHooks";
/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param context
 * @returns Фаза игры.
 */
const AfterLastTavernEmptyActions = ({ G, ctx, ...rest }) => {
    const isLastRound = IsLastRound({ G, ctx, ...rest }), currentDeck = G.secret.decks[(G.secret.decks.length - G.tierToEnd - Number(isLastRound))];
    if (currentDeck.length === 0) {
        if (G.expansions.Thingvellir.active) {
            return CheckEnlistmentMercenaries({ G, ctx, ...rest });
        }
        else {
            return StartEndTierPhaseOrEndGameLastActions({ G, ctx, ...rest });
        }
    }
    else {
        return PhaseNames.Bids;
    }
};
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
const CheckAndStartUlineActionsOrContinue = ({ G, ctx, events, ...rest }) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const boardCoin = player.boardCoins[G.currentTavern];
    if (boardCoin !== null && (!IsCoin(boardCoin) || !boardCoin.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета на месте текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsTriggerTradingCoin(boardCoin)) {
        const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
        if (tradingCoinPlacesLength > 0) {
            const handCoinsLength = handCoins.filter(IsCoin).length;
            const actionsNum = G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
            if (actionsNum > handCoinsLength) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть меньше монет, чем нужно положить в кошель - '${handCoinsLength}'.`);
            }
            AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [AllStackData.placeTradingCoinsUline()]);
            DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
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
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndTavernsResolutionPhase = ({ G, ctx, ...rest }) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && CheckIfCurrentTavernEmpty({ G, ctx, ...rest })) {
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
 * @param context
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndTavernsResolutionTurn = ({ G, ctx, ...rest }) => {
    if (EndTurnActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest })) {
        if (!(G.expansions.Idavoll.active
            && CheckIsStartUseGodAbility({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, GodNames.Odin))) {
            return true;
        }
    }
};
/**
* <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
* <p>Применения:</p>
* <ol>
* <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
* </ol>
*
* @param context
* @returns Фаза игры.
*/
const CheckEnlistmentMercenaries = ({ G, ctx, ...rest }) => {
    let count = false;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (player.campCards.filter(IsMercenaryCampCard).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return PhaseNames.EnlistmentMercenaries;
    }
    else {
        return StartEndTierPhaseOrEndGameLastActions({ G, ctx, ...rest });
    }
};
/**
 * <h3>Действия при завершении фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Посещение таверн'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const EndTavernsResolutionActions = ({ G, ctx, ...rest }) => {
    const currentTavernConfig = tavernsConfig[G.currentTavern];
    if (!CheckIfCurrentTavernEmpty({ G, ctx, ...rest })) {
        throw new Error(`Таверна '${currentTavernConfig.name}' не может не быть пустой в конце фазы '${PhaseNames.TavernsResolution}'.`);
    }
    if (G.mode === GameModeNames.Solo && (G.currentTavern === (G.tavernsNum - 1))) {
        StartTrading({ G, ctx, myPlayerID: `1`, ...rest }, true);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Таверна '${currentTavernConfig.name}' пустая.`);
    const currentTier = G.secret.decks.length - G.tierToEnd;
    AssertSecretAllDwarfDecksIndex(currentTier);
    const currentDeck = G.secret.decks[currentTier];
    if (G.tavernsNum - 1 === G.currentTavern && currentDeck.length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.EndTier));
        if (yludIndex !== -1) {
            let startThrud = true;
            if (G.expansions.Thingvellir.active) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    const player = G.publicPlayers[i];
                    if (player === undefined) {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                    }
                    startThrud = player.campCards.filter(IsMercenaryCampCard).length === 0;
                    if (!startThrud) {
                        break;
                    }
                }
            }
            if (startThrud) {
                RemoveThrudFromPlayerBoardAfterGameEnd({ G, ctx, ...rest });
            }
        }
    }
    if (G.expansions.Thingvellir.active) {
        G.mustDiscardTavernCardJarnglofi = null;
    }
    if (ctx.numPlayers === 2) {
        G.tavernCardDiscarded2Players = false;
    }
    G.publicPlayersOrder = [];
    if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
        ChangePlayersPriorities({ G, ctx, ...rest });
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
 * @param context
 * @returns
 */
export const OnTavernsResolutionMove = ({ G, ctx, events, ...rest }) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ctx.currentPlayer);
    }
    StartOrEndActions({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
    if (!player.stack.length) {
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && ctx.numPlayers === 2 && G.campPicked && ctx.currentPlayer === ctx.playOrder[0]
            && !CheckIfCurrentTavernEmpty({ G, ctx, events, ...rest }) && !G.tavernCardDiscarded2Players) {
            AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [AllStackData.discardTavernCard()]);
            DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
        }
        else {
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && CheckPlayerHasBuff({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, HeroBuffNames.EveryTurn)) {
                // TODO Need it every time or 1 time add 0-2 AddCoinsToPouch actions to stack
                CheckAndStartUlineActionsOrContinue({ G, ctx, events, ...rest });
            }
            if (!player.stack.length) {
                // TODO For solo mode `And if the zero value coin is on the purse, the Neutral clan also increases the value of the other coin in the purse, replacing it with the higher value available in the Royal Treasure.`
                ActivateTrading({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
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
 * @param context
 * @returns
 */
export const OnTavernsResolutionTurnBegin = ({ G, ctx, ...rest }) => {
    if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, [AllStackData.pickCardSoloBot()]);
    }
    else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, [AllStackData.pickCardSoloBotAndvari()]);
    }
    else {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest }, [AllStackData.pickCard()]);
    }
};
/**
 * <h3>Действия при завершении хода в фазе 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'Посещение таверн'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnTavernsResolutionTurnEnd = ({ G, ctx, ...rest }) => {
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        if (ctx.numPlayers === 2 && !CheckIfCurrentTavernEmpty({ G, ctx, ...rest })) {
            DiscardCardIfTavernHasCardFor2Players({ G, ctx, ...rest });
        }
        if (G.expansions.Thingvellir.active) {
            if (ctx.numPlayers === 2) {
                G.campPicked = false;
            }
            else {
                DiscardCardIfCampCardPicked({ G, ctx, ...rest });
            }
            if (ctx.playOrder.length < ctx.numPlayers) {
                if (G.mustDiscardTavernCardJarnglofi === null) {
                    G.mustDiscardTavernCardJarnglofi = true;
                }
                if (G.mustDiscardTavernCardJarnglofi) {
                    DiscardCardFromTavernJarnglofi({ G, ctx, ...rest });
                }
            }
        }
        if (G.expansions.Idavoll.active) {
            if (G.mythologicalCreatureDeckForSkymir !== null && G.mythologicalCreatureDeckForSkymir.length === 3) {
                for (let j = 0; j < G.mythologicalCreatureDeckForSkymir.length; j++) {
                    const mythologyCreatureCard = G.mythologicalCreatureDeckForSkymir[j];
                    if (mythologyCreatureCard === undefined) {
                        throw new Error(`В массиве карт Мифических существ для гиганта Skymir отсутствует карта с id '${j}'.`);
                    }
                    // TODO Player decide order of returned cards!?
                    G.secret.mythologicalCreatureNotInGameDeck.push(mythologyCreatureCard);
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
 * @param context
 * @returns
 */
export const ResolveCurrentTavernOrders = ({ G, ctx, ...rest }) => {
    const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.EveryTurn));
    if (ulinePlayerIndex === -1) {
        OpenCurrentTavernClosedCoinsOnPlayerBoard({ G, ctx, ...rest });
    }
    const { playersOrder, exchangeOrder } = ResolveAllBoardCoins({ G, ctx, ...rest });
    [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
};
/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн' или фазы 'EndTier' или фазы конца игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн' или фаза 'EndTier' или фазы конца игры.</li>
 * </ol>
 *
 * @param context
 * @returns Фаза игры.
 */
export const StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase = ({ G, ctx, ...rest }) => {
    const isLastTavern = G.tavernsNum - 1 === G.currentTavern && CheckIfCurrentTavernEmpty({ G, ctx, ...rest });
    if (isLastTavern) {
        return AfterLastTavernEmptyActions({ G, ctx, ...rest });
    }
    else {
        return StartBidUlineOrTavernsResolutionPhase({ G, ctx, ...rest });
    }
};
//# sourceMappingURL=TavernsResolutionHooks.js.map