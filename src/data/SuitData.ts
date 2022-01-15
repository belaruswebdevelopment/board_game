import { BlacksmithDistinctionAwarding, ExplorerDistinctionAwarding, HunterDistinctionAwarding, MinerDistinctionAwarding, WarriorDistinctionAwarding } from "../helpers/DistinctionAwardingHelpers";
import { ArithmeticSum, TotalPoints, TotalRank } from "../helpers/ScoreHelpers";
import { PlayerCardsType } from "../typescript/card_types";
import { RusSuitNames, SuitNames } from "../typescript/enums";
import { IPointsValues, IRankValues } from "../typescript/object_values_interfaces";
import { ISuit, ISuitConfig } from "../typescript/suit_interfaces";

/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 * @TODO Add may be potential points for hunters and blacksmiths.
 */
const blacksmith: ISuit = {
    suit: SuitNames.BLACKSMITH,
    suitName: RusSuitNames.BLACKSMITH,
    suitColor: `bg-purple-600`,
    description: `Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).`,
    ranksValues: (): IRankValues => ({
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
    pointsValues: (): IPointsValues => ({
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
    scoringRule: (cards: PlayerCardsType[]): number =>
        ArithmeticSum(3, 1, cards.reduce(TotalRank, 0)),
    distinction: {
        description: `Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.`,
        awarding: BlacksmithDistinctionAwarding,
    },
};

/**
 * <h3>Фракция разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const explorer: ISuit = {
    suit: SuitNames.EXPLORER,
    suitName: RusSuitNames.EXPLORER,
    suitColor: `bg-blue-500`,
    description: `Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.`,
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalPoints, 0),
    distinction: {
        description: `Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия разведчиков в командную зону рядом с вашим планшетом.`,
        awarding: ExplorerDistinctionAwarding,
    },
};

/**
 * <h3>Фракция охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const hunter: ISuit = {
    suit: SuitNames.HUNTER,
    suitName: RusSuitNames.HUNTER,
    suitColor: `bg-green-600`,
    description: `Их показатель храбрости равен квадрату числа карт охотников в армии игрока.`,
    ranksValues: (): IRankValues => ({
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
    pointsValues: (): IPointsValues => ({
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
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalRank, 0) ** 2,
    distinction: {
        description: `Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.`,
        awarding: HunterDistinctionAwarding,
    },
};

/**
 * <h3>Фракция горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const miner: ISuit = {
    suit: SuitNames.MINER,
    suitName: RusSuitNames.MINER,
    suitColor: `bg-yellow-600`,
    description: `Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.`,
    ranksValues: (): IRankValues => ({
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
    pointsValues: (): IPointsValues => ({
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
    scoringRule: (cards: PlayerCardsType[]): number =>
        cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0),
    distinction: {
        description: `Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве ставок и никогда не обменивается.`,
        awarding: MinerDistinctionAwarding,
    },
};

/**
 * <h3>Фракция воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const warrior: ISuit = {
    suit: SuitNames.WARRIOR,
    suitName: RusSuitNames.WARRIOR,
    suitColor: `bg-red-600`,
    description: `Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.`,
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalPoints, 0),
    distinction: {
        description: `Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.`,
        awarding: WarriorDistinctionAwarding,
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
export const suitsConfig: ISuitConfig = {
    warrior,
    hunter,
    miner,
    blacksmith,
    explorer,
};
