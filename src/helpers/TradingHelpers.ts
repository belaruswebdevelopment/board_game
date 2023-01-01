import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, ICoin, IPlayer, IPublicPlayer, MyFnContextWithMyPlayerID, PublicPlayerCoinType } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { AddActionsToStack } from "./StackHelpers";

/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const ActivateTrading = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const boardCoinCurrentTavern: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if ((boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern))
        || (IsCoin(boardCoinCurrentTavern) && !boardCoinCurrentTavern.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsCoin(boardCoinCurrentTavern) && boardCoinCurrentTavern.isTriggerTrading) {
        StartTrading({ G, ctx, myPlayerID, ...rest });
    }
};

/**
 * <h3>Стартует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается ход игрока.</li>
 * <li>Когда заканчивается ход соло бота.</li>
 * </ol>
 *
 * @param context
 * @param isSoloBotEndRound Является ли данное действие в конце хода соло бота.
 * @returns
 */
export const StartTrading = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, isSoloBotEndRound = false):
    void => {
    // TODO For solo mode check coins openings
    const privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(myPlayerID)],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const tradingCoins: ICoin[] = [];
    for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && myPlayerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)) {
            const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[i];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${i}'.`);
            }
            if (!IsCoin(privateBoardCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле не может не быть монеты с id '${i}'.`);
            }
            if (!privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[i] = privateBoardCoin;
        }
        const boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле отсутствует монета с id '${i}'.`);
        }
        if (boardCoin === null) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может не быть монеты с id '${i}'.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            if (!boardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(boardCoin, true);
            }
            if (!(G.mode === GameModeNames.Solo && myPlayerID === `1` && isSoloBotEndRound)) {
                if (boardCoin.isTriggerTrading) {
                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть обменная монета с id '${i}'.`);
                }
            }
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
                || G.mode === GameModeNames.SoloAndvari) || (G.mode === GameModeNames.Solo
                    && (myPlayerID === `1` && isSoloBotEndRound && !boardCoin.isTriggerTrading)
                    || (myPlayerID === `1` && !isSoloBotEndRound && !boardCoin.isTriggerTrading)
                    || myPlayerID === `0` && !isSoloBotEndRound)) {
                tradingCoins.push(boardCoin);
            }
        }
    }
    if (!isSoloBotEndRound
        || (G.mode === GameModeNames.Solo && myPlayerID === `1` && tradingCoins.length === 1 && isSoloBotEndRound)) {
        const soloBotOnlyOneCoinTrading: boolean =
            G.mode === GameModeNames.Solo && myPlayerID === `1` && tradingCoins.length === 1 && isSoloBotEndRound;
        Trading({ G, ctx, myPlayerID, ...rest }, tradingCoins, soloBotOnlyOneCoinTrading);
    }
};

/**
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param context
 * @param tradingCoins Монеты для обмена.
 * @param soloBotOnlyOneCoinTrading У соло бота доступна только 1 монета для обмена с рынка.
 * @returns
 */
const Trading = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, tradingCoins: ICoin[],
    soloBotOnlyOneCoinTrading = false): void => {
    const length: number = tradingCoins.length;
    if (!soloBotOnlyOneCoinTrading && length !== 2) {
        throw new Error(`В массиве обменных монет игрока с id '${myPlayerID}' должно быть ровно '2' монеты, а не '${length}'.`);
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const coinsValues: number[] = tradingCoins.map((coin: ICoin): number => coin.value),
        coinsMinValue: number = Math.min(...coinsValues),
        coinsMaxValue: number = Math.max(...coinsValues);
    let upgradingCoinId: number,
        coinMinIndex = -1,
        coinMaxIndex = -1,
        value: number;
    if (soloBotOnlyOneCoinTrading) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монеты с ценностью '${coinsMinValue}' соло бота с id '1'.`);
    } else {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} '${player.nickname}'.`);
    }
    for (let i = 0; i < tradingCoins.length; i++) {
        const tradingCoin: CanBeUndefType<ICoin> = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует монета с id '${i}'.`);
        }
        if (tradingCoin.value === coinsMinValue && coinMinIndex === -1) {
            coinMinIndex = i;
            if (soloBotOnlyOneCoinTrading) {
                break;
            }
        } else if (tradingCoin.value === coinsMaxValue && coinMaxIndex === -1) {
            coinMaxIndex = i;
        }
    }
    if (coinMinIndex === -1) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' не найдена минимальная монета с значением '${coinsMinValue}'.`);
    }
    if (!soloBotOnlyOneCoinTrading && coinMaxIndex === -1) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' не найдена максимальная монета с значением '${coinsMaxValue}'.`);
    }
    const minTradingCoin: CanBeUndefType<ICoin> = tradingCoins[coinMinIndex];
    if (minTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует минимальная монета с id '${coinMinIndex}'.`);
    }
    const maxTradingCoin: CanBeUndefType<ICoin> = tradingCoins[coinMaxIndex];
    if (!soloBotOnlyOneCoinTrading && maxTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует максимальная монета с id '${coinMaxIndex}'.`);
    }
    // TODO Check solo bot randomly picked concrete coin (or must always pick isInitial)!?
    if (!soloBotOnlyOneCoinTrading && (coinsMinValue === coinsMaxValue &&
        ((maxTradingCoin !== undefined && maxTradingCoin.isInitial) || minTradingCoin.isInitial))) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.pickConcreteCoinToUpgrade(coinsMaxValue, coinsMaxValue)]);
        DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
    } else {
        if (((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1`)
            || CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            if ((G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`)
                && (minTradingCoin.value + coinsMaxValue) > 25) {
                value = 5;
            } else {
                value = soloBotOnlyOneCoinTrading ? 1 : coinsMaxValue;
            }
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
                DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin);
            }
        } else {
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
            value = coinsMinValue;
        }
        UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, true, value, upgradingCoinId,
            CoinTypeNames.Board);
    }
};
