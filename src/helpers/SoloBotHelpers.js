import { ThrowMyError } from "../Error";
import { AssertPlayerCoinId, AssertPlayerTavernCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsInitialCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CoinTypeNames, ErrorNames, GameModeNames, PlayerIdForSoloGameNames } from "../typescript/enums";
/**
 * <h3>Определяет минимальную видимую монету соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param coins Все видимые монеты соло бота.
 * @param minValue Минимальное видимое значение монеты соло бота.
 * @returns Id минимальной видимой монеты соло бота.
 */
export const CheckMinCoinVisibleIndexForSoloBot = ({ G, ctx, myPlayerID, ...rest }, coins, minValue) => GetMinCoinVisibleIndex({ G, ctx, myPlayerID, ...rest }, coins, minValue);
/**
 * <h3>Определяет минимальную монету соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной монеты соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param coins Все монеты соло бота Андвари.
 * @param minValue Минимальное значение монеты соло бота Андвари.
 * @returns Id минимальной монеты соло бота Андвари.
 */
export const CheckMinCoinIndexForSoloBotAndvari = ({ G, ctx, myPlayerID, ...rest }, coins, minValue) => GetMinCoinVisibleIndex({ G, ctx, myPlayerID, ...rest }, coins, minValue);
/**
 * <h3>Определяет значение минимальной видимой монеты соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @param type Тип минимальной видимой монеты соло бота.
 * @returns Значение минимальной видимой монеты соло бота.
 */
export const CheckMinCoinVisibleValueForSoloBot = ({ G, ctx, myPlayerID, ...rest }, moveArguments, type) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        let coin, _exhaustiveCheck;
        switch (type) {
            case CoinTypeNames.Hand:
                coin = player.handCoins[currentMoveArgument.coinId];
                break;
            case CoinTypeNames.Board:
                coin = player.boardCoins[currentMoveArgument.coinId];
                break;
            default:
                _exhaustiveCheck = type;
                throw new Error(`Не существует такого типа монеты.`);
                return _exhaustiveCheck;
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока`} с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть закрытой для него монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !IsInitialCoin(coin))) {
            minValue = coin.value;
        }
    }
    return minValue;
};
/**
 * <h3>Определяет значение минимальной монеты соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной монеты соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Значение минимальной монеты соло бота Андвари.
 */
export const CheckMinCoinVisibleValueForSoloBotAndvari = ({ G, ctx, myPlayerID, ...rest }, moveArguments) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        // TODO Check this line!
        const coin = player.boardCoins[currentMoveArgument.coinId];
        if (coin === null) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' на столе не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' на столе не может быть закрытой для него монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !IsInitialCoin(coin))) {
            minValue = coin.value;
        }
    }
    return minValue;
};
/**
 * <h3>Определяет минимальную видимую монету соло ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом.</li>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param coins Все видимые монеты соло ботов.
 * @param minValue Минимальное видимое значение монеты соло ботов.
 * @returns Id минимальной видимой монеты соло ботов.
 */
export const GetMinCoinVisibleIndex = ({ G, ctx, myPlayerID }, coins, minValue) => {
    let coinId;
    coins.forEach((coin, index) => {
        AssertPlayerCoinId(index);
        if (IsCoin(coin)) {
            if ((coinId === undefined && coin.value === minValue)
                || (coinId !== undefined && coin.value === minValue && !IsInitialCoin(coin))) {
                coinId = index;
            }
        }
    });
    if (coinId === undefined) {
        throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' на столе не может не быть монеты с минимальным значением '${minValue}'.`);
    }
    return coinId;
};
/**
 * <h3>Выкладка монет соло ботами в текущем порядке из руки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const PlaceAllCoinsInCurrentOrderForSoloBot = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const handCoins = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        AssertPlayerCoinId(i);
        const handCoin = handCoins[i];
        if (handCoin === null) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        player.boardCoins[i] = {};
        handCoins[i] = null;
        player.handCoins[i] = null;
    }
};
/**
 * <h3>Выкладка монет соло ботами из руки в порядке, когда обменная монета не в кошеле.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const handCoins = privatePlayer.handCoins, isTradingCoinIndex = handCoins.findIndex((coin, index) => {
        if (coin === null) {
            throw new Error(`В массиве монет соло бота Андвари с id '1' в руке не может не быть монеты с id '${index}'.`);
        }
        return IsTriggerTradingCoin(coin);
    });
    if (isTradingCoinIndex === -1) {
        throw new Error(`В массиве монет соло бота Андвари с id '1' в руке отсутствует обменная монета.`);
    }
    else if (isTradingCoinIndex > 2) {
        AssertPlayerCoinId(isTradingCoinIndex);
        const tradingCoin = handCoins[isTradingCoinIndex], newTradingCoinPositionIndex = Math.floor(Math.random() * 3);
        AssertPlayerTavernCoinId(newTradingCoinPositionIndex);
        const tempCoin = handCoins[newTradingCoinPositionIndex];
        handCoins[isTradingCoinIndex] = tempCoin;
        handCoins[newTradingCoinPositionIndex] = tradingCoin;
    }
    for (let i = 0; i < handCoins.length; i++) {
        AssertPlayerCoinId(i);
        const handCoin = handCoins[i];
        if (handCoin === null) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        player.boardCoins[i] = {};
        handCoins[i] = null;
        player.handCoins[i] = null;
    }
};
//# sourceMappingURL=SoloBotHelpers.js.map