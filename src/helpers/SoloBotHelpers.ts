import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames, GameModeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, IMoveCoinsArguments, IMyGameState, IPlayer, IPublicPlayer, MoveArgumentsType, PublicPlayerCoinType, ZeroOrOneOrTwoType } from "../typescript/interfaces";

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
export const CheckMinCoinVisibleIndexForSoloBot = (coins: PublicPlayerCoinType[], minValue: number): number => {
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
export const CheckMinCoinIndexForSoloBotAndvari = (coins: CoinType[], minValue: number): number => {
    let coinId = -1;
    coins.forEach((coin: CoinType, index: number): void => {
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
 * <h3>Определяет значение минимальной видимой монеты соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости обмена минимальной видимой монеты соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @param type Тип минимальной видимой монеты соло бота.
 * @returns Значение минимальной видимой монеты соло бота.
 */
export const CheckMinCoinVisibleValueForSoloBot = (G: IMyGameState, ctx: Ctx,
    moveArguments: MoveArgumentsType<IMoveCoinsArguments[]>, type: CoinTypeNames): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
            ctx.currentPlayer);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument: CanBeUndefType<IMoveCoinsArguments> = moveArguments[i];
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
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть закрытой для него монета с id '${ctx.currentPlayer}'.`);
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
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Значение минимальной монеты соло бота Андвари.
 */
export const CheckMinCoinVisibleValueForSoloBotAndvari = (G: IMyGameState, ctx: Ctx,
    moveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): number => {
    const player: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
            ctx.currentPlayer);
    }
    let minValue = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const currentMoveArgument: CanBeUndefType<IMoveCoinsArguments> = moveArguments[i];
        if (currentMoveArgument === undefined) {
            throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
        }
        const coin: CanBeUndefType<CoinType> = player.boardCoins[currentMoveArgument.coinId];
        if (coin === undefined) {
            throw new Error(`В массиве монет соло бота Андвари с id '1' отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет соло бота Андвари с id '1' не может не быть монеты с id '${currentMoveArgument.coinId}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !coin.isInitial)) {
            minValue = coin.value;
        }
    }
    return minValue;
};

/**
 * <h3>Выкладка монет соло ботами в текущем порядке из руки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PlaceAllCoinsInCurrentOrderForSoloBot = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    const handCoins: CoinType[] = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${i}'.`);
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
 * @param G
 * @param ctx
 */
export const PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
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
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        player.boardCoins[i] = {};
        handCoins[i] = null;
        player.handCoins[i] = null;
    }
};
