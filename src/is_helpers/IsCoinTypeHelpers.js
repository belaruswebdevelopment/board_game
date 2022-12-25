/**
 * <h3>Проверка, является ли объект монетой или пустым объектом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param coin Пустой объект или монета.
 * @returns Является ли объект монетой, а не пустым объектом.
 */
export const IsCoin = (coin) => coin !== null && coin.value !== undefined;
//# sourceMappingURL=IsCoinTypeHelpers.js.map