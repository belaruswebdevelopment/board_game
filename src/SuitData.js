const TotalPoints = (accumulator, currentValue) => accumulator + currentValue.points;
const TotalRank = (accumulator, currentValue) => accumulator + currentValue.rank;
const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;

/*
    * 0 - фиолетовые арифметическая
    * 1 - зелёный квадраты
    * 2 - жёлтый горняки
    * 3 - красные воины
    * 4 - голубые разведы
    */
const blacksmithSuit = {
    suit: 0,
    suitName: 'Blacksmith',
    suitColor: 'Violet',
    description: "",
    ranksValues: () => {
        return {
            2: {
                0: 10,
                1: 10,
            },
            3: {
                0: 10,
                1: 10,
            },
            4: {
                0: 10,
                1: 10,
            },
            5: {
                0: 10,
                1: 10,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: 10,
                1: 10,
            },
            3: {
                0: 10,
                1: 10,
            },
            4: {
                0: 10,
                1: 10,
            },
            5: {
                0: 10,
                1: 10,
            },
        };
    },
    scoringRule: (cards) => {
        return ArithmeticSum(3, 1, cards.reduce(TotalRank, 0));
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}
const hunterSuit = {
    suit: 1,
    suitName: 'Hunter',
    suitColor: 'MediumSeaGreen',
    description: "",
    ranksValues: () => {
        return {
            2: {
                0: 9,
                1: 9,
            },
            3: {
                0: 9,
                1: 9,
            },
            4: {
                0: 9,
                1: 9,
            },
            5: {
                0: 9,
                1: 9,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: 9,
                1: 9,
            },
            3: {
                0: 9,
                1: 9,
            },
            4: {
                0: 9,
                1: 9,
            },
            5: {
                0: 9,
                1: 9,
            },
        };
    },
    scoringRule: (cards) => {
        return cards.reduce(TotalRank, 0) ** 2;
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}
const minerSuit = {
    suit: 2,
    suitName: 'Miner',
    suitColor: 'Khaki',
    description: "",
    ranksValues: () => {
        return {
            2: {
               0: 6,
               1: 6,
            },
            3: {
                0: 6,
                1: 6,
            },
            4: {
                0: 6,
                1: 6,
            },
            5: {
                0: 6,
                1: 6,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [1, 1, 1, 1, 2, 2],
                1: [1, 1, 1, 1, 2, 2],
            },
            3: {
                0: [1, 1, 1, 1, 2, 2],
                1: [1, 1, 1, 1, 2, 2],
            },
            4: {
                0: [1, 1, 1, 1, 2, 2],
                1: [1, 1, 1, 1, 2, 2],
            },
            5: {
                0: [1, 1, 1, 1, 2, 2],
                1: [1, 1, 1, 1, 2, 2],
            },
        };
    },
    scoringRule: (cards) => {
        return cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0);
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}
const warriorSuit = {
    suit: 3,
    suitName: 'Warrior',
    suitColor: 'Tomato',
    description: "",
    ranksValues: () => {
        return {
            2: {
                0: 6,
                1: 6,
            },
            3: {
                0: 6,
                1: 6,
            },
            4: {
                0: 6,
                1: 6,
            },
            5: {
                0: 6,
                1: 6,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [2, 2, 3, 4, 5, 5],
                1: [2, 2, 3, 4, 5, 5],
            },
            3: {
                0: [2, 2, 3, 4, 5, 5],
                1: [2, 2, 3, 4, 5, 5],
            },
            4: {
                0: [2, 2, 3, 4, 5, 5],
                1: [2, 2, 3, 4, 5, 5],
            },
            5: {
                0: [2, 2, 3, 4, 5, 5],
                1: [2, 2, 3, 4, 5, 5],
            },
        };
    },
    scoringRule: (cards) => {
        return cards.reduce(TotalPoints, 0);
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}
const explorerSuit = {
    suit: 4,
    suitName: 'Explorer',
    suitColor: 'DodgerBlue',
    description: "",
    ranksValues: () => {
        return {
            2: {
                0: 5,
                1: 5,
            },
            3: {
                0: 5,
                1: 5,
            },
            4: {
                0: 5,
                1: 5,
            },
            5: {
                0: 5,
                1: 5,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [4, 5, 6, 6, 7],
                1: [4, 5, 6, 6, 7],
            },
            3: {
                0: [4, 5, 6, 6, 7],
                1: [4, 5, 6, 6, 7],
            },
            4: {
                0: [4, 5, 6, 6, 7],
                1: [4, 5, 6, 6, 7],
            },
            5: {
                0: [4, 5, 6, 6, 7],
                1: [4, 5, 6, 6, 7],
            },
        };
    },
    scoringRule: (cards) => {
        return cards.reduce(TotalPoints, 0);
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}

export const suitsConfigArray = [blacksmithSuit, hunterSuit, minerSuit, warriorSuit, explorerSuit];
