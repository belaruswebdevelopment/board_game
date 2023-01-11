import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
import type { BuildCoinsOptions, CanBeUndefType, Coin, CoinConfigArraysType, CoinConfigType, CreateCoinType, FnContext, NumberValues } from "./typescript/interfaces";

/**
 * <h3>Создание всех монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * <li>Вызывается при создании всех монет рынка.</li>
 * </ol>
 *
 * @param coinConfig Конфиг монет.
 * @param options Опции создания монет.
 * @returns Массив всех монет.
 */
export const BuildCoins = (coinConfig: CoinConfigArraysType, options: BuildCoinsOptions): Coin[] => {
    const coins: Coin[] = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const config: CanBeUndefType<CoinConfigType> = coinConfig[i];
        if (config === undefined) {
            throw new Error(`В массиве конфига монет отсутствует монета с id '${i}'.`);
        }
        const count: number = options.players !== undefined
            && !isInitialPlayerCoinsConfigNotMarket(config) ? config.count()[options.players] : 1;
        if (options.players !== undefined && options.count !== undefined) {
            options.count.push({
                value: config.value,
            });
        }
        for (let c = 0; c < count; c++) {
            coins.push(CreateCoin({
                isInitial: options.isInitial,
                isTriggerTrading: isInitialPlayerCoinsConfigNotMarket(config) ? config.isTriggerTrading : false,
                value: config.value,
            }));
        }
    }
    return coins;
};

/**
 * <h3>Изменяет статус, который открывает или закрывает монету.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при различных действиях с монетами.</li>
 * </ol>
 *
 * @param coin Монета.
 * @param status Статус, который показывает нужно ли открыть или закрыть монету.
 * @returns
 */
export const ChangeIsOpenedCoinStatus = (coin: Coin, status: boolean): void => {
    if (coin.isOpened === status) {
        throw new Error(`Монета уже ${status ? `открыта` : `закрыта`}.`);
    }
    coin.isOpened = status;
};

/**
 * <h3>Вычисляет количество монет каждого номинала на рынке монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при отображении рынка монет.</li>
 * </ol>
 *
 * @param context
 * @returns Количество всех монет на рынке (с повторами).
 */
export const CountMarketCoins = ({ G }: FnContext): NumberValues => {
    const repeated: NumberValues = {};
    for (let i = 0; i < G.marketCoinsUnique.length; i++) {
        const marketCoin: CanBeUndefType<Coin> = G.marketCoinsUnique[i];
        if (marketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
        }
        const temp: number = marketCoin.value;
        repeated[temp] = G.marketCoins.filter((coin: Coin): boolean => coin.value === temp).length;
    }
    return repeated;
};

/**
 * <h3>Создание монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет при инициализации игры.</li>
 * <li>Вызывается при создании монеты преимущества по охотникам.</li>
 * </ol>
 *.
 * @param isInitial Является ли базовой.
 * @param isOpened Является ли монета открытой.
 * @param isTriggerTrading Активирует ли обмен монет.
 * @param value Значение.
 * @returns Монета.
 */
export const CreateCoin = ({
    isInitial = false,
    isOpened = false,
    isTriggerTrading = false,
    value,
}: CreateCoinType): Coin => ({
    isInitial,
    isOpened,
    isTriggerTrading,
    value,
});
