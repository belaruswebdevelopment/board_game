import {TotalRank} from "../Score";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Dwerg_Bergelmir = {
    name: "Dwerg Bergelmir",
    description: "В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Bergelmir",
            },
        },
    ],
    scoringRule: () => 1,
};
// todo rework AddBuff?!
/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Ylud = {
    name: "Ylud",
    description: "Поместите эту карту в свою командную зону. В эпоху 1, сразу после посещения последней таверны, но до смотра войск, поместите карту Илуд в колонку любого воинского класса вашей армии. При распределении знаков отличий во время смотра войск, шеврон Илуд учитывается в качестве шеврона этого класса. Илуд остаётся в этой колонке до конца эпохи 2. Если вы призвали Илуд во время эпохи 2, поместите её карту в свою командную зону. В эпоху 2, сразу после посещения последней таверны, но до подсчёта итогового показателя храбрости: • если Илуд в командной зоне, то игрок помещает её в колонку любого воинского класса своей армии, • если Илуд в армии, игрок может переместить её в другую колонку воинского класса по своему выбору. Илуд будет учитываться в качестве дворфа того класса, где располагается. В конце эпохи 2, в зависимости от местоположения Илуд, она будет учитываться как кузнец или охотник, разведчик 11, воин 7, горняк 1. Если Илуд в колонке воинов, то её шеврон учитывается в сумме шевронов воинов при определении преимущества. Игрок получает право призвать нового героя, если с помощью карты Илуд завершит новую линию 5 шевронов. Если игрок обладает обеими картами героев Илуд и Труд, то при их активации важно учесть следующий порядок. После посещения последней таверны в эпоху 2 игрок сначала помещает Илуд в свою армию. В этот момент игрок может призвать нового героя, если с помощью Илуд создал линию 5 шевронов. Затем игрок перемещает Труд из армии в свою командную зону.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Ylud",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Dwerg_Jungir = {
    name: "Dwerg Jungir",
    description: "В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Jungir",
            },
        },
    ],
    scoringRule: () => 1,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: string}}, actionName: string}, {actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Uline = {
    name: "Uline",
    description: "Прибавьте 9 очков к своему итоговому показателю храбрости. Как только вы призвали Улину и положили её карту в свою командную зону, сразу же берите в руку монеты, которые всё ещё лежат лицом вниз на вашем планшете. С этого момента и каждый раз во время подготовки к раунду на этапе «Ставки» игрок не выкладывает свои монеты на планшет, а держит их в своей руке. Во время посещения таверны на этапе «Открытие ставок», игрок ждёт, пока все другие эльвеланды откроют свои ставки и только после этого он выбирает монету из своей руки и кладёт её лицом вверх в область соответствующей таверны на своём планшете. Затем раунд продолжается в порядке, соответствующем ставкам игроков. Если игрок активировал своей ставкой обмен монет, то последним действием своего хода он выбирает из руки две монеты, номиналы которых он суммирует для получения новой монеты. Обмен происходит по обычным правилам, однако новую монету игрок сразу же берёт в руку, а не кладёт в кошель своего планшета. Во время улучшения монеты: • если игрок выбрал монету из руки, то новую монету он берёт так же в руку, • если игрок выбрал монету, лежащую на планшете, то новую монету он кладёт в то же место. Игрок может сделать ставку монетами из руки в таверне, которую посетит в ходе раунда. Монеты, лежащие на планшете, должны оставаться на нём до конца текущего раунда.",
    game: "base",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Uline",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "everyTurn",
                    value: "Uline",
                },
            },
        },
        {
            actionName: "GetClosedCoinIntoPlayerHand",
        },
    ],
    scoringRule: () => 9,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(*)), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Idunn = {
    name: "Idunn",
    description: "Обладает 1 шевроном. Прибавьте 7 очков к показателю храбрости разведчиков плюс по 2 очка за каждый шеврон в колонке Разведчиков (включая её собственный).",
    game: "base",
    suit: "explorer",
    rank: 1,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Idunn",
            },
        },
    ],
    scoringRule: (player) => player.cards[GetSuitIndexByName("explorer")].reduce(TotalRank, 0) * 2,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Tarah = {
    name: "Tarah",
    description: "Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.",
    game: "base",
    suit: "warrior",
    rank: 1,
    points: 14,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Tarah",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Kraal = {
    name: "Kraal",
    description: "Обладает 2 шевронами. Прибавьте 7 и 0 очков к показателю храбрости воинов.",
    game: "base",
    suit: "warrior",
    rank: 2,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Kraal",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Lokdur = {
    name: "Lokdur",
    description: "Обладает 1 шевроном. Прибавьте 3 к сумме очков храбрости горняков. Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.",
    game: "base",
    suit: "miner",
    rank: 1,
    points: 3,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Lokdur",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {stageName: string, name: string, drawName: string, value: number}, actionName: string}, {config: {value: number}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Grid = {
    name: "Grid",
    description: "Прибавьте 7 очков к своему итоговому показателю храбрости. Когда вы призвали Грид и положили её карту в свою командную зону, сразу же улучшите на +7 номинал одной из своих монет.",
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Grid",
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "upgradeCoin",
                drawName: "Grid",
                name: "upgradeCoin",
                value: 7,
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 7,
            },
        },
    ],
    scoringRule: () => 7,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: null}, explorer: {rank: number, suit: string, points: null}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: null}}, config: {stageName: string, name: string, drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: null}, explorer: {rank: number, suit: string, points: null}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: null}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Thrud = {
    name: "Thrud",
    description: "Призвав этого героя, поместите её карту по своему выбору в любую колонку класса своей армии. На карту Труд нельзя положить никакую другую карту дворфа. Если карта дворфа или героя помещается в колонку, где расположена Труд, то игрок должен взять карту Труд в руку, поместить карту дворфа или героя и затем вернуть карту Труд в армию, в любую колонку по своему выбору. Игрок получает право призвать нового героя, если, разместив карту Труд, создал необходимую для этого новую линию 5 шевронов. В конце эпохи 1, при распределении карт знаков отличия, шеврон Труд учитывается в том воинском классе, где она расположена. В эпоху 2, после посещения последней таверны, но перед подсчётом итогового показателя храбрости, карта Труд перемещается из армии в командную зону. Труд прибавляет 13 очков к итоговому показателю храбрости игрока.",
    game: "base",
    suit: null,
    rank: null,
    points: 13,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Thrud",
            },
        },
        {
            actionName: "DrawProfitAction",
            variants: {
                blacksmith: {
                    suit: "blacksmith",
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: "hunter",
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: "explorer",
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: "warrior",
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: "miner",
                    rank: 1,
                    points: null,
                },
            },
            config: {
                stageName: "placeCards",
                name: "placeCards",
                drawName: "Thrud",
            },
        },
        {
            actionName: "PlaceThrudAction",
            variants: {
                blacksmith: {
                    suit: "blacksmith",
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: "hunter",
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: "explorer",
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: "warrior",
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: "miner",
                    rank: 1,
                    points: null,
                },
            },
        },
    ],
    scoringRule: () => 13,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Zoral = {
    name: "Zoral",
    description: "Обладает 3 шевронами. Прибавьте 1, 0 и 0 к сумме очков храбрости горняков. Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.",
    game: "base",
    suit: "miner",
    rank: 3,
    points: 1,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Zoral",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Dwerg_Aesir = {
    name: "Dwerg Aesir",
    description: "В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Aesir",
            },
        },
    ],
    scoringRule: () => 1,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {suit: string}, actionName: string}, {config: {stageName: string, name: string, suit: string, drawName: string}, actionName: string}, {config: {suit: string}, actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}} Герой.
 */
const Bonfur = {
    name: "Bonfur",
    description: "Обладает 3 шевронами. Призвав Бонфура, сразу же поместите его карту в колонку кузнецов и отправьте в сброс одну нижнюю карту дворфа (не героя) из другой колонки своей армии по своему выбору.",
    game: "base",
    suit: "blacksmith",
    rank: 3,
    points: null,
    stack: [
        {
            actionName: "CheckDiscardCardsFromPlayerBoardAction",
            config: {
                suit: "blacksmith",
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Bonfur",
                name: "BonfurAction",
                suit: "blacksmith",
            },
        },
        {
            actionName: "DiscardCardsFromPlayerBoardAction",
            config: {
                suit: "blacksmith",
            },
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Bonfur",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {number: number, suit: string}, actionName: string}, {config: {number: number, stageName: string, name: string, suit: string, drawName: string}, actionName: string}, {actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}} Герой.
 */
const Dagda = {
    name: "Dagda",
    description: "Обладает 3 шевронами. Призвав Дагду, сразу же поместите её карту в колонку охотников и отправьте в сброс по одной нижней карте дворфов (не героев) из двух других колонок своей армии по своему выбору.",
    game: "base",
    suit: "hunter",
    rank: 3,
    points: null,
    stack: [
        {
            actionName: "CheckDiscardCardsFromPlayerBoardAction",
            config: {
                suit: "hunter",
                number: 2,
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Dagda",
                name: "DagdaAction",
                suit: "hunter",
                number: 2,
            },
        },
        {
            actionName: "DiscardCardsFromPlayerBoardAction",
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dagda",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Skaa = {
    name: "Skaa",
    description: "Прибавьте 17 очков к своему итоговому показателю храбрости.",
    game: "base",
    suit: null,
    rank: null,
    points: 17,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Skaa",
            },
        },
    ],
    scoringRule: () => 17,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: number}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Jarika = {
    name: "Jarika",
    description: "Adds 8 points to your Final Bravery Value. As a neutral Hero, place her in your Command Zone. During a coin transformation or a coin trade (Royal Offering, Warrior Distinction, Grid), increase the value of the desired sum by +2.",
    game: "base",
    suit: null,
    rank: null,
    points: 8,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Jarika",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "upgradeCoin",
                    value: 2,
                },
            },
        },
    ],
    scoringRule: () => 8,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(*): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Astrid = {
    name: "Astrid",
    description: "Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Astrid",
            },
        },
    ],
    scoringRule: (player) => Math.max(...player.boardCoins.filter(coin => coin?.value).map(coin => coin.value),
        ...player.handCoins.filter(coin => coin?.value).map(coin => coin.value)),
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Dwerg_Ymir = {
    name: "Dwerg Ymir",
    description: "В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Ymir",
            },
        },
    ],
    scoringRule: () => 1,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: null}} Герой.
 */
const Dwerg_Sigmir = {
    name: "Dwerg Sigmir",
    description: "В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Sigmir",
            },
        },
    ],
    scoringRule: () => 1,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {conditions: {suitCountMin: {suit: string, value: number}}}, actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}} Герой.
 */
const Hourya = {
    name: "Hourya",
    description: "Обладает 1 шевроном. Прибавьте 20 очков к показателю храбрости разведчиков. Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков. Важно: если Труд и/или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии",
    game: "base",
    suit: "explorer",
    rank: 1,
    points: 20,
    stack: [
        {
            actionName: "PickHeroWithConditions",
            config: {
                conditions: {
                    suitCountMin: {
                        suit: "explorer",
                        value: 5,
                    },
                },
            },
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Hourya",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}} Герой.
 */
const Aegur = {
    name: "Aegur",
    description: "Обладает 2 шевронами.",
    game: "base",
    suit: "blacksmith",
    rank: 2,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Aegur",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}} Герой.
 */
const Aral = {
    name: "Aral",
    description: "Обладает 2 шевронами.",
    game: "base",
    suit: "hunter",
    rank: 2,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Aral",
            },
        },
    ],
    scoringRule: () => 0,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {actionName: string}, {config: {stageName: string, name: string, drawName: string}, actionName: string}, {actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Andumia = {
    name: "Andumia",
    description: "Adds 12 points to your Final Bravery Value. When you recruit her, immediately look at all the cards in the discard pile and keep one (Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. Its placement can trigger the recruitment of a Hero card.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Andumia",
            },
        },
        {
            actionName: "CheckPickDiscardCard",
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "pickDiscardCard",
                drawName: "Andumia",
                name: "AndumiaAction",
            },
        },
        {
            actionName: "PickDiscardCard",
        },
    ],
    scoringRule: () => 12,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}, {actionName: string}, {config: {stageName: string, name: string, drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Holda = {
    name: "Holda",
    description: "Adds 12 points to your Final Bravery Value. When you recruit her, immediately choose a Mercenary or Artifact card available at the Camp.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Holda",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "goCampOneTime",
                    value: true,
                },
            },
        },
        {
            actionName: "CheckPickCampCard",
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "pickCampCardHolda",
                drawName: "Holda",
                name: "HoldaAction",
            },
        },
    ],
    scoringRule: () => 12,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {value: number, coin: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Khrad = {
    name: "Khrad",
    description: "Adds 4 points to your Final Bravery Value. When you recruit him, immediately add +10 to your lowest value coin (except the Trading coin).",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 4,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Khrad",
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 10,
                coin: "min",
            },
        },
    ],
    scoringRule: () => 4,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: number}, explorer: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, config: {number: number, stageName: string, name: string, drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: number}, explorer: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Olwin = {
    name: "Olwin",
    description: "Adds 9 points to your Final Bravery Value. When you recruit him, also take his two doubles whose Bravery value is 0 and then place each of these cards in two different columns of your choice. Their placement may result in the recruitment of a Hero card. «Olwin's double» cards are considered Dwarf cards of the class in which they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Olwin",
            },
        },
        {
            actionName: "DrawProfitAction",
            variants: {
                blacksmith: {
                    suit: "blacksmith",
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: "hunter",
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: "explorer",
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: "warrior",
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: "miner",
                    rank: 1,
                    points: 0,
                },
            },
            config: {
                stageName: "placeCards",
                drawName: "Olwin",
                name: "placeCards",
                number: 2,
            },
        },
        {
            actionName: "PlaceCards",
            variants: {
                blacksmith: {
                    suit: "blacksmith",
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: "hunter",
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: "explorer",
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: "warrior",
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: "miner",
                    rank: 1,
                    points: 0,
                },
            },
        },
    ],
    scoringRule: () => 9,
};

/**
 * Данные о герое.
 * Применения:
 * 1) Используется при обращении к данным героя.
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: string}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}} Герой.
 */
const Zolkur = {
    name: "Zolkur",
    description: "Adds 10 points to your Final Bravery Value. When you recruit him, immediately place him on the coins of your pouch. During your next trade, you trade the lower value coin instead of the higher as in a standard exchange. Then return Zolkur's card to the Command Zone.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 10,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Zolkur",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "upgradeNextCoin",
                    value: "min",
                },
            },
        },
    ],
    scoringRule: () => 10,
};

/**
 * Конфиг героев.
 * Применения:
 * 1) Происходит при создании всех героев при инициализации игры.
 *
 * @type {{Zoral: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: number}, Aegur: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: null}, Dwerg_Ymir: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Andumia: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {actionName: string}, {config: {stageName: string, name: string, drawName: string}, actionName: string}, {actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Dwerg_Bergelmir: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Grid: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {stageName: string, name: string, drawName: string, value: number}, actionName: string}, {config: {value: number}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Holda: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}, {actionName: string}, {config: {stageName: string, name: string, drawName: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Dwerg_Aesir: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Dagda: {scoringRule: (function(): number), game: string, stack: [{config: {number: number, suit: string}, actionName: string}, {config: {number: number, stageName: string, name: string, suit: string, drawName: string}, actionName: string}, {actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}, Zolkur: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: string}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Astrid: {scoringRule: (function(*): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Tarah: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: number}, Aral: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: null}, Dwerg_Jungir: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Lokdur: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: number}, Dwerg_Sigmir: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Ylud: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}, Idunn: {scoringRule: (function(*)), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: number}, Uline: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: string}}, actionName: string}, {actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Khrad: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {value: number, coin: string}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Bonfur: {scoringRule: (function(): number), game: string, stack: [{config: {suit: string}, actionName: string}, {config: {stageName: string, name: string, suit: string, drawName: string}, actionName: string}, {config: {suit: string}, actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: null}, Kraal: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: string, points: number}, Olwin: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: number}, explorer: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, config: {number: number, stageName: string, name: string, drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: number}, explorer: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Jarika: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {config: {buff: {name: string, value: number}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Hourya: {scoringRule: (function(): number), game: string, stack: [{config: {conditions: {suitCountMin: {suit: string, value: number}}}, actionName: string}, {config: {drawName: string}, actionName: string}], name: string, description: string, rank: number, suit: string, points: number}, Thrud: {scoringRule: (function(): number), game: string, stack: [{config: {drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: null}, explorer: {rank: number, suit: string, points: null}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: null}}, config: {stageName: string, name: string, drawName: string}, actionName: string}, {variants: {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: null}, explorer: {rank: number, suit: string, points: null}, hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: null}}, actionName: string}], name: string, description: string, rank: null, suit: null, points: number}, Skaa: {scoringRule: (function(): number), game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: number}}} Все герои.
 */
export const heroesConfig = {
    Bonfur,
    Aegur,
    Dagda,
    Aral,
    Lokdur,
    Zoral,
    Tarah,
    Kraal,
    Idunn,
    Hourya,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Aesir,
    Dwerg_Ymir,
    Dwerg_Sigmir,
    Ylud,
    Uline,
    Grid,
    Thrud,
    Skaa,
    Jarika,
    Astrid,
    Andumia,
    Holda,
    Khrad,
    Olwin,
    Zolkur,
};
