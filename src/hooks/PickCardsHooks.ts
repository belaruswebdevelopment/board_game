import { Ctx } from "boardgame.io";
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
import { CampDeckCardTypes, CoinType, IBuffs, IMyGameState, INext, IPublicPlayer, IResolveBoardCoins } from "../typescript/interfaces";

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
const CheckAndStartUlineActionsOrContinue = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        ulinePlayerIndex: number = G.publicPlayers.findIndex((findPlayer: IPublicPlayer): boolean =>
            Boolean(findPlayer.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)));
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin: CoinType = player.boardCoins[G.currentTavern];
            if (coin?.isTriggerTrading) {
                const tradingCoinPlacesLength: number =
                    player.boardCoins.filter((coin: CoinType, index: number): boolean =>
                        index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    const handCoinsLength: number =
                        player.handCoins.filter((coin: CoinType): boolean => isCoin(coin)).length;
                    player.actionsNum =
                        G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
                    AddActionsToStackAfterCurrent(G, ctx,
                        [StackData.placeTradingCoinsUline(player.actionsNum)]);
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
export const CheckEndPickCardsPhase = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (G.publicPlayersOrder.length && !player.stack.length
        && !player.actionsNum && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
        && CheckIfCurrentTavernEmpty(G)) {
        const isLastTavern: boolean = G.tavernsNum - 1 === G.currentTavern;
        if (isLastTavern) {
            return AfterLastTavernEmptyActions(G);
        } else {
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
export const CheckEndPickCardsTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
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
export const EndPickCardsActions = (G: IMyGameState, ctx: Ctx): void | never => {
    if (CheckIfCurrentTavernEmpty(G)) {
        AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
    } else {
        throw new Error(`Таверна ${tavernsConfig[G.currentTavern].name} не может не быть пустой в конце фазы ${Phases.PickCards}.`);
    }
    if (G.tavernsNum - 1 === G.currentTavern && G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean => buff.endTier !== undefined)));
        if (yludIndex !== -1) {
            let startThrud = true;
            if (G.expansions.thingvellir.active) {
                for (let i = 0; i < G.publicPlayers.length; i++) {
                    startThrud = G.publicPlayers[i].campCards.filter((card: CampDeckCardTypes): boolean =>
                        IsMercenaryCard(card)).length === 0;
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

export const OnPickCardsMove = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    StartOrEndActions(G, ctx);
    if (!player.stack.length) {
        if (ctx.numPlayers === 2 && G.campPicked && ctx.currentPlayer === ctx.playOrder[0]
            && !CheckIfCurrentTavernEmpty(G)) {
            StartDiscardCardFromTavernActionFor2Players(G, ctx);
        } else {
            if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== Stages.PlaceTradingCoinsUline) {
                CheckAndStartUlineActionsOrContinue(G, ctx);
            }
            if (!player.actionsNum) {
                ActivateTrading(G, ctx);
            }
        }
    }
};

export const OnPickCardsTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddPickCardActionToStack(G, ctx);
};

export const OnPickCardsTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
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
export const ResolveCurrentTavernOrders = (G: IMyGameState, ctx: Ctx): void => {
    G.currentTavern++;
    const { playersOrder, exchangeOrder }: IResolveBoardCoins = ResolveBoardCoins(G, ctx);
    [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
};
