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
    ranksValues: (config) => {
        return 10;
    },
    pointsValues: (config) => {
        return 10;
    },
    scoringRule: (cards) => {
        const arithmetic = [0, 5, 10, 15, 21, 27, 35, 44, 54, 65, 77];
        let count = 0;
        for (let i = 0; i < cards.length; i++) {
            count += cards[i].rank;
        }
        return arithmetic[count];
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
    ranksValues: (config) => {
        return 9;
    },
    pointsValues: (config) => {
        return 9;
    },
    scoringRule: (cards) => {
        let count = 0;
        for (let i = 0; i < cards.length; i++) {
            count += cards[i].rank;
        }
        return count ** 2;
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
    ranksValues: (config) => {
        return 6;
    },
    pointsValues: (config) => {
        return [1, 1, 1, 1, 2, 2];
    },
    scoringRule: (cards) => {
        let points = 0;
        let count = 0;
        for (let i = 0; i < cards.length; i++) {
            points += cards[i].points;
            count += cards[i].rank;
        }
        return count * points;
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
    ranksValues: (config) => {
        return 6;
    },
    pointsValues: (config) => {
        return [2, 2, 3, 4, 5, 5];
    },
    scoringRule: (cards) => {
        let score = 0;
        for (let i = 0; i < cards.length; i++) {
            score += cards[i].points;
        }
        return score;
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
    ranksValues: (config) => {
        return 5;
    },
    pointsValues: (config) => {
        return [4, 5, 6, 6, 7];
    },
    scoringRule: (cards) => {
        let score = 0;
        for (let i = 0; i < cards.length; i++) {
            score += cards[i].points;
        }
        return score;
    },
    distinction: {
        description: "",
        awarding: () => {

        },
    },
}

export const suitsConfigArray = [blacksmithSuit, hunterSuit, minerSuit, warriorSuit, explorerSuit];