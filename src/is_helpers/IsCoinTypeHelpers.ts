import { CoinRusNames } from "../typescript/enums";
import type { AllCoinsType, InitialCoinType, PublicPlayerCoinType, RoyalCoin, TriggerTradingCoinType } from "../typescript/interfaces";

/**
 * <h3>Проверка, является ли объект монетой.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param coin Пустой объект или монета.
 * @returns Является ли объект монетой.
 */
export const IsCoin =
    (coin: PublicPlayerCoinType): coin is AllCoinsType => coin !== null && (coin as AllCoinsType).value !== undefined;

/**
* <h3>Проверка, является ли объект базовой монетой.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функции улучшения монеты.</li>
* </ol>
*
* @param coin Пустой объект или монета.
* @returns Является ли объект базовой монетой.
*/
export const IsInitialCoin = (coin: PublicPlayerCoinType): coin is InitialCoinType => coin !== null
    && ((coin as InitialCoinType).type === CoinRusNames.InitialNotTriggerTrading
        || (coin as InitialCoinType).type === CoinRusNames.InitialTriggerTrading);

/**
* <h3>Проверка, является ли объект королевской монетой.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функции улучшения монеты.</li>
* </ol>
*
* @param coin Пустой объект или королевская монета.
* @returns Является ли объект королевской монетой.
*/
export const IsRoyalCoin = (coin: PublicPlayerCoinType): coin is RoyalCoin => coin !== null
    && (coin as RoyalCoin).type === CoinRusNames.Royal;

/**
* <h3>Проверка, является ли объект любой монетой, активирующей обмен монет.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функции улучшения монеты.</li>
* </ol>
*
* @param coin Пустой объект или монета.
* @returns Является ли объект любой монетой, активирующей обмен монет.
*/
export const IsTriggerTradingCoin = (coin: PublicPlayerCoinType): coin is TriggerTradingCoinType => coin !== null
    && ((coin as TriggerTradingCoinType).type === CoinRusNames.InitialTriggerTrading
        || (coin as TriggerTradingCoinType).type === CoinRusNames.SpecialTriggerTrading);
