import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";
import {MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {ArgsTypes} from "./actions/Actions";

interface IMoveValidatorParamsMinimum {
    G: MyGameState,
}

interface IMoveValidatorParams {
    G: MyGameState,
    ctx: Ctx,
}

interface IMoveValidatorParamsMaximum {
    G: MyGameState,
    ctx: Ctx,
    id: number,
}

interface IMoveValidatorParamsAdvanced {
    G: MyGameState,
    ctx: Ctx,
    id: number,
    type: string,
}

interface IMoveByOption {
    [name: string]: string,
}

interface IMoveBy {
    [name: string]: IMoveByOption,
}

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
 * @constructor
 */
export const IsValidMove = (...args: ArgsTypes): boolean => {
    let isValid: boolean = true;
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
 * @constructor
 */
const CheckMove = ({obj, objId, range = [], values = []}): boolean => {
    let isValid: boolean = obj !== null;
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
 * @constructor
 */
const ValidateByRange = (num: number, range: number[]): boolean => range[0] <= num && num < range[1];

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
 * @constructor
 */
const ValidateByValues = (num: number, values): boolean => values.includes(num);

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
 * @constructor
 */
export const CoinUpgradeValidation = (G: MyGameState, ctx: Ctx, coinId: number, type: string): boolean => {
    if (type === "hand") {
        const handCoinPosition: number = G.publicPlayers[Number(ctx.currentPlayer)]
            .boardCoins.filter((coin, index) => coin === null && index <= coinId).length;
        if (!G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter(coin => coin !== null)[handCoinPosition - 1]?.isTriggerTrading) {
            return true;
        }
    } else {
        if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinId]?.isTriggerTrading) {
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
 */
export const moveBy: IMoveBy = {
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
 */
export const moveValidators = {
    // todo Add all validators to all moves
    ClickHandCoin: {
        getRange: ({G, ctx}: IMoveValidatorParams): number[] => ([0,
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]),
        validate: ({G, ctx, id}: IMoveValidatorParamsMaximum): boolean =>
            G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined &&
            G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null,
    },
    ClickBoardCoin: {
        getRange: ({G, ctx}: IMoveValidatorParams): number[] => ([0,
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]),
        validate: ({G, ctx, id}: IMoveValidatorParamsMaximum): boolean =>
            G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined &&
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null,
    },
    BotsPlaceAllCoins: {
        getRange: ({G}: IMoveValidatorParamsMinimum): number[] => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({G, ctx, id}: IMoveValidatorParamsMaximum): number[] => G.botData.allCoinsOrder[id],
        validate: (): boolean => true,
    },
    ClickHeroCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): number[] => ([0, G.heroes.length]),
        validate: ({G, ctx, id}: IMoveValidatorParamsMaximum): boolean => {
            let isValid = G.heroes[id].active;
            // todo Add validators to others heroes
            if (G.heroes[id].name === "Hourya") {
                const suitId = GetSuitIndexByName(G.heroes[id].stack[0].config.conditions.suitCountMin.suit);
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].reduce(TotalRank, 0) >=
                    G.heroes[id].stack[0].config.conditions.suitCountMin.value;
            }
            return isValid;
        },
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgrade: {
        getRange: ({G, ctx}: IMoveValidatorParams): number[] => ([0,
            G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]),
        validate: ({G, ctx, id, type}: IMoveValidatorParamsAdvanced): boolean =>
            CoinUpgradeValidation(G, ctx, id, type),
    },
    ClickCardToPickDistinction: {
        getRange: (): number[] => ([0, 3]),
        validate: (): boolean => true,
    },
    ClickDistinctionCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): number[] => ([0, G.distinctions.length]),
        validate: ({G, ctx, id}: IMoveValidatorParamsMaximum): boolean =>
            G.distinctions.indexOf(Number(ctx.currentPlayer)) === id,
    },
    ClickCampCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): number[] => ([0, G.camp.length]),
        validate: ({G, ctx}: IMoveValidatorParams): boolean => G.expansions.thingvellir.active &&
            (Number(ctx.currentPlayer) === G.publicPlayersOrder[0] ||
                (!G.campPicked && G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)),
    },
};
