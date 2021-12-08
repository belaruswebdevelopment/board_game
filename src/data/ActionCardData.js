/**
 * <h3>Карта улучшения монеты на +3.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 *
 * @type {{stack: ({config: {stageName: string, name: string, drawName: string, value: number}, actionName: string} | {config: {value: number}, actionName: string})[], amount: () => IActionCardValues, value: number}}
 */
var upgradeCoinUpTo3 = {
    value: 3,
    stack: [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "upgradeCoin",
                stageName: "upgradeCoin",
                value: 3,
                drawName: "Upgrade coin",
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 3,
            },
        },
    ],
    amount: function () { return ({
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
    }); },
};
/**
 * <h3>Карта улучшения монеты на +5.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 *
 * @type {{stack: ({config: {stageName: string, name: string, drawName: string, value: number}, actionName: string} | {config: {value: number}, actionName: string})[], amount: () => IActionCardValues, value: number}}
 */
var upgradeCoinUpTo5 = {
    value: 5,
    stack: [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "upgradeCoin",
                stageName: "upgradeCoin",
                value: 5,
                drawName: "Upgrade coin",
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 5,
            },
        },
    ],
    amount: function () { return ({
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
    }); },
};
/**
 * <h3>Конфиг карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт улучшения монет в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {IActionCardConfig[]}
 */
export var actionCardsConfigArray = [upgradeCoinUpTo3, upgradeCoinUpTo5];
