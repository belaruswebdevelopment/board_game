import { TotalRank } from "../helpers/ScoreHelpers";
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Fafnir_Baleygr = {
    name: "Fafnir Baleygr",
    description: "After taking possession of it and throughout the game, you can go to the Camp on your turn instead of \n    taking a card from the tavern being resolved if the Elvaland that won the bid did not go.",
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
 * @type {{scoringRule: (player?: IPublicPlayer) => number, game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Draupnir = {
    name: "Draupnir",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 6 points per coin of value \n    15 or more owned.",
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
 * @type {{scoringRule: () => number, game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Vegvisir = {
    name: "Vegvisir",
    description: "Immediately place this Artifact in the Explorer column of your army. Its pose can trigger the \n    recruitment of a Hero card if it completes a rank line. This artifact counts as an Explorer rank and adds 13 points \n    to your Explorer Bravery Rating.",
    game: "thingvellir",
    tier: 0,
    suit: "explorer" /* EXPLORER */,
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
 * @type {{scoringRule: (player?: IPublicPlayer) => number, game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Svalinn = {
    name: "Svalinn",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Hero card in \n    your possession.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Megingjord = {
    name: "Megingjord",
    description: "During the rest of the game, you can no longer recruit a Hero card by making rank lines. So making \n    rank lines has no effect for you. At the end of Age 2, when counting points, add 28 points to your Final Bravery \n    Value.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Vidofnir_Vedrfolnir = {
    name: "Vidofnir Vedrfolnir",
    description: "Immediately reveal the coins from your pouch and transform one of these coins with a +2 and the other \n    with a +3. If one of the coins on the trade is the trading coin (the 0 or the Special Hunter 3) then apply a +5 \n    transform to the other coin. Perform coin transformations in any order you want.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {config: {buff: {name: string, value: boolean}}, actionName: string} | {config: {number: number, stageName: string, name: string, drawName: string}, actionName: string} | {actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Brisingamens = {
    name: "Brisingamens",
    description: "Immediately look at all cards in the discard pile and choose two (Royal Offering cards and / or Dwarf \n    cards). In the order of your choice: - perform coin transformation if you have chosen Royal Offering cards. - place \n    the Dwarf cards in your army. This can result in a Hero card being recruited. At the end of Age 2, before counting \n    points, discard a Dwarf card of your choice from your army. This card can be taken anywhere, in any column, but it \n    cannot be a Hero card.",
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
 * @type {{scoringRule: (player?: IPublicPlayer, suitId?: number) => number, game: string, stack: ({actionName: string} | {config: {buff: {name: string, value: boolean}}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Mjollnir = {
    name: "Mjollnir",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 2 points per rank in the \n    class of your choice.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {config: {suit: SuitNames.WARRIOR}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Hofud = {
    name: "Hofud",
    description: "Immediately, each other Elvaland choose and discards a Warrior card from their army. The discarded \n    card can be any card in the Warrior column except a Hero card.",
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
                suit: "warrior" /* WARRIOR */,
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
 * @type {{scoringRule: (player?: IPublicPlayer) => number, game: string, stack: {actionName: string}[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Hrafnsmerki = {
    name: "Hrafnsmerki",
    description: "At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Mercenary \n    card in your possession.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Jarnglofi = {
    name: "Jarnglofi",
    description: "Immediately discard your trading coin (0 or Special Hunter 3). Warning! If this coin was placed on an \n    unresolved tavern, your bid not be present when it is resolved, and you will not take any cards. At the end of Age \n    2, when counting points, add 24 points to your Final Bravery Value.",
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
 * @type {{scoringRule: () => number, game: string, stack: ({actionName: string} | {config: {stageName: string}, actionName: string})[], tier: number, name: string, description: string, rank: null, suit: null, points: null}}
 */
var Gjallarhorn = {
    name: "Gjallarhorn",
    description: "Immediately recruit a Hero card regardless of your rank line number. To recruit your next Hero card, \n    you will need to validate the golden rule: to have a number of rank lines greater than your number of Hero cards \n    owned.",
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
 * @type {(({warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}} | {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}} | {explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}} | {hunter: {rank: number, suit: SuitNames.HUNTER, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: number}} | {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: number}} | {warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}})[] | ({blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}} | {warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, miner: {rank: number, suit: SuitNames.MINER, points: number}} | {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}} | {warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}} | {explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}, miner: {rank: number, suit: SuitNames.MINER, points: number}} | {warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}})[])[]}
 */
export var mercenariesConfig = [
    [
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 6,
            },
            explorer: {
                suit: "explorer" /* EXPLORER */,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 6,
            },
            blacksmith: {
                suit: "blacksmith" /* BLACKSMITH */,
                rank: 1,
                points: null,
            },
        },
        {
            hunter: {
                suit: "hunter" /* HUNTER */,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer" /* EXPLORER */,
                rank: 1,
                points: 6,
            },
        },
        {
            hunter: {
                suit: "hunter" /* HUNTER */,
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner" /* MINER */,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: "blacksmith" /* BLACKSMITH */,
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner" /* MINER */,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: "explorer" /* EXPLORER */,
                rank: 1,
                points: 11,
            },
        },
    ],
    [
        {
            hunter: {
                suit: "hunter" /* HUNTER */,
                rank: 1,
                points: null,
            },
            blacksmith: {
                suit: "blacksmith" /* BLACKSMITH */,
                rank: 1,
                points: null,
            },
        },
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 6,
            },
            miner: {
                suit: "miner" /* MINER */,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: "blacksmith" /* BLACKSMITH */,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer" /* EXPLORER */,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 6,
            },
            hunter: {
                suit: "hunter" /* HUNTER */,
                rank: 1,
                points: null,
            },
        },
        {
            explorer: {
                suit: "explorer" /* EXPLORER */,
                rank: 1,
                points: 8,
            },
            miner: {
                suit: "miner" /* MINER */,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: "warrior" /* WARRIOR */,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: "explorer" /* EXPLORER */,
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
 * @type {{Svalinn: IArtefact, Brisingamens: IArtefact, Vidofnir_Vedrfolnir: IArtefact, Hrafnsmerki: IArtefact, Gjallarhorn: IArtefact, Hofud: IArtefact, Draupnir: IArtefact, Mjollnir: IArtefact, Jarnglofi: IArtefact, Megingjord: IArtefact, Fafnir_Baleygr: IArtefact, Vegvisir: IArtefact}}
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
