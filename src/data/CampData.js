import { TotalRank } from "../helpers/ScoreHelpers";
import { SuitNames } from "./SuitData";
import { AddBuffToPlayerCampAction, AddCampCardToCardsAction, CheckPickDiscardCardCampAction, DiscardTradingCoinAction, DrawProfitCampAction, PickDiscardCardCampAction, PickHeroCampAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../actions/CampActions";
import { RusCardTypes } from "../Card";
import { Stages } from "../Game";
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Fafnir_Baleygr = {
    name: `Fafnir Baleygr`,
    description: `After taking possession of it and throughout the game, you can go to the Camp on your turn instead of taking a card from the tavern being resolved if the Elvaland that won the bid did not go.`,
    game: `thingvellir`,
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: AddBuffToPlayerCampAction.name,
            config: {
                buff: {
                    name: `goCamp`,
                    value: true,
                },
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Draupnir = {
    name: `Draupnir`,
    description: `At the end of Age 2, when counting points, add to your Final Bravery Value: 6 points per coin of value 15 or more owned.`,
    game: `thingvellir`,
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
    ],
    scoringRule: (player) => player !== undefined ? player.boardCoins
        .filter((coin) => Boolean(coin !== null && coin.value >= 15)).length * 6 : 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Vegvisir = {
    name: `Vegvisir`,
    description: `Immediately place this Artifact in the Explorer column of your army. Its pose can trigger the recruitment of a Hero card if it completes a rank line. This artifact counts as an Explorer rank and adds 13 points to your Explorer Bravery Rating.`,
    game: `thingvellir`,
    tier: 0,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 13,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Svalinn = {
    name: `Svalinn`,
    description: `At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Hero card in your possession.`,
    game: `thingvellir`,
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
    ],
    scoringRule: (player) => player !== undefined ? player.heroes.length * 5 : 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Megingjord = {
    name: `Megingjord`,
    description: `During the rest of the game, you can no longer recruit a Hero card by making rank lines. So making rank lines has no effect for you. At the end of Age 2, when counting points, add 28 points to your Final Bravery Value.`,
    game: `thingvellir`,
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: AddBuffToPlayerCampAction.name,
            config: {
                buff: {
                    name: `noHero`,
                    value: true,
                },
            },
        },
    ],
    scoringRule: () => 28,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Vidofnir_Vedrfolnir = {
    name: `Vidofnir Vedrfolnir`,
    description: `Immediately reveal the coins from your pouch and transform one of these coins with a +2 and the other with a +3. If one of the coins on the trade is the trading coin (the 0 or the Special Hunter 3) then apply a +5 transform to the other coin. Perform coin transformations in any order you want.`,
    game: `thingvellir`,
    tier: 0,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: StartVidofnirVedrfolnirAction.name,
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Brisingamens = {
    name: `Brisingamens`,
    description: `Immediately look at all cards in the discard pile and choose two (Royal Offering cards and / or Dwarf cards). In the order of your choice: - perform coin transformation if you have chosen Royal Offering cards. - place the Dwarf cards in your army. This can result in a Hero card being recruited. At the end of Age 2, before counting points, discard a Dwarf card of your choice from your army. This card can be taken anywhere, in any column, but it cannot be a Hero card.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: AddBuffToPlayerCampAction.name,
            config: {
                buff: {
                    name: `discardCardEndGame`,
                    value: true,
                },
            },
        },
        {
            action: CheckPickDiscardCardCampAction.name,
        },
        {
            action: DrawProfitCampAction.name,
            config: {
                stageName: Stages.PickDiscardCard,
                name: `BrisingamensAction`,
                number: 2,
                drawName: `Brisingamens`,
            },
        },
        {
            action: PickDiscardCardCampAction.name,
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Mjollnir = {
    name: `Mjollnir`,
    description: `At the end of Age 2, when counting points, add to your Final Bravery Value: 2 points per rank in the class of your choice.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: AddBuffToPlayerCampAction.name,
            config: {
                buff: {
                    name: `getMjollnirProfit`,
                    value: true,
                },
            },
        },
    ],
    scoringRule: (player, suit) => player !== undefined && suit !== undefined ?
        player.cards[suit].reduce(TotalRank, 0) * 2 : 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hofud = {
    name: `Hofud`,
    description: `Immediately, each other Elvaland choose and discards a Warrior card from their army. The discarded card can be any card in the Warrior column except a Hero card.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: StartDiscardSuitCardAction.name,
            config: {
                suit: SuitNames.WARRIOR,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hrafnsmerki = {
    name: `Hrafnsmerki`,
    description: `At the end of Age 2, when counting points, add to your Final Bravery Value: 5 points per Mercenary card in your possession.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
    ],
    scoringRule: (player) => {
        if (player !== undefined) {
            let score = 0;
            for (const suit in player.cards) {
                if (player.cards.hasOwnProperty(suit)) {
                    score += player.cards[suit].filter((card) => card.type === RusCardTypes.MERCENARY).length * 5;
                }
            }
            return score;
        }
        return 0;
    },
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Jarnglofi = {
    name: `Jarnglofi`,
    description: `Immediately discard your trading coin (0 or Special Hunter 3). Warning! If this coin was placed on an unresolved tavern, your bid not be present when it is resolved, and you will not take any cards. At the end of Age 2, when counting points, add 24 points to your Final Bravery Value.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: DiscardTradingCoinAction.name,
        },
    ],
    scoringRule: () => 24,
};
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Gjallarhorn = {
    name: `Gjallarhorn`,
    description: `Immediately recruit a Hero card regardless of your rank line number. To recruit your next Hero card, you will need to validate the golden rule: to have a number of rank lines greater than your number of Hero cards owned.`,
    game: `thingvellir`,
    tier: 1,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddCampCardToCardsAction.name,
        },
        {
            action: PickHeroCampAction.name,
            config: {
                stageName: Stages.PickHero,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Конфиг карт наёмников для кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для кэмпа при инициализации игры.</li>
 * </ol>
 */
export const mercenariesConfig = [
    [
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 6,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 6,
            },
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
        },
        {
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 6,
            },
        },
        {
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 11,
            },
        },
    ],
    [
        {
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
        },
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 6,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 6,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
        },
        {
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: 8,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
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
 */
export const artefactsConfig = {
    Fafnir_Baleygr,
    Draupnir,
    Vegvisir,
    Svalinn,
    Megingjord,
    Vidofnir_Vedrfolnir,
    Brisingamens,
    Mjollnir,
    Hofud,
    Hrafnsmerki,
    Jarnglofi,
    Gjallarhorn
};
