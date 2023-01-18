import { CoinRusNames } from "../typescript/enums";
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
export const IsCoin = (coin) => coin !== null && coin.value !== undefined;
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
export const IsInitialCoin = (coin) => coin !== null
    && (coin.type === CoinRusNames.InitialNotTriggerTrading
        || coin.type === CoinRusNames.InitialTriggerTrading);
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
export const IsRoyalCoin = (coin) => coin !== null
    && coin.type === CoinRusNames.Royal;
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
export const IsTriggerTradingCoin = (coin) => coin !== null
    && (coin.type === CoinRusNames.InitialTriggerTrading
        || coin.type === CoinRusNames.SpecialTriggerTrading);
//# sourceMappingURL=IsCoinTypeHelpers.js.map