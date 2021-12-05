import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";
import {MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {IConfig} from "./Player";

interface IMoveValidatorParamsMinimum {
    G: MyGameState,
}

interface IMoveValidatorParams {
    G: MyGameState,
    ctx?: Ctx,
    id?: number,
    type?: string,
}

interface IMoveByOption {
    [name: string]: string,
}

interface IMoveBy {
    [name: string]: IMoveByOption,
}

interface ICheckMoveParam {
    obj?: object | null,
    objId: number,
    range?: number[],
    values?: number[],
}

interface IMoveValidator {
    getRange: (params: IMoveValidatorParams) => [number, number],
    getValue?: (params: IMoveValidatorParams) => number[] | void,
    validate: (params: IMoveValidatorParams) => boolean | void,
}

interface IMoveValidators {
    [name: string]: IMoveValidator,
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
 * @constructor
 * @param obj
 */
export const IsValidMove = (obj: ICheckMoveParam): boolean => {
    return CheckMove(obj);
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
const CheckMove = ({obj, objId, range = [], values = []}: ICheckMoveParam): boolean => {
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
const ValidateByValues = (num: number, values: number[]): boolean => values.includes(num);

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
export const moveValidators: IMoveValidators = {
    // todo Add all validators to all moves
    ClickHandCoin: {
        getRange: ({G, ctx}: IMoveValidatorParams): [number, number] => ([0,
            G.publicPlayers[Number(ctx!.currentPlayer)].handCoins.length]),
        validate: ({G, ctx, id}: IMoveValidatorParams): boolean | void => {
            if (typeof id !== "undefined") {
                return G.publicPlayers[Number(ctx!.currentPlayer)].selectedCoin === undefined &&
                    G.publicPlayers[Number(ctx!.currentPlayer)].handCoins[id] !== null;
            } else {
                console.log("Param id must be type Number not Undefined");
            }
        }
    },
    ClickBoardCoin: {
        getRange: ({G, ctx}: IMoveValidatorParams): [number, number] => ([0,
            G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins.length]),
        validate: ({G, ctx, id}: IMoveValidatorParams): boolean | void => {
            if (typeof id !== "undefined") {
                return G.publicPlayers[Number(ctx!.currentPlayer)].selectedCoin !== undefined &&
                    G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins[id] === null;
            } else {
                console.log("Param id must be type Number not Undefined");
            }
        }
    },
    BotsPlaceAllCoins: {
        getRange: ({G}: IMoveValidatorParamsMinimum): [number, number] => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({G, id}: IMoveValidatorParams): number[] | void => {
            if (typeof id !== "undefined") {
                return G.botData.allCoinsOrder[id];
            } else {
                console.log("Param id must be type Number not Undefined");
            }
        },
        validate: (): boolean => true,
    },
    ClickHeroCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): [number, number] => ([0, G.heroes.length]),
        validate: ({G, ctx, id}: IMoveValidatorParams): boolean | void => {
            if (typeof id !== "undefined") {
                let isValid: boolean = G.heroes[id].active;
                // todo Add validators to others heroes
                if (G.heroes[id].name === "Hourya") {
                    const config: IConfig | undefined = G.heroes[id].stack[0].config;
                    if (config && config.conditions) {
                        const suitId = GetSuitIndexByName(config.conditions.suitCountMin.suit);
                        isValid = G.publicPlayers[Number(ctx!.currentPlayer)].cards[suitId].reduce(TotalRank, 0) >=
                            config.conditions.suitCountMin.value;
                    }
                }
                return isValid;
            } else {
                console.log("Param id must be type Number not Undefined");
            }
        },
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgrade: {
        getRange: ({G, ctx}: IMoveValidatorParams): [number, number] => ([0,
            G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins.length]),
        validate: ({G, ctx, id, type}: IMoveValidatorParams): boolean | void => {
            if (typeof id !== "undefined" && typeof type !== "undefined") {
                return CoinUpgradeValidation(G, ctx!, id, type);
            } else if (typeof id === "undefined" && typeof type === "undefined") {
                console.log("Param id must be type Number not Undefined and param type must be type string not Undefined");
            } else if (typeof id === "undefined") {
                console.log("Param id must be type Number not Undefined");
            } else if (typeof type === "undefined") {
                console.log("Param type must be type string not Undefined");
            }
        }
    },
    ClickCardToPickDistinction: {
        getRange: (): [number, number] => ([0, 3]),
        validate: (): boolean => true,
    },
    ClickDistinctionCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): [number, number] => ([0, G.distinctions.length]),
        validate: ({G, ctx, id}: IMoveValidatorParams): boolean =>
            G.distinctions.indexOf(Number(ctx!.currentPlayer)) === id,
    },
    ClickCampCard: {
        getRange: ({G}: IMoveValidatorParamsMinimum): [number, number] => ([0, G.camp.length]),
        validate: ({G, ctx}: IMoveValidatorParams): boolean => {
            return G.expansions.thingvellir.active && (Number(ctx!.currentPlayer) === G.publicPlayersOrder[0] ||
                (!G.campPicked && Boolean(G.publicPlayers[Number(ctx!.currentPlayer)].buffs.goCamp)));
        },
    },
};
