import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypeNames, LogTypes } from "../typescript/enums";
import type { CanBeUndef, CoinTypes, ICoin, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ActivateTrading = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const boardCoinCurrentTavern: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if ((boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern))
        || (IsCoin(boardCoinCurrentTavern) && !boardCoinCurrentTavern.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsCoin(boardCoinCurrentTavern) && boardCoinCurrentTavern.isTriggerTrading) {
        StartTrading(G, ctx);
    }
};

export const StartTrading = (G: IMyGameState, ctx: Ctx, isSoloBotEndRound = false) => {
    // TODO For solo mode check coins openings
    const privatePlayer: CanBeUndef<IPlayer> = G.players[isSoloBotEndRound ? 1 : Number(ctx.currentPlayer)],
        player: CanBeUndef<IPublicPlayer> = G.publicPlayers[isSoloBotEndRound ? 1 : Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const tradingCoins: ICoin[] = [];
    for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
        if (G.multiplayer) {
            const privateBoardCoin: CanBeUndef<CoinTypes> = privatePlayer.boardCoins[i];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${i}'.`);
            }
            if (!IsCoin(privateBoardCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на поле не может не быть монеты с id '${i}'.`);
            }
            if (!privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[i] = privateBoardCoin;
        }
        const boardCoin: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${i}'.`);
        }
        if (boardCoin === null) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может не быть монеты с id '${i}'.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            if (!boardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(boardCoin, true);
            }
            if (!(G.solo && ctx.currentPlayer === `1` && isSoloBotEndRound)) {
                if (boardCoin.isTriggerTrading) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть обменной монеты с id '${i}'.`);
                }
            }
            if (!G.solo || (G.solo && ctx.currentPlayer === `1` && isSoloBotEndRound && !boardCoin.isTriggerTrading)) {
                tradingCoins.push(boardCoin);
            }
        }
    }
    if (!isSoloBotEndRound || (G.solo && ctx.currentPlayer === `1` && tradingCoins.length === 1 && isSoloBotEndRound)) {
        const soloBotOnlyOneCoinTrading =
            !G.solo || (G.solo && ctx.currentPlayer === `1` && tradingCoins.length === 1 && isSoloBotEndRound);
        Trading(G, ctx, tradingCoins, soloBotOnlyOneCoinTrading);
    }
};

/**
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param tradingCoins Монеты для обмена.
 * @param soloBotOnlyOneCoinTrading У соло бота доступна только 1 монета для обмена с рынка.
 */
const Trading = (G: IMyGameState, ctx: Ctx, tradingCoins: ICoin[], soloBotOnlyOneCoinTrading = false): void => {
    const length: number = tradingCoins.length;
    if (!soloBotOnlyOneCoinTrading && length !== 2) {
        throw new Error(`В массиве обменных монет игрока с id '${ctx.currentPlayer}' должно быть ровно '2' монеты, а не '${length}'.`);
    }
    const player: CanBeUndef<IPublicPlayer> =
        G.publicPlayers[soloBotOnlyOneCoinTrading ? 1 : Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${soloBotOnlyOneCoinTrading ? 1 : Number(ctx.currentPlayer)}'.`);
    }
    const coinsValues: number[] = tradingCoins.map((coin: ICoin): number => coin.value),
        coinsMinValue: number = Math.min(...coinsValues),
        coinsMaxValue: number = Math.max(...coinsValues);
    let upgradingCoinId: number,
        coinMinIndex = -1,
        coinMaxIndex = -1,
        value: number;
    if (soloBotOnlyOneCoinTrading) {
        AddDataToLog(G, LogTypes.Game, `Активирован обмен монеты с ценностью '${coinsMinValue}' соло бота с id '1'.`);
    } else {
        AddDataToLog(G, LogTypes.Game, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} '${player.nickname}'.`);
    }
    for (let i = 0; i < tradingCoins.length; i++) {
        const tradingCoin: CanBeUndef<ICoin> = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' отсутствует монета с id '${i}'.`);
        }
        if (tradingCoin.value === coinsMinValue && coinMinIndex === -1) {
            coinMinIndex = i;
            break;
        } else if (tradingCoin.value === coinsMaxValue && coinMaxIndex === -1) {
            coinMaxIndex = i;
        }
    }
    if (coinMinIndex === -1) {
        throw new Error(`В массиве обменных монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' не найдена минимальная монета с значением '${coinsMinValue}'.`);
    }
    if (!soloBotOnlyOneCoinTrading && coinMaxIndex === -1) {
        throw new Error(`В массиве обменных монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' не найдена максимальная монета с значением '${coinsMaxValue}'.`);
    }
    const minTradingCoin: CanBeUndef<ICoin> = tradingCoins[coinMinIndex];
    if (minTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' отсутствует минимальная монета с id '${coinMinIndex}'.`);
    }
    const maxTradingCoin: CanBeUndef<ICoin> = tradingCoins[coinMaxIndex];
    if (!soloBotOnlyOneCoinTrading && maxTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' отсутствует максимальная монета с id '${coinMaxIndex}'.`);
    }
    // TODO Check solo bot randomly picked concrete coin (or must always pick isInitial)!?
    if (!soloBotOnlyOneCoinTrading && (coinsMinValue === coinsMaxValue &&
        ((maxTradingCoin !== undefined && maxTradingCoin.isInitial) || minTradingCoin.isInitial))) {
        AddActionsToStackAfterCurrent(G, ctx,
            [StackData.pickConcreteCoinToUpgrade(coinsMaxValue, coinsMaxValue)]);
        DrawCurrentProfit(G, ctx);
    } else {
        if (soloBotOnlyOneCoinTrading || CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            value = soloBotOnlyOneCoinTrading ? 1 : coinsMaxValue;
            if (CheckPlayerHasBuff(player, BuffNames.UpgradeNextCoin)) {
                DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
            }
        } else {
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
            value = coinsMinValue;
        }
        UpgradeCoinAction(G, ctx, true, value, upgradingCoinId, CoinTypeNames.Board);
    }
};
