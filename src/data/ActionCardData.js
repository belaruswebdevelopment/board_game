/**
 *  Карта улучшения монеты на 3.
 * Применения:
 * 1) Используется в конфиге карт улучшения монет.
 *
 * @type {{amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), action: {config: {value: number}, actionName: string}, value: number}} Карта улучшения монеты.
 */
const upgradeCoinUpTo3 = {
    value: 3,
    action: {
        actionName: "UpgradeCoinAction",
        config: {
            number: 1,
            value: 3,
        },
    },
    amount: () => {
        return {
            2: {
                0: 1,
                1: 0,
            },
            3: {
                0: 1,
                1: 0,
            },
            4: {
                0: 1,
                1: 0,
            },
            5: {
                0: 2,
                1: 0,
            },
        };
    },
};

/**
 * Карта улучшения монеты на 5.
 * Применения:
 * 1) Используется в конфиге карт улучшения монет.
 *
 * @type {{amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), action: {config: {value: number}, actionName: string}, value: number}} Карта улучшения монеты.
 */
const upgradeCoinUpTo5 = {
    value: 5,
    action: {
        actionName: "UpgradeCoinAction",
        config: {
            number: 1,
            value: 5,
        },
    },
    amount: () => {
        return {
            2: {
                0: 0,
                1: 2,
            },
            3: {
                0: 0,
                1: 2,
            },
            4: {
                0: 0,
                1: 2,
            },
            5: {
                0: 0,
                1: 3,
            },
        };
    },
};

/**
 * Конфиг карт улучшения монет.
 * Применения:
 * 1) Происходит при создании всех карт улучшения монет при инициализации игры.
 *
 * @type {({amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), action: {config: {value: number}, actionName: string}, value: number}|{amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), action: {config: {value: number}, actionName: string}, value: number})[]} Массив карт улучшения монеты.
 */
export const actionCardsConfigArray = [upgradeCoinUpTo3, upgradeCoinUpTo5];
