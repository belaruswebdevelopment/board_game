import {INumberValues} from "./SuitData";

export interface IInitialTradingCoinConfig {
    value: number,
    isTriggerTrading: boolean,
}

export interface IMarketCoinConfig {
    value: number,
    count: () => INumberValues,
}

/**
 * <h3>Конфиг базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет игрока в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {[{isTriggerTrading: boolean, value: number}, number, number, number, number]}
 */
export const initialPlayerCoinsConfig: [IInitialTradingCoinConfig, ...number[]] = [
    {value: 0, isTriggerTrading: true},
    2,
    3,
    4,
    5,
];

/**
 * <h3>Конфиг монет рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет рынка в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {[{count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]} Все монеты.
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
