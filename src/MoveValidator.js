import {TotalRank} from "./Score";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";

/**
 * Validates arguments inside of move.
 * obj - object to validate.
 * objId - Id of object.
 * range - range for Id.
 * values - values for Id.
 */
/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param args
 * @returns {boolean}
 * @constructor
 */
export const IsValidMove = (...args) => {
    let isValid = true;
    for (const item of args) {
        isValid = isValid && CheckMove(item);
        if (!isValid) {
            break;
        }
    }
    return isValid;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param obj
 * @param objId
 * @param range
 * @param values
 * @returns {boolean}
 * @constructor
 */
const CheckMove = ({obj, objId, range = [], values = []}) => {
    let isValid = obj !== null;
    if (range.length === 2) {
        isValid = isValid && ValidateByRange(objId, range);
    } else if (values.length > 0) {
        isValid = isValid && ValidateByValues(objId, values);
    }
    return isValid;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param num
 * @param range
 * @returns {boolean}
 * @constructor
 */
const ValidateByRange = (num, range) => {
    return range[0] <= num && num < range[1];
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns {*}
 * @constructor
 */
const ValidateByValues = (num, values) => {
    return values.includes(num);
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param coinId
 * @param type
 * @returns {boolean}
 * @constructor
 */
export const CoinUpgradeValidation = (G, ctx, coinId, type) => {
    if (type === "board") {
        if (G.players[ctx.currentPlayer].boardCoins[coinId].isTriggerTrading) {
            return false;
        }
    } else if (type === "hand") {
        const handCoinPosition = G.players[ctx.currentPlayer].boardCoins[coinId].filter((coin, index) => coin === null && index <= coinId).length;
        if (G.players[ctx.currentPlayer].handCoins.filter(coin => coin !== null)[handCoinPosition].isTriggerTrading) {
            return false;
        }
    }
    return true;
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{placeCoins: {default1: string, default2: string, default_advanced: string}, null: {}, pickCards: {default: string, upgradeCoin: string, pickHero: string, pickCampCard: string}, getDistinctions: {upgradeDistinctionCoin: string, default: string, upgradeCoinInDistinction: string, pickDistinctionCard: string}}}
 */
export const moveBy = {
    null: {},
    placeCoins: {
        default1: "ClickHandCoin",
        default2: "ClickBoardCoin",
        default_advanced: "BotsPlaceAllCoins",
    },
    pickCards: {
        default: "ClickCard",
        pickCampCard: "ClickCampCard",
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
    },
    getDistinctions: {
        default: "ClickDistinctionCard",
        pickDistinctionCard: "ClickCardToPickDistinction",
        upgradeDistinctionCoin: "ClickCoinToUpgradeDistinction",
        upgradeCoinInDistinction: "ClickCoinToUpgradeInDistinction",
    },
};

/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{ClickDistinctionCard: {getRange: (function({G: *, ctx: *}): [number, undefined]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCoinToUpgradeDistinction: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCoinToUpgrade: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCoinToUpgradeInDistinction: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCardToPickDistinction: {getRange: (function({G: *, ctx: *}): number[]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCampCard: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}))}, ClickHandCoin: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}))}, BotsPlaceAllCoins: {getValue: (function({G: *, ctx: *, id: *}): *), getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickHeroCard: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): *|boolean|number|ServiceWorker)}, ClickBoardCoin: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}))}}}
 */
export const moveValidators = {
    ClickHandCoin: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].handCoins.length]),
        validate: ({
                       G,
                       ctx,
                       id
                   }) => G.players[ctx.currentPlayer].selectedCoin === undefined && G.players[ctx.currentPlayer].handCoins[id] !== null,
    },
    ClickBoardCoin: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({
                       G,
                       ctx,
                       id
                   }) => G.players[ctx.currentPlayer].selectedCoin !== undefined && G.players[ctx.currentPlayer].boardCoins[id] === null,
    },
    BotsPlaceAllCoins: {
        getRange: ({G}) => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({G, ctx, id}) => G.botData.allCoinsOrder[id],
        validate: () => true,
    },
    ClickHeroCard: {
        getRange: ({G}) => ([0, G.heroes.length]),
        validate: ({G, ctx, id}) => {
            let isValid = G.heroes[id].active;
            // todo Add validators to others heroes
            if (G.heroes[id].name === "Hourya") {
                const suitId = GetSuitIndexByName(G.heroes[id].stack[0].config.conditions.suitCountMin.suit);
                isValid = G.players[ctx.currentPlayer].cards[suitId].reduce(TotalRank, 0) >=
                    G.stack[ctx.currentPlayer][0].config.conditions.suitCountMin.value;
            }
            return isValid || G.players[ctx.currentPlayer].buffs?.["noHero"];
        },
    },
    ClickCoinToUpgrade: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id, type}) => CoinUpgradeValidation(G, ctx, id, type),
    },
    ClickCoinToUpgradeDistinction: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id, type}) => CoinUpgradeValidation(G, ctx, id, type),
    },
    ClickCoinToUpgradeInDistinction: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id, type}) => CoinUpgradeValidation(G, ctx, id, type),
    },
    ClickCardToPickDistinction: {
        getRange: () => ([0, 3]),
        validate: () => true,
    },
    ClickDistinctionCard: {
        getRange: ({G}) => ([0, G.distinctions.length]),
        validate: ({G, ctx, id}) => G.distinctions.indexOf(Number(ctx.currentPlayer)) === id,
    },
    ClickCampCard: {
        getRange: ({G}) => ([0, G.camp.length]),
        validate: ({G, ctx}) => G.expansions.thingvellir &&
            (Number(ctx.currentPlayer) === G.playersOrder[0] || (G.players[ctx.currentPlayer].buffs?.["goCamp"] && G.campPicked === false) ||
                G.players[ctx.currentPlayer].buffs?.["goCampOneTime"]),
    },
};
