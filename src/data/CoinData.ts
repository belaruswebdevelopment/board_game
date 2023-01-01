import type { CoinConfigType, IMarketCoinConfig, InitialTradingCoinConfigType, NumberPlayersValues } from "../typescript/interfaces";

/**
 * <h3>Проверка, является ли объект конфигом базовых монет или конфигом монет рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param config Конфиг.
 * @returns Является ли объект конфигом базовых монет или конфигом монет рынка.
 */
export const isInitialPlayerCoinsConfigNotMarket = (config: CoinConfigType): config is InitialTradingCoinConfigType =>
    (config as InitialTradingCoinConfigType).isTriggerTrading !== undefined;

/**
 * <h3>Конфиг базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет игрока в ходе инициализации игры.</li>
 * </ol>
 */
export const initialPlayerCoinsConfig: InitialTradingCoinConfigType[] = [
    {
        value: 0,
        isTriggerTrading: true,
    },
    {
        value: 2,
        isTriggerTrading: false,
    },
    {
        value: 3,
        isTriggerTrading: false,
    },
    {
        value: 4,
        isTriggerTrading: false,
    },
    {
        value: 5,
        isTriggerTrading: false,
    },
];

/**
 * <h3>Конфиг монет рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет рынка в ходе инициализации игры.</li>
 * </ol>
 */
export const marketCoinsConfig: IMarketCoinConfig[] = [
    {
        value: 5,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 6,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 7,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 8,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 9,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 10,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 11,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 12,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 13,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 14,
        count: (): NumberPlayersValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 15,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 16,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 17,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 18,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 19,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 20,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 21,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 22,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 23,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 24,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 25,
        count: (): NumberPlayersValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
];
