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
    const coin = G.marketCoins.splice(coinId, 1)[0];
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
 * @param coins Массив монет игрока, откуда убирается монета.
 * @param coinId Id убираемой монеты.
 * @returns Убираемая монета у игрока.
 */
export const RemoveCoinFromPlayer = (coins, coinId) => {
    coins.splice(coinId, 1, null);
};
//# sourceMappingURL=DiscardCoinHelpers.js.map