import { ThrowMyError } from "../Error";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CoinTypeNames, ErrorNames, GameModeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, MoveArgumentsType, MoveCoinsArguments, MyFnContextWithMyPlayerID, Player, PublicPlayer, PublicPlayerCoinType, ZeroOrOneOrTwoType } from "../typescript/interfaces";

/**
 * <h3>Определяет минимальную видимую монету соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом.</li>
 * </ol>
 *
 * @param coins Все видимые монеты соло бота.
 * @param minValue Минимальное видимое значение монеты соло бота.
 * @returns Id минимальной видимой монеты соло бота.
 */
export const CheckMinCoinVisibleIndexForSoloBot = (coins: PublicPlayerCoinType[], minValue: number): number =>
    GetMinCoinVisibleIndex(coins, minValue);

/**
 * <h3>Определяет минимальную монету соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной монеты соло ботом Андвари.</li>
 * </ol>
 *
 * @param coins Все монеты соло бота Андвари.
 * @param minValue Минимальное значение монеты соло бота Андвари.
 * @returns Id минимальной монеты соло бота Андвари.
 */
export const CheckMinCoinIndexForSoloBotAndvari = (coins: PublicPlayerCoinType[], minValue: number): number =>
    GetMinCoinVisibleIndex(coins, minValue);

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
export const CheckMinCoinVisibleValueForSoloBot = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<MoveCoinsArguments[]>, type: CoinTypeNames): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument: CanBeUndefType<MoveCoinsArguments> = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        let coin: CanBeUndefType<PublicPlayerCoinType>,
            _exhaustiveCheck: never;
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
        if (coin === undefined) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть закрытой для него монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !coin.isInitial)) {
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
export const CheckMinCoinVisibleValueForSoloBotAndvari = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<MoveCoinsArguments[]>): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument: CanBeUndefType<MoveCoinsArguments> = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        let coin: CanBeUndefType<PublicPlayerCoinType>;
        if (coin === undefined) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' $на столе отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' на столе не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота Андвари` : `игрока`} с id '${myPlayerID}' $на столе не может быть закрытой для него монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !coin.isInitial)) {
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
 * @param coins Все видимые монеты соло ботов.
 * @param minValue Минимальное видимое значение монеты соло ботов.
 * @returns Id минимальной видимой монеты соло ботов.
 */
export const GetMinCoinVisibleIndex = (coins: PublicPlayerCoinType[], minValue: number) => {
    let coinId = -1;
    coins.forEach((coin: PublicPlayerCoinType, index: number): void => {
        if (IsCoin(coin)) {
            if ((coinId === -1 && coin.value === minValue)
                || (coinId !== -1 && coin.value === minValue && !coin.isInitial)) {
                coinId = index;
            }
        }
    });
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
export const PlaceAllCoinsInCurrentOrderForSoloBot = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
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
    const handCoins: CoinType[] = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
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
export const PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): void => {
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
    const handCoins: CoinType[] = privatePlayer.handCoins,
        isTradingCoinIndex: number =
            handCoins.findIndex((coin: CoinType, index: number): boolean => {
                if (coin === null) {
                    throw new Error(`В массиве монет соло бота Андвари с id '1' в руке не может не быть монеты с id '${index}'.`);
                }
                return Boolean(coin.isTriggerTrading);
            });
    if (isTradingCoinIndex === -1) {
        throw new Error(`В массиве монет соло бота Андвари с id '1' в руке отсутствует обменная монета.`);
    } else if (isTradingCoinIndex > 2) {
        const tradingCoin: CanBeUndefType<CoinType> = handCoins[isTradingCoinIndex];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве монет соло бота Андвари с id '1' в руке отсутствует обменная монета с id '${isTradingCoinIndex}'.`);
        }
        const newTradingCoinPositionIndex: ZeroOrOneOrTwoType = Math.floor(Math.random() * 3) as ZeroOrOneOrTwoType,
            tempCoin: CanBeUndefType<CoinType> = handCoins[newTradingCoinPositionIndex];
        if (tempCoin === undefined) {
            throw new Error(`В массиве монет соло бота Андвари с id '1' в руке отсутствует монета с id '${newTradingCoinPositionIndex}'.`);
        }
        handCoins[isTradingCoinIndex] = tempCoin;
        handCoins[newTradingCoinPositionIndex] = tradingCoin;
    }
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
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
