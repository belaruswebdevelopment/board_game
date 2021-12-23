import { DrawNames } from "../actions/Actions";
import { DrawProfitCoinAction, UpgradeCoinActionCardAction } from "../actions/CoinActions";
import { Stages } from "../Game";
/**
 * <h3>Карта улучшения монеты на +3.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 */
const upgradeCoinUpTo3 = {
    value: 3,
    stack: [
        {
            action: DrawProfitCoinAction.name,
            config: {
                name: `upgradeCoin`,
                stageName: Stages.UpgradeCoin,
                value: 3,
                drawName: DrawNames.UpgradeCoin,
            },
        },
        {
            action: UpgradeCoinActionCardAction.name,
            config: {
                value: 3,
            },
        },
    ],
    amount: () => ({
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
const upgradeCoinUpTo5 = {
    value: 5,
    stack: [
        {
            action: DrawProfitCoinAction.name,
            config: {
                name: `upgradeCoin`,
                stageName: Stages.UpgradeCoin,
                value: 5,
                drawName: DrawNames.UpgradeCoin,
            },
        },
        {
            action: UpgradeCoinActionCardAction.name,
            config: {
                value: 5,
            },
        },
    ],
    amount: () => ({
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
export const actionCardsConfigArray = [upgradeCoinUpTo3, upgradeCoinUpTo5];
