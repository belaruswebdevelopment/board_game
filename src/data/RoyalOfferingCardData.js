import { RoyalOfferingNames } from "../typescript/enums";
import { StackData } from "./StackData";
/**
 * <h3>Карта улучшения монеты на +3.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге карт улучшения монет.</li>
 * </ol>
 */
const upgradeCoinUpTo3 = {
    name: RoyalOfferingNames.PlusThree,
    value: 3,
    stack: {
        player: [StackData.upgradeCoin(3)],
        soloBot: [StackData.upgradeCoinSoloBot(3)],
        soloBotAndvari: [StackData.upgradeCoinSoloBotAndvari(3)],
    },
    amount: () => ({
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
const upgradeCoinUpTo5 = {
    name: RoyalOfferingNames.PlusFive,
    value: 5,
    stack: {
        player: [StackData.upgradeCoin(5)],
        soloBot: [StackData.upgradeCoinSoloBot(5)],
        soloBotAndvari: [StackData.upgradeCoinSoloBotAndvari(5)],
    },
    amount: () => ({
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
export const actionCardsConfigArray = [upgradeCoinUpTo3, upgradeCoinUpTo5];
//# sourceMappingURL=RoyalOfferingCardData.js.map