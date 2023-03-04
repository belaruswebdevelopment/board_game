import { initialCoinsConfig, royalCoinsConfig } from "./data/CoinData";
import { AssertAllInitialTradingCoinConfigIndex, AssertAllRoyalCoinConfigIndex, AssertInitialCoins, AssertMarketCoinNumberValues } from "./is_helpers/AssertionTypeHelpers";
import { CoinRusNames } from "./typescript/enums";
import type { AllCoinsType, AllInitialCoins, BuildRoyalCoinsOptions, CanBeUndefType, CoinConfigType, CoinNumberValues, CreateInitialNotTradingCoinFromData, CreateInitialTradingCoinFromData, CreateRoyalCoinFromData, CreateSpecialTriggerTradingCoinFromData, FnContext, InitialCoinType, InitialNotTriggerTradingCoin, InitialTradingCoinConfigType, InitialTriggerTradingCoin, MarketCoinNumberValuesType, MarketCoinsAmountType, RoyalCoin, RoyalCoinValueType, SpecialTriggerTradingCoin } from "./typescript/interfaces";

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
    const coins: RoyalCoin[] = [];
    for (let i = 0; i < royalCoinsConfig.length; i++) {
        AssertAllRoyalCoinConfigIndex(i);
        const config: CoinConfigType = royalCoinsConfig[i],
            count: MarketCoinsAmountType = config.count()[options.players];
        options.count.push({
            value: config.value,
        });
        for (let j = 0; j < count; j++) {
            coins.push(CreateRoyalCoin({
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
        const royalCoin: CanBeUndefType<RoyalCoin> = G.royalCoinsUnique[i];
        if (royalCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
        }
        const temp: RoyalCoinValueType = royalCoin.value,
            royalCoinsCount = G.royalCoins.filter((coin: RoyalCoin): boolean => coin.value === temp).length;
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
 * @param type Тип.
 * @param isOpened Является ли монета открытой.
 * @param value Значение.
 * @returns Базовая монета.
 */
export const CreateInitialNotTradingCoin = ({
    type = CoinRusNames.InitialNotTriggerTrading,
    isOpened = false,
    value,
}: CreateInitialNotTradingCoinFromData): InitialNotTriggerTradingCoin => ({
    type,
    isOpened,
    value,
});

/**
 * <h3>Создание базовой монеты, активирующей обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет,активирующих обмен монет, при инициализации игры.</li>
 * </ol>
 *.
 * @param type Тип.
 * @param isOpened Является ли монета открытой.
 * @param value Значение.
 * @returns Базовая монета, активирующая обмен монет.
 */
export const CreateInitialTradingCoin = ({
    type = CoinRusNames.InitialTriggerTrading,
    isOpened = false,
    value,
}: CreateInitialTradingCoinFromData): InitialTriggerTradingCoin => ({
    type,
    isOpened,
    value,
});

/**
 * <h3>Создание королевской монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех королевских монет при инициализации игры.</li>
 * </ol>
 *.
 * @param type Тип.
 * @param isOpened Является ли монета открытой.
 * @param value Значение.
 * @returns Королевская монета.
 */
export const CreateRoyalCoin = ({
    type = CoinRusNames.Royal,
    isOpened = false,
    value,
}: CreateRoyalCoinFromData): RoyalCoin => ({
    type,
    isOpened,
    value,
});

/**
 * <h3>Создание особой монеты, активирующей обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании особых монет,активирующих обмен монет.</li>
 * </ol>
 *.
 * @param type Тип.
 * @param isOpened Является ли монета открытой.
 * @param value Значение.
 * @returns Особая монета, активирующая обмен монет.
 */
export const CreateSpecialTriggerTradingCoin = ({
    type = CoinRusNames.SpecialTriggerTrading,
    isOpened = false,
    value,
}: CreateSpecialTriggerTradingCoinFromData): SpecialTriggerTradingCoin => ({
    type,
    isOpened,
    value,
});
