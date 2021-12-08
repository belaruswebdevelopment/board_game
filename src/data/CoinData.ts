import {INumberValues} from "./SuitData";

/**
 * <h3>Интерфейс для конфига базовых монет.</h3>
 */
export interface IInitialTradingCoinConfig {
    value: number,
    isTriggerTrading: boolean,
}

/**
 * <h3>Интерфейс для конфига монет рынка.</h3>
 */
export interface IMarketCoinConfig {
    value: number,
    count: () => INumberValues,
}

/**
 * <h3>Проверка, является ли объект конфигом базовых монет или конфигом монет рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param {IInitialTradingCoinConfig | IMarketCoinConfig} config Конфиг.
 * @returns {config is IInitialTradingCoinConfig} Является ли объект конфигом базовых монет или конфигом монет рынка.
 */
export const isInitialPlayerCoinsConfigNotMarket = (config: IInitialTradingCoinConfig | IMarketCoinConfig):
    config is IInitialTradingCoinConfig => (config as IInitialTradingCoinConfig).isTriggerTrading !== undefined;

/**
 * <h3>Конфиг базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет игрока в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {({isTriggerTrading: boolean, value: number} | {isTriggerTrading: boolean, value: number} | {isTriggerTrading: boolean, value: number} | {isTriggerTrading: boolean, value: number} | {isTriggerTrading: boolean, value: number})[]}
 */
export const initialPlayerCoinsConfig: IInitialTradingCoinConfig[] = [
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
 *
 * @type {({count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number} | {count: () => INumberValues, value: number})[]}
 */
export const marketCoinsConfig: IMarketCoinConfig[] = [
    {
        value: 5,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 6,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 7,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 8,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 9,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 10,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 11,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }),
    },
    {
        value: 12,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 13,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 14,
        count: (): INumberValues => ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }),
    },
    {
        value: 15,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 16,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 17,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 18,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 19,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 20,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 21,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 22,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 23,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 24,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
    {
        value: 25,
        count: (): INumberValues => ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }),
    },
];
