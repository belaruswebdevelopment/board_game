import { TotalRank } from "./helpers/ScoreHelpers";
import { MyGameState } from "./GameSetup";
import { Ctx } from "boardgame.io";
import { IConfig } from "./Player";
import { ICoin } from "./Coin";
import { AddDataToLog, LogTypes } from "./Logging";
import { HeroNames } from "./data/HeroData";

/**
 * <h3>Интерфейс для параметров валидатора мувов.</h3>
 */
interface IMoveValidatorParams {
    G: MyGameState,
    ctx?: Ctx,
    id?: number,
    type?: string,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
interface IMoveByOption {
    [name: string]: string,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
interface IMoveBy {
    [name: string]: IMoveByOption,
}

/**
 * <h3>Интерфейс для проверки параметров валидатора мувов.</h3>
 */
interface ICheckMoveParam {
    obj?: object | null,
    objId: number,
    range?: number[],
    values?: number[],
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
interface IMoveValidator {
    getRange: (params: IMoveValidatorParams) => [number, number],
    getValue?: (params: IMoveValidatorParams) => number[],
    validate: (params: IMoveValidatorParams) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
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
 * @param obj
 * @param objId
 * @param range
 * @param values
 * @returns Валидный ли мув.
 */
const CheckMove = ({ obj, objId, range = [], values = [] }: ICheckMoveParam): boolean => {
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
 * @param G
 * @param ctx
 * @param coinId
 * @param type
 * @returns
 */
export const CoinUpgradeValidation = (G: MyGameState, ctx: Ctx, coinId: number, type: string): boolean => {
    if (type === "hand") {
        const handCoinPosition: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin: ICoin | null, index: number): boolean => coin === null && index <= coinId).length;
        if (!G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin: ICoin | null): boolean => coin !== null)[handCoinPosition - 1]?.isTriggerTrading) {
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
 * @param obj Параметры валидации мува.
 * @returns Валидный ли мув.
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
 * @todo Саше: сделать описание функции и параметров.
 */
export const moveBy: IMoveBy = {
    null: {},
    placeCoins: {
        default1: `ClickHandCoinMove`,
        default2: `ClickBoardCoinMove`,
        default_advanced: `BotsPlaceAllCoinsMove`,
    },
    pickCards: {
        default: `ClickCardMove`,
        defaultPickCampCard: `ClickCampCardMove`,
        pickHero: `ClickHeroCardMove`,
        upgradeCoin: `ClickCoinToUpgradeMove`,
        discardSuitCard: `discardSuitCardMove`,
    },
    getDistinctions: {
        default: `ClickDistinctionCardMove`,
        pickDistinctionCard: `ClickCardToPickDistinctionMove`,
        upgradeCoin: `ClickCoinToUpgradeMove`,
    },
    endTier: {
        pickHero: `ClickHeroCardMove`,
    },
    enlistmentMercenaries: {
        pickHero: `ClickHeroCardMove`,
        upgradeCoin: `ClickCoinToUpgradeMove`,
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
 * @todo Саше: сделать описание функции и параметров.
 */
export const moveValidators: IMoveValidators = {
    // todo Add all validators to all moves
    ClickHandCoinMove: {
        getRange: ({ G, ctx }: IMoveValidatorParams): [number, number] =>
            ([0, G.publicPlayers[Number(ctx!.currentPlayer)].handCoins.length]),
        validate: ({ G, ctx, id }: IMoveValidatorParams): boolean => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx!.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx!.currentPlayer)].handCoins[id] !== null;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        },
    },
    ClickBoardCoinMove: {
        getRange: ({ G, ctx }: IMoveValidatorParams): [number, number] =>
            ([0, G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins.length]),
        validate: ({ G, ctx, id }: IMoveValidatorParams): boolean => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx!.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins[id] === null;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        },
    },
    BotsPlaceAllCoinsMove: {
        getRange: ({ G }: IMoveValidatorParams): [number, number] => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({ G, id }: IMoveValidatorParams): number[] => {
            if (id !== undefined) {
                return G.botData.allCoinsOrder[id];
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            // todo Return []???
            return [];
        },
        validate: (): boolean => true,
    },
    ClickHeroCardMove: {
        getRange: ({ G }: IMoveValidatorParams): [number, number] => ([0, G.heroes.length]),
        validate: ({ G, ctx, id }: IMoveValidatorParams): boolean => {
            if (id !== undefined) {
                let isValid: boolean = G.heroes[id].active;
                // todo Add validators to others heroes
                if (G.heroes[id].name === HeroNames.Hourya) {
                    const config: IConfig | undefined = G.heroes[id].stack[0].config;
                    if (config?.conditions !== undefined) {
                        isValid = G.publicPlayers[Number(ctx!.currentPlayer)]
                            .cards[config.conditions.suitCountMin.suit].reduce(TotalRank, 0) >=
                            config.conditions.suitCountMin.value;
                        return isValid;
                    } else {
                        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Нет обязательного параметр stack[0] у героя ${G.heroes[id].name}.`);
                    }
                    return false;
                }
                return isValid;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        },
    },
    // todo Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    ClickCoinToUpgradeMove: {
        getRange: ({ G, ctx }: IMoveValidatorParams): [number, number] =>
            ([0, G.publicPlayers[Number(ctx!.currentPlayer)].boardCoins.length]),
        validate: ({ G, ctx, id, type }: IMoveValidatorParams): boolean => {
            if (id !== undefined && type !== undefined) {
                return CoinUpgradeValidation(G, ctx!, id, type);
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id' или не передан обязательный параметр 'type'.`);
            return false;
        },
    },
    ClickCardToPickDistinctionMove: {
        getRange: (): [number, number] => ([0, 3]),
        validate: (): boolean => true,
    },
    ClickDistinctionCardMove: {
        getRange: ({ G }: IMoveValidatorParams): [number, number] => ([0, Object.values(G.distinctions).length]),
        validate: ({ G, ctx, id }: IMoveValidatorParams): boolean => {
            if (id !== undefined) {
                return Object.values(G.distinctions).indexOf(Number(ctx!.currentPlayer)) === id;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        }
    },
    ClickCampCardMove: {
        getRange: ({ G }: IMoveValidatorParams): [number, number] => ([0, G.camp.length]),
        validate: ({ G, ctx }: IMoveValidatorParams): boolean =>
            G.expansions.thingvellir.active && (Number(ctx!.currentPlayer) === G.publicPlayersOrder[0]
                || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx!.currentPlayer)].buffs.goCamp))),
    },
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
 * @returns
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
 * @returns
 */
const ValidateByValues = (num: number, values: number[]): boolean => values.includes(num);
