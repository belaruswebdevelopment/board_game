import { BlacksmithDistinctionAwarding, ExplorerDistinctionAwarding, HunterDistinctionAwarding, MinerDistinctionAwarding, WarriorDistinctionAwarding } from "../helpers/DistinctionAwardingHelpers";
import { SuitScoring } from "../score_helpers/SuitScoringHelpers";
import { RusSuitNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 * @TODO Add may be potential points for hunters and blacksmiths.
 */
const blacksmith = {
    suit: SuitNames.Blacksmith,
    suitName: RusSuitNames.blacksmith,
    suitColor: `bg-purple-600`,
    description: `Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).`,
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
    scoringRule: SuitScoring,
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
const explorer = {
    suit: SuitNames.Explorer,
    suitName: RusSuitNames.explorer,
    suitColor: `bg-blue-500`,
    description: `Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.`,
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
    scoringRule: SuitScoring,
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
const hunter = {
    suit: SuitNames.Hunter,
    suitName: RusSuitNames.hunter,
    suitColor: `bg-green-600`,
    description: `Их показатель храбрости равен квадрату числа карт охотников в армии игрока.`,
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
    scoringRule: SuitScoring,
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
const miner = {
    suit: SuitNames.Miner,
    suitName: RusSuitNames.miner,
    suitColor: `bg-yellow-600`,
    description: `Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.`,
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
    scoringRule: SuitScoring,
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
const warrior = {
    suit: SuitNames.Warrior,
    suitName: RusSuitNames.warrior,
    suitColor: `bg-red-600`,
    description: `Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.`,
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
    scoringRule: SuitScoring,
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
export const suitsConfig = {
    warrior,
    hunter,
    miner,
    blacksmith,
    explorer,
};
//# sourceMappingURL=SuitData.js.map