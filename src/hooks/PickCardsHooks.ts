import type { Ctx } from "boardgame.io";
import { IsMercenaryCampCard } from "../Camp";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { DiscardCardFromTavernJarnglofi, DiscardCardIfCampCardPicked } from "../helpers/CampHelpers";
import { ResolveBoardCoins } from "../helpers/CoinHelpers";
import { AfterLastTavernEmptyActions, CheckAndStartPlaceCoinsUlineOrPickCardsPhase, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { ChangePlayersPriorities } from "../helpers/PriorityHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { ActivateTrading } from "../helpers/TradingHelpers";
import { AddDataToLog } from "../Logging";
import { CheckIfCurrentTavernEmpty, DiscardCardIfTavernHasCardFor2Players, tavernsConfig } from "../Tavern";
import { BuffNames, LogTypes, Phases, Stages } from "../typescript/enums";
import type { CampDeckCardTypes, CoinType, DeckCardTypes, IMyGameState, INext, IPlayer, IPublicPlayer, IResolveBoardCoins, ITavernInConfig, PublicPlayerCoinTypes } from "../typescript/interfaces";

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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const ulinePlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((findPlayer: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(findPlayer, BuffNames.EveryTurn));
    if (!G.solo && ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[G.currentTavern];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета на месте текущей таверны с id '${G.currentTavern}'.`);
            }
            if (boardCoin !== null && (!IsCoin(boardCoin) || !boardCoin.isOpened)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета на месте текущей таверны с id '${G.currentTavern}'.`);
            }
            if (boardCoin?.isTriggerTrading) {
                const tradingCoinPlacesLength: number =
                    player.boardCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean =>
                        index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    const handCoinsLength: number =
                        handCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета с id '${index}'.`);
                            }
                            return IsCoin(coin);
                        }).length;
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
 * @returns
 */
export const CheckEndPickCardsPhase = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length
            && !player.actionsNum && CheckIfCurrentTavernEmpty(G)) {
            const isLastTavern: boolean = G.tavernsNum - 1 === G.currentTavern;
            if (isLastTavern) {
                return AfterLastTavernEmptyActions(G, ctx);
            } else {
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
export const CheckEndPickCardsTurn = (G: IMyGameState, ctx: Ctx): boolean | void => EndTurnActions(G, ctx);

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
export const EndPickCardsActions = (G: IMyGameState, ctx: Ctx): void => {
    const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[G.currentTavern];
    if (currentTavernConfig === undefined) {
        throw new Error(`Отсутствует конфиг текущей таверны с id '${G.currentTavern}'.`);
    }
    if (!CheckIfCurrentTavernEmpty(G)) {
        throw new Error(`Таверна '${currentTavernConfig.name}' не может не быть пустой в конце фазы '${Phases.PickCards}'.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Таверна '${currentTavernConfig.name}' пустая.`);
    const deck: DeckCardTypes[] | undefined = G.secret.decks[G.secret.decks.length - G.tierToEnd];
    if (deck === undefined) {
        throw new Error(`Отсутствует колода карт текущей эпохи с id '${G.secret.decks.length - G.tierToEnd}'.`);
    }
    if (G.tavernsNum - 1 === G.currentTavern && deck.length === 0) {
        G.tierToEnd--;
    }
    if (G.tierToEnd === 0) {
        const yludIndex: number =
            Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            let startThrud = true;
            if (G.expansions.thingvellir.active) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    const player: IPublicPlayer | undefined = G.publicPlayers[i];
                    if (player === undefined) {
                        throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
                    }
                    startThrud = player.campCards.filter((card: CampDeckCardTypes): boolean =>
                        IsMercenaryCampCard(card)).length === 0;
                    if (!startThrud) {
                        break;
                    }
                }
            }
            if (startThrud) {
                RemoveThrudFromPlayerBoardAfterGameEnd(G);
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
    if (!G.solo) {
        ChangePlayersPriorities(G);
    }
};

/**
 * <h3>Действия при завершении мува в фазе 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnPickCardsMove = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    StartOrEndActions(G, ctx);
    if (!player.stack.length) {
        if (ctx.numPlayers === 2 && G.campPicked && ctx.currentPlayer === ctx.playOrder[0]
            && !CheckIfCurrentTavernEmpty(G) && !G.tavernCardDiscarded2Players) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.discardTavernCard()]);
            DrawCurrentProfit(G, ctx);
        } else {
            if ((G.solo || ctx.numPlayers === 2) && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && !CheckIfCurrentTavernEmpty(G)) {
                DiscardCardIfTavernHasCardFor2Players(G, ctx);
            }
            if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== Stages.PlaceTradingCoinsUline) {
                CheckAndStartUlineActionsOrContinue(G, ctx);
            }
            if (!player.actionsNum) {
                // TODO For solo mode `And if the zero value coin is on the purse, the Neutral clan also increases the value of the other coin in the purse, replacing it with the higher value available in the Royal Treasure.`
                ActivateTrading(G, ctx);
            }
        }
    }
};

/**
 * <h3>Действия при начале хода в фазе 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnPickCardsTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickCard()]);
};

/**
 * <h3>Действия при завершении хода в фазе 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnPickCardsTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
    if (G.expansions.thingvellir.active && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        if (ctx.numPlayers === 2) {
            G.campPicked = false;
        } else {
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
    Object.values(G.publicPlayers).forEach((player: IPublicPlayer, index: number): void => {
        if (G.multiplayer) {
            const privatePlayer: IPlayer | undefined = G.players[index];
            if (privatePlayer === undefined) {
                throw new Error(`В массиве приватных игроков отсутствует игрок с id '${index}'.`);
            }
            const privateBoardCoin: CoinType | undefined = privatePlayer.boardCoins[G.currentTavern];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${index}' в руке отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (privateBoardCoin !== null && !privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[G.currentTavern] = privateBoardCoin;
        } else {
            const publicBoardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[G.currentTavern];
            if (publicBoardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${index}' в руке отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
                throw new Error(`В массиве монет игрока с id '${index}' в руке не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (publicBoardCoin !== null && !publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
    });
    const { playersOrder, exchangeOrder }: IResolveBoardCoins = ResolveBoardCoins(G, ctx);
    [G.publicPlayersOrder, G.exchangeOrder] = [playersOrder, exchangeOrder];
};
