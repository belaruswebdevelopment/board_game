import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames } from "../typescript/enums";
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
export const CheckMinCoinVisibleIndexForSoloBot = (coins, minValue) => {
    let coinId = -1;
    coins.forEach((coin, index) => {
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
 * @returns Значение минимальной видимой монеты соло бота
 */
export const CheckMinCoinVisibleValueForSoloBot = (G, ctx, moveArguments, type) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
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
                throw new Error(`Не существует типа монеты - '${type}'.`);
                return _exhaustiveCheck;
        }
        if (coin === undefined) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} отсутствует монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (coin === null) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может отсутствовать монета с id '${currentMoveArgument.coinId}'.`);
        }
        if (!IsCoin(coin)) {
            throw new Error(`В массиве монет ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `игрока`} с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть закрытой для него монета с id '${ctx.currentPlayer}'.`);
        }
        if (minValue === 0 || coin.value < minValue || (coin.value === minValue && !coin.isInitial)) {
            minValue = coin.value;
        }
    }
    return minValue;
};
//# sourceMappingURL=SoloBotHelpers.js.map