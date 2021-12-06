import { TotalRank } from "../helpers/ScoreHelpers";
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Fafnir_Baleygr = {
    name: "Fafnir Baleygr",
    description: "After taking possession of it and throughout the game, you can go to the Camp on your turn instead of " +
        "taking a card from the tavern being resolved if the Elvaland that won the bid did not go.",
    game: "thingvellir",
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "goCamp",
                    value: true,
                },
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), game: string, stack: [{actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Draupnir = {
    name: "Draupnir",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 6 points per coin of value " +
        "15 or more owned.",
    game: "thingvellir",
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
    ],
    scoringRule: function (player) { return player ? player.boardCoins
        .filter(function (coin) { return Boolean(coin && (coin === null || coin === void 0 ? void 0 : coin.value) >= 15); }).length * 6 : 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}], tier: number, name: string, description: string, rank: number, suit: string, points: number}} Артефакт.
 */
var Vegvisir = {
    name: "Vegvisir",
    description: "Immediately place this Artifact in the Explorer column of your army. Its pose can trigger the " +
        "recruitment of a Hero card if it completes a rank line. This artifact counts as an Explorer rank and adds 13 " +
        "points to your Explorer Bravery Rating.",
    game: "thingvellir",
    tier: 0,
    suit: "explorer",
    rank: 1,
    points: 13,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), game: string, stack: [{actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Svalinn = {
    name: "Svalinn",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Hero card in " +
        "your possession.",
    game: "thingvellir",
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
    ],
    scoringRule: function (player) { return player ? player.heroes.length * 5 : 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Megingjord = {
    name: "Megingjord",
    description: "During the rest of the game, you can no longer recruit a Hero card by making rank lines. So making " +
        "rank lines has no effect for you. At the end of Age 2, when counting points, add 28 points to your Final " +
        "Bravery Value.",
    game: "thingvellir",
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "noHero",
                    value: true,
                },
            },
        },
    ],
    scoringRule: function () { return 28; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Vidofnir_Vedrfolnir = {
    name: "Vidofnir Vedrfolnir",
    description: "Immediately reveal the coins from your pouch and transform one of these coins with a +2 and the other " +
        "with a +3. If one of the coins on the trade is the trading coin (the 0 or the Special Hunter 3) then apply a +5 " +
        "transform to the other coin. Perform coin transformations in any order you want.",
    game: "thingvellir",
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "StartVidofnirVedrfolnirAction",
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}, {config: {number: number, stageName: string, name: string}, actionName: string}, {actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Brisingamens = {
    name: "Brisingamens",
    description: "Immediately look at all cards in the discard pile and choose two (Royal Offering cards and / or Dwarf " +
        "cards). In the order of your choice: - perform coin transformation if you have chosen Royal Offering cards. - " +
        "place the Dwarf cards in your army. This can result in a Hero card being recruited. At the end of Age 2, before " +
        "counting points, discard a Dwarf card of your choice from your army. This card can be taken anywhere, in any " +
        "column, but it cannot be a Hero card.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "discardCardEndGame",
                    value: true,
                },
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "pickDiscardCard",
                name: "BrisingamensAction",
                number: 2,
                drawName: "Brisingamens",
            },
        },
        {
            actionName: "PickDiscardCard",
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*, *)), game: string, stack: [{actionName: string}, {config: {buff: {name: string, value: boolean}}, actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Mjollnir = {
    name: "Mjollnir",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 2 points per rank in the " +
        "class of your choice.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "getMjollnirProfit",
                    value: true,
                },
            },
        },
    ],
    scoringRule: function (player, suitId) { return player && typeof suitId === "number" ?
        player.cards[suitId].reduce(TotalRank, 0) * 2 : 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Hofud = {
    name: "Hofud",
    description: "Immediately, each other Elvaland choose and discards a Warrior card from their army. The discarded " +
        "card can be any card in the Warrior column except a Hero card.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "StartDiscardSuitCard",
            config: {
                suit: "warrior",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), game: string, stack: [{actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Hrafnsmerki = {
    name: "Hrafnsmerki",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Mercenary " +
        "card in your possession.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
    ],
    scoringRule: function (player) { return player ? player.cards.flat()
        .filter(function (card) { return card.type === "наёмник"; }).length * 5 : 0; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Jarnglofi = {
    name: "Jarnglofi",
    description: "Immediately discard your trading coin (0 or Special Hunter 3). Warning! If this coin was placed on an " +
        "unresolved tavern, your bid not be present when it is resolved, and you will not take any cards. At the end of " +
        "Age 2, when counting points, add 24 points to your Final Bravery Value.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "DiscardTradingCoin",
        },
    ],
    scoringRule: function () { return 24; },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(): number), game: string, stack: [{actionName: string}, {config: {stageName: string}, actionName: string}], tier: number, name: string, description: string, rank: null, suit: null, points: null}} Артефакт.
 */
var Gjallarhorn = {
    name: "Gjallarhorn",
    description: "Immediately recruit a Hero card regardless of your rank line number. To recruit your next Hero card, " +
        "you will need to validate the golden rule: to have a number of rank lines greater than your number of Hero " +
        "cards owned.",
    game: "thingvellir",
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddCampCardToCards",
        },
        {
            actionName: "PickHero",
            config: {
                stageName: "pickHero",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Конфиг карт наёмников для кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для кэмпа при инициализации игры.</li>
 * </ol>
 *
 * @type {([{warrior: {rank: number, suit: string, points: number}, explorer: {rank: number, suit: string, points: number}}, {blacksmith: {rank: number, suit: string, points: null}, warrior: {rank: number, suit: string, points: number}}, {explorer: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}}, {hunter: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, {blacksmith: {rank: number, suit: string, points: null}, miner: {rank: number, suit: string, points: number}}, null]|[{blacksmith: {rank: number, suit: string, points: null}, hunter: {rank: number, suit: string, points: null}}, {warrior: {rank: number, suit: string, points: number}, miner: {rank: number, suit: string, points: number}}, {blacksmith: {rank: number, suit: string, points: null}, explorer: {rank: number, suit: string, points: number}}, {warrior: {rank: number, suit: string, points: number}, hunter: {rank: number, suit: string, points: null}}, {explorer: {rank: number, suit: string, points: number}, miner: {rank: number, suit: string, points: number}}, null])[]} Все карты наёмников для кэмпа.
 */
export var mercenariesConfig = [
    [
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 6,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 6,
            },
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
        },
        {
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 6,
            },
        },
        {
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 11,
            },
        },
    ],
    [
        {
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
        },
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 6,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 6,
            },
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
        },
        {
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 8,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: 11,
            },
        },
    ],
];
/**
 * <h3>Конфиг карт артефактов для кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для кэмпа при инициализации игры.</li>
 * </ol>
 *
 * @type {{Svalinn: {scoringRule: (function(*)), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Brisingamens: {scoringRule: (function(): number), game: string, stack: ({actionName: string}|{config: {buff: {name: string, value: boolean}}, actionName: string}|{config: {number: number, stageName: string, name: string}, actionName: string}|{config: {number: number, stageName: string}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Vidofnir_Vedrfolnir: {scoringRule: (function(): number), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Hrafnsmerki: {scoringRule: (function(*)), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Gjallarhorn: {scoringRule: (function(): number), game: string, stack: ({actionName: string}|{config: {stageName: string}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Hofud: {scoringRule: (function(): number), game: string, stack: ({actionName: string}|{config: {stageName: string, name: string}, actionName: string}|{config: {suit: string}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Draupnir: {scoringRule: (function(*)), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Mjollnir: {scoringRule: (function(*, *)), game: string, stack: ({actionName: string}|{config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Jarnglofi: {scoringRule: (function(): number), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Megingjord: {scoringRule: (function(): number), game: string, stack: ({actionName: string}|{config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Fafnir_Baleygr: {scoringRule: (function(): number), game: string, stack: ({actionName: string}|{config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}, Vegvisir: {scoringRule: (function(): number), game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: number, suit: string, points: number}}} Все карты артефактов для кэмпа.
 */
export var artefactsConfig = {
    Fafnir_Baleygr: Fafnir_Baleygr,
    Draupnir: Draupnir,
    Vegvisir: Vegvisir,
    Svalinn: Svalinn,
    Megingjord: Megingjord,
    Vidofnir_Vedrfolnir: Vidofnir_Vedrfolnir,
    Brisingamens: Brisingamens,
    Mjollnir: Mjollnir,
    Hofud: Hofud,
    Hrafnsmerki: Hrafnsmerki,
    Jarnglofi: Jarnglofi,
    Gjallarhorn: Gjallarhorn
};
