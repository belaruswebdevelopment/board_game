import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { IsCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames, ValkyryBuffNames } from "../typescript/enums";
import type { AllCoinsType, AllCoinsValueType, CanBeUndefType, CoinType, FnContext, MyFnContextWithMyPlayerID, NumberValues, Player, PlayerID, Priority, PublicPlayer, PublicPlayerCoinType, ResolveBoardCoins } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { RemoveCoinFromPlayer } from "./DiscardCoinHelpers";
import { CheckValkyryRequirement } from "./MythologicalCreatureHelpers";

/**
 * <h3>Сброс обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции охотников (обмен '0' на '3').</li>
 * <li>Действия, связанные со сбросом обменной монеты по карте артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param context
 * @returns Тип и индекс сбрасываемой обменной монеты.
 */
export const DiscardTradingCoin = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    [CoinTypeNames, number] => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let tradingCoinIndex: number = player.boardCoins.findIndex((coin: PublicPlayerCoinType): boolean =>
        IsTriggerTradingCoin(coin)),
        type: CoinTypeNames = CoinTypeNames.Board;
    if (tradingCoinIndex === -1 && G.mode === GameModeNames.Multiplayer) {
        tradingCoinIndex = privatePlayer.boardCoins.findIndex((coin: CoinType, index: number): boolean => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${index}'.`);
            }
            return IsTriggerTradingCoin(coin);
        });
    }
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && tradingCoinIndex === -1
        && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        tradingCoinIndex = handCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean => {
            if (coin !== null && !IsCoin(coin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${index}'.`);
            }
            return IsTriggerTradingCoin(coin);
        });
        if (tradingCoinIndex === -1) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
        }
        type = CoinTypeNames.Hand;
        RemoveCoinFromPlayer(handCoins, tradingCoinIndex);
        if (G.mode === GameModeNames.Multiplayer) {
            RemoveCoinFromPlayer(player.handCoins, tradingCoinIndex);
        }
    } else {
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока с id '${myPlayerID}' на столе не может отсутствовать обменная монета.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            RemoveCoinFromPlayer(privatePlayer.boardCoins, tradingCoinIndex);
        }
        RemoveCoinFromPlayer(player.boardCoins, tradingCoinIndex);
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
 * @param context
 * @returns Максимальная монета игрока.
 */
export const GetMaxCoinValue = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    return Math.max(...player.boardCoins.filter(IsCoin).map((coin: AllCoinsType,
        index: number): number => {
        if (!coin.isOpened) {
            throw new Error(`В массиве монет игрока '${player.nickname}' на поле не может быть ранее не открыта монета с id '${index}'.`);
        }
        return coin.value;
    }));
};

/**
 * <h3>Открывает закрытые монеты на столе игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда нужно открыть все закрытые монеты всех игроков.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OpenClosedCoinsOnPlayerBoard = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    for (let j = 0; j < player.boardCoins.length; j++) {
        const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
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
            throw new Error(`В массиве монет публичного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
        }
        if (publicBoardCoin !== null && !IsCoin(publicBoardCoin)) {
            throw new Error(`В массиве монет публичного игрока с id '${myPlayerID}' на поле не может быть закрыта монета с id '${j}'.`);
        }
        if (IsCoin(publicBoardCoin)) {
            if (!publicBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, true);
            }
        }
    }
};

/**
 * <h3>Открывает закрытые монеты текущей таверны на столе игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент игры, когда нужно открыть все закрытые монеты текущей таверны всех игроков в фазу 'Смотр войск'.</li>
 * <li>В момент игры, когда нужно открыть все закрытые монеты текущей таверны всех игроков в фазу 'Ставки Улина'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OpenCurrentTavernClosedCoinsOnPlayerBoard = ({ G, ctx, ...rest }: FnContext): void => {
    Object.values(G.publicPlayers).forEach((player: PublicPlayer, index: number): void => {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && index === 1)
            || (G.mode === GameModeNames.SoloAndvari && index === 1)) {
            const privatePlayer: CanBeUndefType<Player> = G.players[index];
            if (privatePlayer === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
                    index);
            }
            const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[G.currentTavern];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${index}' в руке отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
            }
            if (privateBoardCoin !== null && !privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[G.currentTavern] = privateBoardCoin;
        } else {
            const publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[G.currentTavern];
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
};

/**
 * <h3>Определяет по расположению монет игроками порядок ходов и порядок обмена кристаллов приоритета.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выкладки всех монет игроками.</li>
 * </ol>
 *
 * @param context
 * @returns Порядок ходов игроков & порядок изменения ходов игроками.
 */
export const ResolveAllBoardCoins = ({ G, ctx, ...rest }: FnContext): ResolveBoardCoins => {
    const playersOrderNumbers: number[] = [],
        coinValues: AllCoinsValueType[] = [],
        exchangeOrder: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI: CanBeUndefType<PublicPlayer> = G.publicPlayers[i];
        if (playerI === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                i);
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
                const playerCur: CanBeUndefType<PublicPlayer> = G.publicPlayers[playersOrderNumberCur],
                    playerPrev: CanBeUndefType<PublicPlayer> = G.publicPlayers[playersOrderNumberPrev];
                if (playerCur === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        playersOrderNumberCur);
                }
                if (playerPrev === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
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
                        const priority: Priority = playerCur.priority,
                            prevPriority: Priority = playerPrev.priority;
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
    const counts: NumberValues = {};
    for (let i = 0; i < coinValues.length; i++) {
        const coinValue: CanBeUndefType<AllCoinsValueType> = coinValues[i];
        if (coinValue !== undefined) {
            const value: AllCoinsValueType = (counts[coinValue] ?? 0) as AllCoinsValueType;
            counts[coinValue] = 1 + value;
        }
    }
    for (const prop in counts) {
        const value: CanBeUndefType<number> = counts[prop as unknown as AllCoinsValueType];
        if (value === undefined) {
            throw new Error(`В массиве значений монет отсутствует с id '${prop}'.`);
        }
        if (value <= 1) {
            continue;
        }
        const tiePlayers: PublicPlayer[] =
            Object.values(G.publicPlayers).filter((player: PublicPlayer, index: number): boolean => {
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
                tiePlayers.map((player: PublicPlayer): number => player.priority.value),
                maxPriority: number = Math.max(...tiePlayersPriorities),
                minPriority: number = Math.min(...tiePlayersPriorities),
                maxIndex: number =
                    Object.values(G.publicPlayers).findIndex((player: PublicPlayer): boolean =>
                        player.priority.value === maxPriority),
                minIndex: number =
                    Object.values(G.publicPlayers).findIndex((player: PublicPlayer): boolean =>
                        player.priority.value === minPriority),
                amount = 1,
                removedTiePlayersWithMaxPriority: PublicPlayer[] =
                    tiePlayers.splice(tiePlayers.findIndex((player: PublicPlayer): boolean =>
                        player.priority.value === maxPriority), amount),
                removedTiePlayersWithMinPriority: PublicPlayer[] =
                    tiePlayers.splice(tiePlayers.findIndex((player: PublicPlayer): boolean =>
                        player.priority.value === minPriority), amount);
            if (amount !== removedTiePlayersWithMaxPriority.length) {
                throw new Error(`Недостаточно игроков в массиве игроков с максимальным приоритетом: требуется - '${amount}', в наличии - '${removedTiePlayersWithMaxPriority.length}'.`);
            }
            if (amount !== removedTiePlayersWithMinPriority.length) {
                throw new Error(`Недостаточно игроков в массиве игроков с минимальным приоритетом: требуется - '${amount}', в наличии - '${removedTiePlayersWithMinPriority.length}'.`);
            }
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
    const playersOrder: PlayerID[] =
        playersOrderNumbers.map((index: number): PlayerID => String(index));
    if (G.expansions.Idavoll.active) {
        const firstPlayer: CanBeUndefType<PlayerID> = playersOrder[0];
        if (firstPlayer === undefined) {
            throw new Error(`В массиве порядка хода игроков не может отсутствовать победивший первый игрок.`);
        }
        CheckValkyryRequirement({ G, ctx, myPlayerID: firstPlayer, ...rest },
            ValkyryBuffNames.CountBidWinnerAmount);
    }
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
 * @param context
 * @returns
 */
export const ReturnCoinsFromPlayerHandsToPlayerBoard = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
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
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${i}'.`);
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
 * @param context
 * @returns
 */
export const ReturnCoinsToPlayerHands = ({ G, ctx, ...rest }: FnContext): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[i],
            privatePlayer: CanBeUndefType<Player> = G.players[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                i);
        }
        if (privatePlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
                i);
        }
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest },
                HeroBuffNames.EveryTurn)) {
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
            const isCoinReturned: boolean =
                ReturnCoinToPlayerHands({ G, ctx, myPlayerID: String(i), ...rest }, j, true);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Все монеты вернулись в руки игроков.`);
};

/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param close Нужно ли закрыть монету.
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, coinId: number,
    close: boolean): boolean => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
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
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    if (IsCoin(coin)) {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
            if (!coin.isOpened) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть ранее не открыта монета с id '${coinId}'.`);
            }
        }
        if (close && coin.isOpened) {
            ChangeIsOpenedCoinStatus(coin, false);
        }
        handCoins[tempCoinId] = coin;
    } else {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
            const privateBoardCoin: CanBeUndefType<PublicPlayerCoinType> = privatePlayer.boardCoins[coinId];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${coinId}'.`);
            }
            if (IsCoin(privateBoardCoin)) {
                if (close && privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, false);
                }
                handCoins[tempCoinId] = privateBoardCoin;
            }
        }
    }
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
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
 * @param context
 * @returns
 */
const MixUpCoins = ({ G, ctx, myPlayerID, random, ...rest }: MyFnContextWithMyPlayerID): void => {
    const privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, random, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    privatePlayer.handCoins = random.Shuffle(privatePlayer.handCoins);
};

/**
 * <h3>Начинает рандомизацию монет в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В момент подготовки к новому раунду.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const MixUpCoinsInPlayerHands = ({ G, ctx, random, ...rest }: FnContext): void => {
    if (G.mode === GameModeNames.Multiplayer) {
        for (let p = 0; p < ctx.numPlayers; p++) {
            MixUpCoins({ G, ctx, myPlayerID: String(p), random, ...rest });
        }
    } else if (G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) {
        MixUpCoins({ G, ctx, myPlayerID: `1`, random, ...rest });
    }
};
