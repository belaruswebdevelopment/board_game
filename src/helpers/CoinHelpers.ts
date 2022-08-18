import type { Ctx } from "boardgame.io";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, ICoin, IMyGameState, INumberValues, IPlayer, IPriority, IPublicPlayer, IResolveBoardCoins, PublicPlayerCoinType } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

/**
 * <h3>Сброс обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции охотников (обмен '0' на '3').</li>
 * <li>Действия, связанные со сбросом обменной монеты по карте лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Тип и индекс сбрасываемой обменной монеты.
 */
export const DiscardTradingCoin = (G: IMyGameState, ctx: Ctx, playerId: number): [CoinTypeNames, number] => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let tradingCoinIndex: number = player.boardCoins.findIndex((coin: PublicPlayerCoinType): boolean =>
        Boolean(coin?.isTriggerTrading)),
        type: CoinTypeNames = CoinTypeNames.Board;
    if (tradingCoinIndex === -1 && G.mode === GameModeNames.Multiplayer) {
        tradingCoinIndex = privatePlayer.boardCoins.findIndex((coin: CoinType, index: number): boolean => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет приватного игрока с id '${playerId}' на столе не может быть закрыта монета с id '${index}'.`);
            }
            return Boolean(coin?.isTriggerTrading);
        });
    }
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        && tradingCoinIndex === -1 && CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
        tradingCoinIndex = handCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет игрока с id '${playerId}' в руке не может быть закрыта монета с id '${index}'.`);
            }
            return Boolean(coin?.isTriggerTrading);
        });
        if (tradingCoinIndex === -1) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
        }
        type = CoinTypeNames.Hand;
        handCoins.splice(tradingCoinIndex, 1, null);
        if (G.mode === GameModeNames.Multiplayer) {
            player.handCoins.splice(tradingCoinIndex, 1, null);
        }
    } else {
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока с id '${playerId}' на столе не может отсутствовать обменная монета.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            privatePlayer.boardCoins.splice(tradingCoinIndex, 1, null);
        }
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    return [type, tradingCoinIndex];
};

/**
 * <h3>Находит максимальную монету игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, если выбран герой Астрид.</li>
 * <li>В конце игры, если получено преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Максимальная монета игрока.
 */
export const GetMaxCoinValue = (player: IPublicPlayer): number =>
    Math.max(...player.boardCoins.filter(IsCoin).map((coin: ICoin, index: number):
        number => {
        if (!coin.isOpened) {
            throw new Error(`В массиве монет игрока '${player.nickname}' на поле не может быть ранее не открыта монета с id '${index}'.`);
        }
        return coin.value;
    }));

/**
 * <h3>Открывает закрытые монеты на столе игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда нужно открыть все закрытые монеты всех игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 */
export const OpenClosedCoinsOnPlayerBoard = (G: IMyGameState, ctx: Ctx, playerId: number): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
    }
    for (let j = 0; j < player.boardCoins.length; j++) {
        const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerId}' на поле отсутствует монета с id '${j}'.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            if (IsCoin(privateBoardCoin)) {
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                player.boardCoins[j] = privateBoardCoin;
            }
        }
        const publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[j];
        if (publicBoardCoin === undefined) {
            throw new Error(`В массиве монет публичного игрока с id '${playerId}' на поле отсутствует монета с id '${j}'.`);
        }
        if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
            throw new Error(`В массиве монет публичного игрока с id '${playerId}' на поле не может быть закрыта монета с id '${j}'.`);
        }
        if (IsCoin(publicBoardCoin)) {
            if (!publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
    }
};

/**
 * <h3>Определяет по расположению монет игроками порядок ходов и порядок обмена кристаллов приоритета.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выкладки всех монет игроками.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Порядок ходов игроков & порядок изменения ходов игроками.
 */
export const ResolveBoardCoins = (G: IMyGameState, ctx: Ctx): IResolveBoardCoins => {
    const playersOrderNumbers: number[] = [],
        coinValues: number[] = [],
        exchangeOrder: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
        if (playerI === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        const coin: CanBeUndefType<PublicPlayerCoinType> = playerI.boardCoins[G.currentTavern];
        if (coin !== undefined) {
            exchangeOrder.push(i);
            if (IsCoin(coin)) {
                coinValues[i] = coin.value;
                playersOrderNumbers.push(i);
            }
            for (let j: number = playersOrderNumbers.length - 1; j > 0; j--) {
                const playersOrderNumberCur: CanBeUndefType<number> = playersOrderNumbers[j],
                    playersOrderNumberPrev: CanBeUndefType<number> = playersOrderNumbers[j - 1];
                if (playersOrderNumberCur === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует текущий с id '${j}'.`);
                }
                if (playersOrderNumberPrev === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует предыдущий с id '${j - 1}'.`);
                }
                const playerCur: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playersOrderNumberCur],
                    playerPrev: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playersOrderNumberPrev];
                if (playerCur === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        playersOrderNumberCur);
                }
                if (playerPrev === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        playersOrderNumberPrev);
                }
                const coin: CanBeUndefType<PublicPlayerCoinType> = playerCur.boardCoins[G.currentTavern],
                    prevCoin: CanBeUndefType<PublicPlayerCoinType> = playerPrev.boardCoins[G.currentTavern];
                if (coin === undefined) {
                    throw new Error(`В массиве монет текущего игрока с id '${playersOrderNumberCur}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
                }
                if (prevCoin === undefined) {
                    throw new Error(`В массиве монет предыдущего игрока с id '${playersOrderNumberPrev}' на столе отсутствует монета в позиции текущей таверны с id '${G.currentTavern}'.`);
                }
                if (IsCoin(coin) && IsCoin(prevCoin)) {
                    if (coin.value > prevCoin.value) {
                        [playersOrderNumbers[j], playersOrderNumbers[j - 1]] =
                            [playersOrderNumberPrev, playersOrderNumberCur];
                    } else if (coin.value === prevCoin.value) {
                        const priority: IPriority = playerCur.priority,
                            prevPriority: IPriority = playerPrev.priority;
                        if (priority.value > prevPriority.value) {
                            [playersOrderNumbers[j], playersOrderNumbers[j - 1]] =
                                [playersOrderNumberPrev, playersOrderNumberCur];
                        }
                    } else {
                        break;
                    }
                }
            }
        } else {
            throw new Error(`В массиве монет игрока с id '${i}' на столе отсутствует монета в позиции с id '${G.currentTavern}'.`);
        }
    }
    const counts: INumberValues = {};
    for (let i = 0; i < coinValues.length; i++) {
        const coinValue: CanBeUndefType<number> = coinValues[i];
        if (coinValue !== undefined) {
            const value: number = counts[coinValue] ?? 0;
            counts[coinValue] = 1 + value;
        }
    }
    for (const prop in counts) {
        const value: CanBeUndefType<number> = counts[prop];
        if (value === undefined) {
            throw new Error(`В массиве значений монет отсутствует с id '${prop}'.`);
        }
        if (value <= 1) {
            continue;
        }
        const tiePlayers: IPublicPlayer[] =
            Object.values(G.publicPlayers).filter((player: IPublicPlayer, index: number): boolean => {
                const boardCoinCurrentTavern: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[G.currentTavern];
                if (boardCoinCurrentTavern === undefined) {
                    throw new Error(`В массиве монет игрока с id '${index}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
                }
                if (boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern)) {
                    throw new Error(`В массиве монет игрока с id '${index}' не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
                }
                return boardCoinCurrentTavern?.value === Number(prop) && player.priority.isExchangeable;
            });
        while (tiePlayers.length > 1) {
            const tiePlayersPriorities: number[] =
                tiePlayers.map((player: IPublicPlayer): number => player.priority.value),
                maxPriority: number = Math.max(...tiePlayersPriorities),
                minPriority: number = Math.min(...tiePlayersPriorities),
                maxIndex: number =
                    Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                        player.priority.value === maxPriority),
                minIndex: number =
                    Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                        player.priority.value === minPriority);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === maxPriority), 1);
            tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                player.priority.value === minPriority), 1);
            const exchangeOrderMax: CanBeUndefType<number> = exchangeOrder[maxIndex],
                exchangeOrderMin: CanBeUndefType<number> = exchangeOrder[minIndex];
            if (exchangeOrderMax === undefined) {
                throw new Error(`В массиве изменений порядка хода игроков отсутствует максимальная '${exchangeOrder[maxIndex]}' с id '${maxIndex}'.`);
            }
            if (exchangeOrderMin === undefined) {
                throw new Error(`В массиве изменений порядка хода игроков отсутствует минимальная '${exchangeOrder[minIndex]}'  с id '${minIndex}'.`);
            }
            [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrderMax, exchangeOrderMin];
        }
    }
    const playersOrder: string[] = playersOrderNumbers.map((index: number): string => String(index));
    return {
        playersOrder,
        exchangeOrder,
    };
};

/**
 * <h3>Возвращает все монеты игрока из руки на стол при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 */
export const ReturnCoinsToPlayerBoard = (G: IMyGameState, ctx: Ctx, playerId: number): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            const tempCoinId: number = player.boardCoins.indexOf(null);
            if (tempCoinId !== -1) {
                if (!handCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(handCoin, true);
                }
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.boardCoins[tempCoinId] = handCoin;
                    player.handCoins[i] = null;
                }
                player.boardCoins[tempCoinId] = handCoin;
                handCoins[i] = null;
            }
        }
    }
};

// TODO Do coins return to Solo Bot hands in private and closed for all!
/**
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ReturnCoinsToPlayerHands = (G: IMyGameState, ctx: Ctx): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i],
            privatePlayer: CanBeUndefType<IPlayer> = G.players[i];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (privatePlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, i);
        }
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
            for (let j = 0; j < player.handCoins.length; j++) {
                const handCoin: CanBeUndefType<PublicPlayerCoinType> = player.handCoins[j];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${i}' в руке отсутствует монета с id '${j}'.`);
                }
                if (IsCoin(handCoin) && handCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(handCoin, false);
                }
                if (G.mode === GameModeNames.Multiplayer) {
                    if (IsCoin(handCoin)) {
                        player.handCoins[j] = {};
                        privatePlayer.handCoins[j] = handCoin;
                    }
                }
            }
        }
        for (let j = 0; j < player.boardCoins.length; j++) {
            const isCoinReturned: boolean = ReturnCoinToPlayerHands(G, ctx, i, j, true);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, LogTypeNames.Game, `Все монеты вернулись в руки игроков.`);
};

/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @param coinId Id монеты.
 * @param close Нужно ли закрыть монету.
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = (G: IMyGameState, ctx: Ctx, playerId: number, coinId: number, close: boolean):
    boolean => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo1 && playerId === 1)) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const tempCoinId: number = handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    const coin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока с id '${playerId}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    if (IsCoin(coin)) {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo1 && playerId === 1)) {
            if (!coin.isOpened) {
                throw new Error(`В массиве монет игрока с id '${playerId}' на поле не может быть ранее не открыта монета с id '${coinId}'.`);
            }
        }
        if (close && coin.isOpened) {
            ChangeIsOpenedCoinStatus(coin, false);
        }
        handCoins[tempCoinId] = coin;
    } else {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo1 && playerId === 1)) {
            const privateBoardCoin: CanBeUndefType<PublicPlayerCoinType> = privatePlayer.boardCoins[coinId];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${playerId}' на поле отсутствует монета с id '${coinId}'.`);
            }
            if (IsCoin(privateBoardCoin)) {
                if (close && privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, false);
                }
                handCoins[tempCoinId] = privateBoardCoin;
            }
        }
    }
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo1 && playerId === 1)) {
        if (close) {
            player.handCoins[tempCoinId] = {};
        } else {
            player.handCoins[tempCoinId] = coin;
        }
        privatePlayer.boardCoins[coinId] = null;
    }
    player.boardCoins[coinId] = null;
    return true;
};

/**
 * <h3>Рандомизирует монеты в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент подготовки к новому раунду.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 */
const MixUpCoins = (G: IMyGameState, ctx: Ctx, playerId: number): void => {
    const privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
    }
    privatePlayer.handCoins = ctx.random!.Shuffle(privatePlayer.handCoins);
};

/**
 * <h3>Начинает рандомизацию монет в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент подготовки к новому раунду.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const MixUpCoinsInPlayerHands = (G: IMyGameState, ctx: Ctx): void => {
    if (G.mode === GameModeNames.Multiplayer) {
        for (let p = 0; p < ctx.numPlayers; p++) {
            MixUpCoins(G, ctx, p);
        }
    } else if (G.mode === GameModeNames.Solo1) {
        MixUpCoins(G, ctx, 1);
    }
};
