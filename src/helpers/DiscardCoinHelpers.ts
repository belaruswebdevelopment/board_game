import { ThrowMyError } from "../Error";
import { ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, FnContext, MyFnContextWithMyPlayerID, PlayerCoinIdType, PublicPlayer, PublicPlayerCoinsType, PublicPlayerCoinType, RoyalCoin } from "../typescript/interfaces";

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
export const RemoveCoinFromMarket = ({ G }: FnContext, coinId: number): RoyalCoin => {
    const coin: CanBeUndefType<RoyalCoin> = G.royalCoins.splice(coinId, 1)[0];
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
 * @param isMultiplayer Является ли мультиплеером.
 * @returns Убираемая монета у игрока.
 */
export const RemoveCoinFromPlayer = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    coins: PublicPlayerCoinsType, coinId: PlayerCoinIdType, isMultiplayer = false): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const removedCoin: CanBeUndefType<PublicPlayerCoinType> =
        coins.splice(coinId, 1, null)[0];
    if (removedCoin === undefined) {
        throw new Error(`В массиве монет игрока не может отсутствовать монета для сброса с id '${coinId}'.`);
    }
    if (removedCoin === null) {
        throw new Error(`В массиве монет игрока не может не быть монеты для сброса с id '${coinId}'.`);
    }
    if (`value` in removedCoin) {
        if (!(isMultiplayer && removedCoin.isOpened)) {
            player.currentCoinsScore -= removedCoin.value;
        }
    }
};
