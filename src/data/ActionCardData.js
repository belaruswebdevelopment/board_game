// todo rework switch to player to get distinction awarding
const upgradeCoinUpTo3 = {
    value: 3,
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

const upgradeCoinUpTo5 = {
    value: 5,
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

export const actionCardsConfigArray = [upgradeCoinUpTo3, upgradeCoinUpTo5];
