import { RoyalOfferingNames } from "../typescript/enums";
import type { IRoyalOfferingCardConfig, IRoyalOfferingCardValues } from "../typescript/interfaces";
import { StackData } from "./StackData";

/**
 * <h3>Карта улучшения монеты на +3.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 */
const upgradeCoinUpTo3: IRoyalOfferingCardConfig = {
    name: RoyalOfferingNames.PlusThree,
    value: 3,
    stack: [StackData.upgradeCoin(3)],
    amount: (): IRoyalOfferingCardValues => ({
        1: {
            0: 1,
            1: 0,
        },
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
const upgradeCoinUpTo5: IRoyalOfferingCardConfig = {
    name: RoyalOfferingNames.PlusFive,
    value: 5,
    stack: [StackData.upgradeCoin(5)],
    amount: (): IRoyalOfferingCardValues => ({
        1: {
            0: 0,
            1: 2,
        },
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
export const actionCardsConfigArray: IRoyalOfferingCardConfig[] = [upgradeCoinUpTo3, upgradeCoinUpTo5];
