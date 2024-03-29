import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AssertPlayerCoinId, AssertPlayerPouchCoinId, AssertTradingCoins, AssertTradingCoinsValues, AssertUpgradableCoinValue, AssertZeroOrOne } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsInitialCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames, PlayerIdForSoloGameNames } from "../typescript/enums";
import type { CanBeUndefType, CoinCanBeUpgradedByValueType, CoinType, MyFnContextWithMyPlayerID, PlayerPouchCoinIdType, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, TradingCoinsArrayLength, TradingCoinsType, UpgradableCoinType, ZeroOrOneType } from "../typescript/interfaces";
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
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const boardCoinCurrentTavern: PublicPlayerCoinType = player.boardCoins[G.currentTavern];
    if ((boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern))
        || (IsCoin(boardCoinCurrentTavern) && !boardCoinCurrentTavern.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsTriggerTradingCoin(boardCoinCurrentTavern)) {
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
    const privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(myPlayerID)],
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const tradingCoins: UpgradableCoinType[] = [];
    for (let i: number = G.tavernsNum; i < player.boardCoins.length; i++) {
        AssertPlayerCoinId(i);
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo
            && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)) {
            const privateBoardCoin: CoinType = privatePlayer.boardCoins[i];
            if (!IsCoin(privateBoardCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле не может не быть монеты с id '${i}'.`);
            }
            if (!privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[i] = privateBoardCoin;
        }
        const boardCoin: PublicPlayerCoinType = player.boardCoins[i];
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
            if (!(G.mode === GameModeNames.Solo && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId
                && isSoloBotEndRound)) {
                if (IsTriggerTradingCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' на поле не может быть не может быть монета, активирующая обмен монет, с id '${i}'.`);
                }
            }
            if (!IsTriggerTradingCoin(boardCoin)) {
                tradingCoins.push(boardCoin);
            }
        }
    }
    if (!isSoloBotEndRound
        || (G.mode === GameModeNames.Solo && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId
            && tradingCoins.length === 1 && isSoloBotEndRound)) {
        const soloBotOnlyOneCoinTrading: boolean =
            G.mode === GameModeNames.Solo && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId
            && tradingCoins.length === 1 && isSoloBotEndRound;
        AssertTradingCoins(tradingCoins);
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
const Trading = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, tradingCoins: TradingCoinsType,
    soloBotOnlyOneCoinTrading = false): void => {
    const length: TradingCoinsArrayLength = tradingCoins.length;
    if (!soloBotOnlyOneCoinTrading && length !== 2) {
        throw new Error(`В массиве обменных монет игрока с id '${myPlayerID}' должно быть ровно '2' монеты, а не '${length}'.`);
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const tradingCoinsValues: number[] = tradingCoins.map((coin: UpgradableCoinType): number => coin.value);
    AssertTradingCoinsValues(tradingCoinsValues);
    const coinsMinValue: number = Math.min(...tradingCoinsValues),
        coinsMaxValue: number = Math.max(...tradingCoinsValues);
    AssertUpgradableCoinValue(coinsMinValue);
    AssertUpgradableCoinValue(coinsMaxValue);
    let upgradingCoinId: PlayerPouchCoinIdType,
        coinMinIndex: CanBeUndefType<ZeroOrOneType>,
        coinMaxIndex: CanBeUndefType<ZeroOrOneType>,
        value: CoinCanBeUpgradedByValueType;
    if (soloBotOnlyOneCoinTrading) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монеты с ценностью '${coinsMinValue}' соло бота с id '1'.`);
    } else {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} '${player.nickname}'.`);
    }
    for (let i = 0; i < tradingCoins.length; i++) {
        AssertZeroOrOne(i);
        const tradingCoin: CanBeUndefType<UpgradableCoinType> = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует монета с id '${i}'.`);
        }
        if (IsTriggerTradingCoin(tradingCoin)) {
            throw new Error(`Обменная монета игрока с id '${myPlayerID}' не может быть монетой, активирующей обмен монет.`);
        }
        if (tradingCoin.value === coinsMinValue && coinMinIndex === undefined) {
            coinMinIndex = i;
            if (soloBotOnlyOneCoinTrading) {
                break;
            }
        } else if (tradingCoin.value === coinsMaxValue && coinMaxIndex === undefined) {
            coinMaxIndex = i;
        }
    }
    if (coinMinIndex === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' не найдена минимальная монета с значением '${coinsMinValue}'.`);
    }
    if (!soloBotOnlyOneCoinTrading && coinMaxIndex === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' не найдена максимальная монета с значением '${coinsMaxValue}'.`);
    }
    const minTradingCoin: CanBeUndefType<UpgradableCoinType> = tradingCoins[coinMinIndex];
    if (minTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует минимальная монета с id '${coinMinIndex}'.`);
    }
    if (coinMaxIndex === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' не найдена минимальная монета с значением '${coinsMaxValue}'.`);
    }
    const maxTradingCoin: CanBeUndefType<UpgradableCoinType> = tradingCoins[coinMaxIndex];
    if (!soloBotOnlyOneCoinTrading && maxTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' отсутствует максимальная монета с id '${coinMaxIndex}'.`);
    }
    // TODO Check solo bot randomly picked concrete coin (or must always pick isInitial)!?
    if (!soloBotOnlyOneCoinTrading && (coinsMinValue === coinsMaxValue &&
        ((maxTradingCoin !== undefined && IsInitialCoin(maxTradingCoin))
            || IsInitialCoin(minTradingCoin)))) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.pickConcreteCoinToUpgrade(coinsMaxValue, coinsMaxValue)]);
        DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
    } else {
        if (((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari)
            && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)
            || CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
            const coinIndex: number = G.tavernsNum + coinMinIndex;
            AssertPlayerPouchCoinId(coinIndex);
            upgradingCoinId = coinIndex;
            if ((G.mode === GameModeNames.SoloAndvari && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)
                && (minTradingCoin.value + coinsMaxValue) > 25) {
                value = 5;
            } else {
                value = soloBotOnlyOneCoinTrading ? 1 : coinsMaxValue;
            }
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
                DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeNextCoin);
            }
        } else {
            const coinIndex: number = G.tavernsNum + coinMaxIndex;
            AssertPlayerPouchCoinId(coinIndex);
            upgradingCoinId = coinIndex;
            value = coinsMinValue;
        }
        UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, true, value, upgradingCoinId,
            CoinTypeNames.Board);
    }
};
