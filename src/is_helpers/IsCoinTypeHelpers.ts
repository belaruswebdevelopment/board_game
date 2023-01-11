import type { Coin, PublicPlayerCoinType } from "../typescript/interfaces";

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
    (coin: PublicPlayerCoinType): coin is Coin => coin !== null && (coin as Coin).value !== undefined;
