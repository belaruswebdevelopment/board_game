import {IStack} from "../Player";
import {INumberValues} from "./SuitData";

interface IActionCardValues {
    [index: number]: INumberValues,
}

export interface IActionCardConfig {
    value: number,
    stack: IStack[],
    amount: () => IActionCardValues,
}

/**
 * <h3>Карта улучшения монеты на +3.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 *
 * @type {{stack: [{config: {stageName: string, name: string, value: number}, actionName: string}, {config: {value: number}, actionName: string}], amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), value: number}} Карта улучшения монеты.
 */
const upgradeCoinUpTo3: IActionCardConfig = {
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
    amount: (): IActionCardValues => ({
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
    }),
};

/**
 * <h3>Карта улучшения монеты на +5.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 *
 * @type {{stack: [{config: {stageName: string, name: string, value: number}, actionName: string}, {config: {value: number}, actionName: string}], amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), value: number}} Карта улучшения монеты.
 */
const upgradeCoinUpTo5: IActionCardConfig = {
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
    amount: (): IActionCardValues => ({
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
    }),
};

/**
 * <h3>Конфиг карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт улучшения монет в ходе инициализации игры.</li>
 * </ol>
 *
 * @type {{stack: ({config: {stageName: string, name: string, value: number}, actionName: string}|{config: {value: number}, actionName: string})[], amount: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), value: number}[]} Массив карт улучшения монеты.
 */
export const actionCardsConfigArray: IActionCardConfig[] = [upgradeCoinUpTo3, upgradeCoinUpTo5];
