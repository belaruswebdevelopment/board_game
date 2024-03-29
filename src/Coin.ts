import { initialCoinsConfig, royalCoinsConfig } from "./data/CoinData";
import { AssertAllInitialTradingCoinConfigIndex, AssertAllRoyalCoinConfigIndex, AssertInitialCoins, AssertMarketCoinNumberValues, AssertRoyalCoinsUniqueArrayIndex } from "./is_helpers/AssertionTypeHelpers";
import { CoinRusNames } from "./typescript/enums";
import type { AllCoinsType, AllInitialCoins, BuildRoyalCoinsOptions, CoinConfigType, CoinNumberValues, CreateInitialNotTradingCoinFromData, CreateInitialTradingCoinFromData, CreateRoyalCoinFromData, CreateSpecialTriggerTradingCoinFromData, FnContext, InitialCoinType, InitialNotTriggerTradingCoin, InitialTradingCoinConfigType, InitialTriggerTradingCoin, MarketCoinNumberValuesType, MarketCoinsAmountType, RoyalCoin, RoyalCoinValueType, SpecialTriggerTradingCoin } from "./typescript/interfaces";

/**
 * <h3>Создание всех базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * </ol>
 *
 * @returns Массив всех базовых монет.
 */
export const BuildInitialCoins = (): AllInitialCoins => {
    const initialCoins: InitialCoinType[] = [];
    for (let i = 0; i < initialCoinsConfig.length; i++) {
        AssertAllInitialTradingCoinConfigIndex(i);
        const config: InitialTradingCoinConfigType = initialCoinsConfig[i];
        for (let c = 0; c < 1; c++) {
            if (config.value === 0) {
                initialCoins.push(CreateInitialTradingCoin({
                    value: config.value,
                }));
            } else {
                initialCoins.push(CreateInitialNotTradingCoin({
                    value: config.value,
                }));
            }
        }
    }
    AssertInitialCoins(initialCoins);
    return initialCoins;
};

/**
 * <h3>Создание всех королевских монет рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех королевских монет рынка.</li>
 * </ol>
 *
 * @param options Опции создания монет.
 * @returns Массив всех монет.
 */
export const BuildRoyalCoins = (options: BuildRoyalCoinsOptions): RoyalCoin[] => {
    const royalCoins: RoyalCoin[] = [];
    for (let i = 0; i < royalCoinsConfig.length; i++) {
        AssertAllRoyalCoinConfigIndex(i);
        const config: CoinConfigType = royalCoinsConfig[i],
            count: MarketCoinsAmountType = config.count()[options.players],
            royalCoin: RoyalCoin = CreateRoyalCoin({
                value: config.value,
            });
        options.count.push(royalCoin);
        for (let j = 0; j < count; j++) {
            royalCoins.push(royalCoin);
        }
    }
    return royalCoins;
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
export const ChangeIsOpenedCoinStatus = (coin: AllCoinsType, status: boolean): void => {
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
export const CountRoyalCoins = ({ G }: FnContext): CoinNumberValues<MarketCoinNumberValuesType> => {
    const repeated: CoinNumberValues<MarketCoinNumberValuesType> = {};
    for (let i = 0; i < G.royalCoinsUnique.length; i++) {
        AssertRoyalCoinsUniqueArrayIndex(i);
        const royalCoin: RoyalCoin = G.royalCoinsUnique[i],
            temp: RoyalCoinValueType = royalCoin.value,
            royalCoinsCount: number =
                G.royalCoins.filter((coin: RoyalCoin): boolean => coin.value === temp).length;
        AssertMarketCoinNumberValues(royalCoinsCount);
        repeated[temp] = royalCoinsCount;
    }
    return repeated;
};

/**
 * <h3>Создание базовой монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет при инициализации игры.</li>
 * </ol>
 *.
 * @param isOpened Является ли монета открытой.
 * @param type Тип.
 * @param value Значение.
 * @returns Базовая монета.
 */
const CreateInitialNotTradingCoin = ({
    isOpened = false,
    type = CoinRusNames.InitialNotTriggerTrading,
    value,
}: CreateInitialNotTradingCoinFromData): InitialNotTriggerTradingCoin => ({
    isOpened,
    type,
    value,
});

/**
 * <h3>Создание базовой монеты, активирующей обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет,активирующих обмен монет, при инициализации игры.</li>
 * </ol>
 *.
 * @param isOpened Является ли монета открытой.
 * @param type Тип.
 * @param value Значение.
 * @returns Базовая монета, активирующая обмен монет.
 */
const CreateInitialTradingCoin = ({
    isOpened = false,
    type = CoinRusNames.InitialTriggerTrading,
    value,
}: CreateInitialTradingCoinFromData): InitialTriggerTradingCoin => ({
    isOpened,
    type,
    value,
});

/**
 * <h3>Создание королевской монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех королевских монет при инициализации игры.</li>
 * </ol>
 *.
 * @param isOpened Является ли монета открытой.
 * @param type Тип.
 * @param value Значение.
 * @returns Королевская монета.
 */
const CreateRoyalCoin = ({
    isOpened = false,
    type = CoinRusNames.Royal,
    value,
}: CreateRoyalCoinFromData): RoyalCoin => ({
    isOpened,
    type,
    value,
});

/**
 * <h3>Создание особой монеты, активирующей обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании особых монет,активирующих обмен монет.</li>
 * </ol>
 *.
 * @param isOpened Является ли монета открытой.
 * @param type Тип.
 * @param value Значение.
 * @returns Особая монета, активирующая обмен монет.
 */
export const CreateSpecialTriggerTradingCoin = ({
    isOpened = false,
    type = CoinRusNames.SpecialTriggerTrading,
    value,
}: CreateSpecialTriggerTradingCoinFromData): SpecialTriggerTradingCoin => ({
    isOpened,
    type,
    value,
});
