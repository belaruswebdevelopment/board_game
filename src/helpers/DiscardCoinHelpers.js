import { ThrowMyError } from "../Error";
import { ErrorNames } from "../typescript/enums";
// TODO Think about MarketCoinIdType
/**
 * <h3>Действия, связанные с убиранием монеты с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, убирающих монеты с рынка.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id убираемой монеты.
 * @returns Убираемая монета с рынка.
 */
export const RemoveCoinFromMarket = ({ G }, coinId) => {
    const coin = G.royalCoins.splice(coinId, 1)[0];
    if (coin === undefined) {
        throw new Error(`Отсутствует минимальная монета на рынке с id '${coinId}'.`);
    }
    return coin;
};
/**
 * <h3>Действия, связанные с убиранием монеты у игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, убирающих монеты у игрока.</li>
 * </ol>
 *
 * @param context
 * @param coins Массив монет игрока, откуда убирается монета.
 * @param coinId Id убираемой монеты.
 * @returns Убираемая монета у игрока.
 */
export const RemoveCoinFromPlayer = ({ G, ctx, myPlayerID, ...rest }, coins, coinId) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const amount = 1, removedCoinsArray = coins.splice(coinId, 1, null);
    if (amount !== removedCoinsArray.length) {
        throw new Error(`Недостаточно монет в массиве монет игрока: требуется - '${amount}', в наличии - '${removedCoinsArray.length}'.`);
    }
    const removedCoin = removedCoinsArray[0];
    if (removedCoin === undefined) {
        throw new Error(`Не может отсутствовать сброшенная монета.`);
    }
    if (removedCoin === null) {
        throw new Error(`Не может не быть монеты для сброса.`);
    }
    player.currentCoinsScore -= removedCoin.value;
};
//# sourceMappingURL=DiscardCoinHelpers.js.map