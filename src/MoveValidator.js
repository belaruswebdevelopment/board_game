import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
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
 * @param obj Параметры валидации мува.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (obj) => {
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
 * @returns Валидный ли мув.
 */
const CheckMove = ({ obj, objId, range = [], values = [] }) => {
    let isValid = obj !== null;
    if (range.length === 2) {
        isValid = isValid && ValidateByRange(objId, range);
    }
    else if (values.length > 0) {
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
 * @returns
 */
const ValidateByRange = (num, range) => range[0] <= num && num < range[1];
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
const ValidateByValues = (num, values) => values.includes(num);
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
export const CoinUpgradeValidation = (G, ctx, coinId, type) => {
    var _a, _b;
    if (type === "hand") {
        const handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin, index) => coin === null && index <= coinId).length;
        if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin) => coin !== null)[handCoinPosition - 1]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
            return true;
        }
    }
    else {
        if (!((_b = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
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
 * @todo Саше: сделать описание функции и параметров.
 */
export const moveBy = {
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
export const moveValidators = {
    // todo Add all validators to all moves
    ClickHandCoinMove: {
        getRange: ({ G, ctx }) => ([0, G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]),
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        },
    },
    ClickBoardCoinMove: {
        getRange: ({ G, ctx }) => ([0, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]),
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        },
    },
    BotsPlaceAllCoinsMove: {
        getRange: ({ G }) => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({ G, id }) => {
            if (id !== undefined) {
                return G.botData.allCoinsOrder[id];
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            // todo Return []???
            return [];
        },
        validate: () => true,
    },
    ClickHeroCardMove: {
        getRange: ({ G }) => ([0, G.heroes.length]),
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                let isValid = G.heroes[id].active;
                // todo Add validators to others heroes
                if (G.heroes[id].name === `Hourya`) {
                    const config = G.heroes[id].stack[0].config;
                    if ((config === null || config === void 0 ? void 0 : config.conditions) !== undefined) {
                        const suitId = GetSuitIndexByName(config.conditions.suitCountMin.suit);
                        if (suitId !== -1) {
                            isValid = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                                .reduce(TotalRank, 0) >= config.conditions.suitCountMin.value;
                            return isValid;
                        }
                        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найдена несуществующая фракция ${config.conditions.suitCountMin.suit}.`);
                    }
                    else {
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
        getRange: ({ G, ctx }) => ([0, G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length]),
        validate: ({ G, ctx, id, type }) => {
            if (id !== undefined && type !== undefined) {
                return CoinUpgradeValidation(G, ctx, id, type);
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id' или не передан обязательный параметр 'type'.`);
            return false;
        },
    },
    ClickCardToPickDistinctionMove: {
        getRange: () => ([0, 3]),
        validate: () => true,
    },
    ClickDistinctionCardMove: {
        getRange: ({ G }) => ([0, G.distinctions.length]),
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return G.distinctions.indexOf(Number(ctx.currentPlayer)) === id;
            }
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'id'.`);
            return false;
        }
    },
    ClickCampCardMove: {
        getRange: ({ G }) => ([0, G.camp.length]),
        validate: ({ G, ctx }) => G.expansions.thingvellir.active && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
            || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp))),
    },
};
