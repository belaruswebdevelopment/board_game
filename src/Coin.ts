import { initialCoinsConfig, royalCoinsConfig } from "./data/CoinData";
import { CoinRusNames } from "./typescript/enums";
import type { AllCoinsType, BuildRoyalCoinsOptions, CanBeUndefType, CoinConfigType, CreateInitialNotTradingCoinFromData, CreateInitialTradingCoinFromData, CreateRoyalCoinFromData, CreateSpecialTriggerTradingCoinFromData, FnContext, InitialCoinType, InitialNotTriggerTradingCoin, InitialTradingCoinConfigType, InitialTriggerTradingCoin, NumberValues, RoyalCoin, RoyalCoinValueType, SpecialTriggerTradingCoin } from "./typescript/interfaces";

/**
 * <h3>Создание всех базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * </ol>
 *
 * @returns Массив всех базовых монет.
 */
export const BuildInitialCoins = (): InitialCoinType[] => {
    const coins: InitialCoinType[] = [];
    for (let i = 0; i < initialCoinsConfig.length; i++) {
        const config: CanBeUndefType<InitialTradingCoinConfigType> = initialCoinsConfig[i];
        if (config === undefined) {
            throw new Error(`В массиве конфига монет отсутствует монета с id '${i}'.`);
        }
        for (let c = 0; c < 1; c++) {
            if (config.value === 0) {
                coins.push(CreateInitialTradingCoin({
                    value: config.value,
                }));
            } else {
                coins.push(CreateInitialNotTradingCoin({
                    value: config.value,
                }));
            }
        }
    }
    return coins;
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
        const config: CanBeUndefType<CoinConfigType> = royalCoinsConfig[i];
        if (config === undefined) {
            throw new Error(`В массиве конфига монет отсутствует монета с id '${i}'.`);
        }
        const count: number = config.count()[options.players];
        if (options.players !== undefined && options.count !== undefined) {
            options.count.push({
                value: config.value,
            });
        }
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
export const CountRoyalCoins = ({ G }: FnContext): NumberValues => {
    const repeated: NumberValues = {};
    for (let i = 0; i < G.royalCoinsUnique.length; i++) {
        const royalCoin: CanBeUndefType<RoyalCoin> = G.royalCoinsUnique[i];
        if (royalCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
        }
        const temp: RoyalCoinValueType = royalCoin.value;
        repeated[temp] = G.royalCoins.filter((coin: RoyalCoin): boolean => coin.value === temp).length;
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
