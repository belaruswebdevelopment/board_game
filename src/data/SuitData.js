const TotalPoints = (accumulator, currentValue) => accumulator + currentValue.points;
const TotalRank = (accumulator, currentValue) => accumulator + currentValue.rank;
const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;

const blacksmithSuit = {
    suit: 0,
    suitName: 'Blacksmith',
    suitColor: 'bg-purple-600',
    description: "Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).",
    // todo replace 9th into 8th
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
                0: 10,
                1: 10,
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
};

const hunterSuit = {
    suit: 1,
    suitName: 'Hunter',
    suitColor: 'bg-green-600',
    description: "Их показатель храбрости равен квадрату числа карт охотников в армии игрока.",
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
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
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
                0: 8,
                1: 8,
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
};

const minerSuit = {
    suit: 2,
    suitName: 'Miner',
    suitColor: 'bg-yellow-600',
    description: "Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.",
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
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            3: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            4: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            5: {
                0: [0, 0, 0, 1, 1, 1, 2, 2],
                1: [0, 0, 0, 1, 1, 1, 2, 2],
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
};

const warriorSuit = {
    suit: 3,
    suitName: 'Warrior',
    suitColor: 'bg-red-600',
    description: "Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.",
    ranksValues: () => {
        return {
            2: {
                0: 8,
                1: 8,
            },
            3: {
                0: 8,
                1: 8,
            },
            4: {
                0: 8,
                1: 8,
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
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            3: {
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            4: {
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            5: {
                0: [3, 4, 5, 6, 6, 7, 8, 9, 10],
                1: [3, 4, 5, 6, 6, 7, 8, 9, 10],
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
};

const explorerSuit = {
    suit: 4,
    suitName: 'Explorer',
    suitColor: 'bg-blue-600',
    description: "Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.",
    ranksValues: () => {
        return {
            2: {
                0: 7,
                1: 7,
            },
            3: {
                0: 7,
                1: 7,
            },
            4: {
                0: 7,
                1: 7,
            },
            5: {
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            3: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            4: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            5: {
                0: [5, 6, 7, 8, 9, 10, 11, 12],
                1: [5, 6, 7, 8, 9, 10, 11, 12],
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
};

export const suitsConfigArray = [blacksmithSuit, hunterSuit, minerSuit, warriorSuit, explorerSuit];
