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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
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
    if (type === "hand") {
        const handCoinPosition = G.publicPlayers[ctx.currentPlayer].boardCoins.filter((coin, index) => coin === null
            && index <= coinId).length;
        if (!G.publicPlayers[ctx.currentPlayer].handCoins.filter(coin => coin !== null)[handCoinPosition - 1].isTriggerTrading) {
            return true;
        }
    } else {
        if (G.publicPlayers[ctx.currentPlayer].boardCoins[coinId] && !G.publicPlayers[ctx.currentPlayer].boardCoins[coinId].isTriggerTrading) {
            return true;
        }
    }
    return false;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{placeCoins: {default1: string, default2: string, default_advanced: string}, null: {}, pickCards: {default: string, upgradeCoin: string, defaultPickCampCard: string, pickHero: string}, getDistinctions: {default: string, upgradeCoin: string, pickDistinctionCard: string}}}
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
        defaultPickCampCard: "ClickCampCard",
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
        discardSuitCard: "discardSuitCard"
    },
    getDistinctions: {
        default: "ClickDistinctionCard",
        pickDistinctionCard: "ClickCardToPickDistinction",
        upgradeCoin: "ClickCoinToUpgrade",
    },
    endTier: {
        pickHero: "ClickHeroCard",
    },
    enlistmentMercenaries: {
        pickHero: "ClickHeroCard",
        upgradeCoin: "ClickCoinToUpgrade",
    },
    placeCoinsUline: {},
    getMjollnirProfit: {},
    brisingamensEndGame: {},
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{ClickDistinctionCard: {getRange: (function({G: *}): [number, undefined]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickCoinToUpgrade: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G?: *, ctx?: *, id?: *, type?: *}): boolean)}, ClickCardToPickDistinction: {getRange: (function(): number[]), validate: (function(): boolean)}, ClickCampCard: {getRange: (function({G: *}): [number, number]), validate: (function({G: *, ctx: *}))}, ClickHandCoin: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}))}, BotsPlaceAllCoins: {getValue: (function({G: *, ctx: *, id: *}): *), getRange: (function({G: *}): [number, number]), validate: (function(): boolean)}, ClickHeroCard: {getRange: (function({G: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}): boolean)}, ClickBoardCoin: {getRange: (function({G: *, ctx: *}): [number, number]), validate: (function({G: *, ctx: *, id: *}))}}}
 */
export const moveValidators = {
    // todo Add all validators to all moves
    ClickHandCoin: {
        getRange: ({G, ctx}) => ([0, G.publicPlayers[ctx.currentPlayer].handCoins.length]),
        validate: ({G, ctx, id}) => G.publicPlayers[ctx.currentPlayer].selectedCoin === undefined &&
            G.publicPlayers[ctx.currentPlayer].handCoins[id] !== null,
    },
    ClickBoardCoin: {
        getRange: ({G, ctx}) => ([0, G.publicPlayers[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id}) => G.publicPlayers[ctx.currentPlayer].selectedCoin !== undefined &&
            G.publicPlayers[ctx.currentPlayer].boardCoins[id] === null,
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
                isValid = G.publicPlayers[ctx.currentPlayer].cards[suitId].reduce(TotalRank, 0) >=
                    G.heroes[id].stack[0].config.conditions.suitCountMin.value;
            }
            return isValid;
        },
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgrade: {
        getRange: ({G, ctx}) => ([0, G.publicPlayers[ctx.currentPlayer].boardCoins.length]),
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
        validate: ({G, ctx}) => G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
            (!G.campPicked && G.publicPlayers[ctx.currentPlayer].buffs["goCamp"])),
    },
};
