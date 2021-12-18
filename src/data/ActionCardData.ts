import { DrawProfitAction, UpgradeCoinAction } from "../actions/Actions";
import { IStack } from "../Player";
import { INumberValues } from "./SuitData";

/**
 * <h3>Интерфейс для значения, на которое обновляется монета.</h3>
 */
interface IActionCardValues {
    [index: number]: INumberValues,
}

/**
 * <h3>Интерфейс для конфига карт обновления монет.</h3>
 */
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
 */
const upgradeCoinUpTo3: IActionCardConfig = {
    value: 3,
    stack: [
        {
            action: DrawProfitAction,
            config: {
                name: "upgradeCoin",
                stageName: "upgradeCoin",
                value: 3,
                drawName: "Upgrade coin",
            },
        },
        {
            action: UpgradeCoinAction,
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
 */
const upgradeCoinUpTo5: IActionCardConfig = {
    value: 5,
    stack: [
        {
            action: DrawProfitAction,
            config: {
                name: "upgradeCoin",
                stageName: "upgradeCoin",
                value: 5,
                drawName: "Upgrade coin",
            },
        },
        {
            action: UpgradeCoinAction,
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
 */
export const actionCardsConfigArray: IActionCardConfig[] = [upgradeCoinUpTo3, upgradeCoinUpTo5];
