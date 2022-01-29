import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HeroNames, MoveNames, Phases, Stages } from "./typescript/enums";
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
 * @TODO Саше: сделать описание функции и параметров.
 * @param obj
 * @param objId
 * @param range
 * @param values
 * @returns Валидный ли мув.
 */
const CheckMove = ({ obj, objId, range = [], values = [], }) => {
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
 * @TODO Саше: сделать описание функции и параметров.
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
 *
 * @TODO Саше: сделать описание функции и параметров.
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
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveBy = {
    null: {},
    [Phases.PlaceCoins]: {
        default1: MoveNames.ClickHandCoinMove,
        default2: MoveNames.ClickBoardCoinMove,
        default_advanced: MoveNames.BotsPlaceAllCoinsMove,
    },
    [Phases.PlaceCoinsUline]: {
    // default1: MoveNames.ClickHandCoinMove,
    // default2: MoveNames.ClickBoardCoinMove,
    },
    [Phases.PickCards]: {
        default1: MoveNames.ClickCardMove,
        default2: MoveNames.ClickCampCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.DiscardCard]: MoveNames.DiscardCard2PlayersMove,
        // TODO Fix it!
        [Stages.PlaceTradingCoinsUline]: MoveNames.ClickHandCoinMove,
        // [Stages.PlaceTradingCoinsUline]: MoveNames.ClickBoardCoinMove,
    },
    [Phases.EnlistmentMercenaries]: {
        default1: MoveNames.StartEnlistmentMercenariesMove,
        default2: MoveNames.PassEnlistmentMercenariesMove,
        default3: MoveNames.GetEnlistmentMercenariesMove,
        default4: MoveNames.PlaceEnlistmentMercenariesMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.EndTier]: {
        default: MoveNames.PlaceCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.GetDistinctions]: {
        default: MoveNames.ClickDistinctionCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.PickDistinctionCard]: MoveNames.ClickCardToPickDistinctionMove,
    },
    [Phases.BrisingamensEndGame]: {
        default: MoveNames.DiscardCardFromPlayerBoardMove,
    },
    [Phases.GetMjollnirProfit]: {
        defaul: MoveNames.GetMjollnirProfitMove,
    },
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    // TODO Add all validators to all moves
    [MoveNames.BotsPlaceAllCoinsMove]: {
        getRange: ({ G }) => [0, G.botData.allCoinsOrder.length],
        getValue: ({ G, id }) => {
            if (id !== undefined) {
                return G.botData.allCoinsOrder[id];
            }
            // TODO Return []???
            return [];
        },
        validate: () => true,
    },
    [MoveNames.ClickBoardCoinMove]: {
        getRange: ({ G, ctx }) => [0, G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].boardCoins.length],
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].boardCoins[id] === null;
            }
            return false;
        },
    },
    [MoveNames.ClickCampCardMove]: {
        getRange: ({ G }) => [0, G.camp.length],
        validate: ({ G, ctx }) => G.expansions.thingvellir.active && ((ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer) === G.publicPlayersOrder[0]
            || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].buffs.goCamp))),
    },
    [MoveNames.ClickCardToPickDistinctionMove]: {
        getRange: () => ([0, 3]),
        validate: () => true,
    },
    // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
    [MoveNames.ClickCoinToUpgradeMove]: {
        getRange: ({ G, ctx }) => [0, G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].boardCoins.length],
        validate: ({ G, ctx, id, type }) => {
            if (id !== undefined && type !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return CoinUpgradeValidation(G, ctx, id, type);
            }
            return false;
        },
    },
    [MoveNames.ClickDistinctionCardMove]: {
        // TODO Rework with validator in Move: Object.keys(G.distinctions).includes(suit)
        getRange: ({ G }) => [0, Object.values(G.distinctions).length],
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return Object.values(G.distinctions).indexOf(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer) === id;
            }
            return false;
        }
    },
    [MoveNames.ClickHandCoinMove]: {
        getRange: ({ G, ctx }) => [0, G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].handCoins.length],
        validate: ({ G, ctx, id }) => {
            if (id !== undefined) {
                return G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx === null || ctx === void 0 ? void 0 : ctx.currentPlayer)].handCoins[id] !== null;
            }
            return false;
        },
    },
    [MoveNames.ClickHeroCardMove]: {
        getRange: ({ G }) => [0, G.heroes.length],
        validate: ({ G, ctx, id }) => {
            if (ctx !== undefined && id !== undefined) {
                let isValid = G.heroes[id].active;
                // TODO Add validators to others heroes and to Pick Hero Move
                switch (G.heroes[id].name) {
                    case HeroNames.Hourya:
                        isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                        break;
                    case HeroNames.Bonfur:
                    case HeroNames.Dagda:
                        isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                        break;
                    default:
                        break;
                }
                return isValid;
            }
            return false;
        },
    },
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
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
 * @TODO Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns
 */
const ValidateByValues = (num, values) => values.includes(num);
//# sourceMappingURL=MoveValidator.js.map