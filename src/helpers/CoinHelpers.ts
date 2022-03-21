import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import type { CoinType, ICoin, IMyGameState, INumberValues, IPlayer, IPriority, IPublicPlayer, IResolveBoardCoins, PublicPlayerBoardCoinTypes } from "../typescript/interfaces";
import { IsMultiplayer } from "./MultiplayerHelpers";

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
export const GetMaxCoinValue = (G: IMyGameState, playerId: number): number => {
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[playerId],
        privatePlayer: IPlayer | undefined = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    let handCoins: CoinType[];
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует игрок ${playerId}.`);
        }
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    return Math.max(...player.boardCoins.filter((coin: PublicPlayerBoardCoinTypes): boolean =>
        IsCoin(coin)).map((coin: PublicPlayerBoardCoinTypes): number => (coin as ICoin).value),
        ...handCoins.filter((coin: CoinType): boolean =>
            IsCoin(coin)).map((coin: CoinType): number => (coin as ICoin).value));
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
        const playerI: IPublicPlayer | undefined = G.publicPlayers[i];
        if (playerI === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
        const coin: PublicPlayerBoardCoinTypes | undefined = playerI.boardCoins[G.currentTavern];
        if (coin !== undefined) {
            if (IsCoin(coin)) {
                coinValues[i] = coin.value;
                playersOrderNumbers.push(i);
                exchangeOrder.push(i);
            }
            for (let j: number = playersOrderNumbers.length - 1; j > 0; j--) {
                const playersOrderNumberCur: number | undefined = playersOrderNumbers[j],
                    playersOrderNumberPrev: number | undefined = playersOrderNumbers[j - 1];
                if (playersOrderNumberCur === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует текущий ${j}.`);
                }
                if (playersOrderNumberPrev === undefined) {
                    throw new Error(`В массиве порядка хода игроков отсутствует предыдущий ${j - 1}.`);
                }
                const playerCur: IPublicPlayer | undefined = G.publicPlayers[playersOrderNumberCur],
                    playerPrev: IPublicPlayer | undefined = G.publicPlayers[playersOrderNumberPrev];
                if (playerCur === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок ${playersOrderNumberCur}.`);
                }
                if (playerPrev === undefined) {
                    throw new Error(`В массиве игроков отсутствует предыдущий игрок ${playersOrderNumberPrev}.`);
                }
                const coin: PublicPlayerBoardCoinTypes | undefined = playerCur.boardCoins[G.currentTavern],
                    prevCoin: PublicPlayerBoardCoinTypes | undefined = playerPrev.boardCoins[G.currentTavern];
                if (coin === undefined) {
                    throw new Error(`В массиве монет текущего игрока ${playersOrderNumberCur} на столе отсутствует монета в позиции текущей таверны ${G.currentTavern}.`);
                }
                if (prevCoin === undefined) {
                    throw new Error(`В массиве монет предыдущего игрока ${playersOrderNumberPrev} на столе отсутствует монета в позиции текущей таверны ${G.currentTavern}.`);
                }
                if (IsCoin(coin) && IsCoin(prevCoin)) {
                    // TODO Move same logic 1place: [playersOrderNumbers[j], playersOrderNumbers[j - 1]] = [playersOrderNumberPrev, playersOrderNumberCur]
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
            throw new Error(`В массиве монет игрока ${i} на столе отсутствует монета в позиции ${G.currentTavern}.`);
        }
    }
    const counts: INumberValues = {};
    for (let i = 0; i < coinValues.length; i++) {
        const coinValue: number | undefined = coinValues[i];
        if (coinValue !== undefined) {
            const value: number = counts[coinValue] ?? 0;
            counts[coinValue] = 1 + value;
        }
    }
    for (const prop in counts) {
        if (Object.prototype.hasOwnProperty.call(counts, prop)) {
            const value: number | undefined = counts[prop];
            if (value === undefined) {
                throw new Error(`В массиве значений монет отсутствует ${prop}.`);
            }
            if (value <= 1) {
                continue;
            }
            const tiePlayers: IPublicPlayer[] =
                Object.values(G.publicPlayers).filter((player: IPublicPlayer): boolean => {
                    const boardCoinCurrentTavern: PublicPlayerBoardCoinTypes | undefined =
                        player.boardCoins[G.currentTavern];
                    if (boardCoinCurrentTavern === undefined) {
                        throw new Error(`В массиве монет игрока отсутствует монета текущей таверны ${G.currentTavern}.`);
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
                tiePlayers.splice(tiePlayers.findIndex((player: IPublicPlayer): boolean =>
                    player.priority.value === minPriority), 1);
                const exchangeOrderMax: number | undefined = exchangeOrder[maxIndex],
                    exchangeOrderMin: number | undefined = exchangeOrder[minIndex];
                if (exchangeOrderMax === undefined) {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует максимальная ${exchangeOrder[maxIndex]}.`);
                }
                if (exchangeOrderMin === undefined) {
                    throw new Error(`В массиве изменений порядка хода игроков отсутствует минимальная ${exchangeOrder[minIndex]}.`);
                }
                [exchangeOrder[minIndex], exchangeOrder[maxIndex]] = [exchangeOrderMax, exchangeOrderMin];
            }
        }
    }
    const playersOrder = playersOrderNumbers.map((index: number): string => String(index));
    return {
        playersOrder,
        exchangeOrder,
    };
};
