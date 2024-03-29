import { DistinctionAwardingFunctionNames, DistinctionDescriptionNames, SuitCssBGColorClassNames, SuitDescriptionNames, SuitNames, SuitRusNames, SuitScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 * @TODO Add may be potential points for hunters and blacksmiths.
 */
const blacksmith = {
    suit: SuitNames.blacksmith,
    suitName: SuitRusNames.blacksmith,
    suitColor: SuitCssBGColorClassNames.Blacksmith,
    description: SuitDescriptionNames.Blacksmith,
    pointsValues: () => ({
        1: {
            0: 8,
            1: 8,
        },
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
            0: 10,
            1: 10,
        },
    }),
    scoringRule: {
        name: SuitScoringFunctionNames.BlacksmithScoring,
    },
    distinction: {
        description: DistinctionDescriptionNames.Blacksmith,
        awarding: {
            name: DistinctionAwardingFunctionNames.BlacksmithDistinctionAwarding,
        },
    },
};
/**
 * <h3>Фракция разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const explorer = {
    suit: SuitNames.explorer,
    suitName: SuitRusNames.explorer,
    suitColor: SuitCssBGColorClassNames.Explorer,
    description: SuitDescriptionNames.Explorer,
    pointsValues: () => ({
        1: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11],
        },
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
    }),
    scoringRule: {
        name: SuitScoringFunctionNames.ExplorerScoring,
    },
    distinction: {
        description: DistinctionDescriptionNames.Explorer,
        awarding: {
            name: DistinctionAwardingFunctionNames.ExplorerDistinctionAwarding,
        },
    },
};
/**
 * <h3>Фракция охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const hunter = {
    suit: SuitNames.hunter,
    suitName: SuitRusNames.hunter,
    suitColor: SuitCssBGColorClassNames.Hunter,
    description: SuitDescriptionNames.Hunter,
    pointsValues: () => ({
        1: {
            0: 6,
            1: 6,
        },
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
    }),
    scoringRule: {
        name: SuitScoringFunctionNames.HunterScoring,
    },
    distinction: {
        description: DistinctionDescriptionNames.Hunter,
        awarding: {
            name: DistinctionAwardingFunctionNames.HunterDistinctionAwarding,
        },
    },
};
/**
 * <h3>Фракция горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const miner = {
    suit: SuitNames.miner,
    suitName: SuitRusNames.miner,
    suitColor: SuitCssBGColorClassNames.Miner,
    description: SuitDescriptionNames.Miner,
    pointsValues: () => ({
        1: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2],
        },
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
    }),
    scoringRule: {
        name: SuitScoringFunctionNames.MinerScoring,
    },
    distinction: {
        description: DistinctionDescriptionNames.Miner,
        awarding: {
            name: DistinctionAwardingFunctionNames.MinerDistinctionAwarding,
        },
    },
};
/**
 * <h3>Фракция воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const warrior = {
    suit: SuitNames.warrior,
    suitName: SuitRusNames.warrior,
    suitColor: SuitCssBGColorClassNames.Warrior,
    description: SuitDescriptionNames.Warrior,
    pointsValues: () => ({
        1: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9],
        },
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
    }),
    scoringRule: {
        name: SuitScoringFunctionNames.WarriorScoring,
    },
    distinction: {
        description: DistinctionDescriptionNames.Warrior,
        awarding: {
            name: DistinctionAwardingFunctionNames.WarriorDistinctionAwarding,
        },
    },
};
/**
 * <h3>Конфиг фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 * @TODO Create GenerateSuitsConfig function to create a config in Distinction Order?
 */
export const suitsConfig = {
    warrior,
    hunter,
    miner,
    blacksmith,
    explorer,
};
//# sourceMappingURL=SuitData.js.map