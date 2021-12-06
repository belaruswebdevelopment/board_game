export var isInitialPlayerCoinsConfigNotMarket = function (config) { return config.isTriggerTrading !== undefined; };
/**
 * <h3>Конфиг базовых монет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех базовых монет игрока в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {[{isTriggerTrading: boolean, value: number}, number, number, number, number]}
 */
export var initialPlayerCoinsConfig = [
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
 * @type {[{count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, {count: (function(): {"2": number, "3": number, "4": number, "5": number}), value: number}, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]} Все монеты.
 */
export var marketCoinsConfig = [
    {
        value: 5,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 6,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 7,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }); },
    },
    {
        value: 8,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 9,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }); },
    },
    {
        value: 10,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 11,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 3,
            5: 3,
        }); },
    },
    {
        value: 12,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 13,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 14,
        count: function () { return ({
            2: 2,
            3: 2,
            4: 2,
            5: 2,
        }); },
    },
    {
        value: 15,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 16,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 17,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 18,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 19,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 20,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 21,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 22,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 23,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 24,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
    {
        value: 25,
        count: function () { return ({
            2: 1,
            3: 1,
            4: 1,
            5: 1,
        }); },
    },
];
