/**
 * Validates arguments inside of move.
 * obj - object to validate.
 * objId - Id of object.
 * range - range for Id.
 * values - values for Id.
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

const CheckMove = ({obj, objId, range = [], values = []}) => {
    let isValid = obj !== null;
    if (range.length === 2) {
        isValid = isValid && ValidateByRange(objId, range);
    } else if (values.length > 0) {
        isValid = isValid && ValidateByValues(objId, values);
    }
    return isValid;
};

const ValidateByRange = (num, range) => {
    return range[0] <= num && num < range[1];
};

const ValidateByValues = (num, values) => {
    return values.includes(num);
};

export const moveBy = {
    null: {},
    placeCoins: {
        default1: "ClickHandCoin",
        default2: "ClickBoardCoin",
        default_advanced: "PlaceAllCoins",
    },
    pickCards: {
        default: "ClickCard",
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

export const moveValidators = {
    ClickHandCoin: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].handCoins.length]),
        validate: ({G, ctx, id}) => G.players[ctx.currentPlayer].selectedCoin === undefined && G.players[ctx.currentPlayer].handCoins[id] !== null,
    },
    ClickBoardCoin: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id}) => G.players[ctx.currentPlayer].selectedCoin !== undefined && G.players[ctx.currentPlayer].boardCoins[id] === null,
    },
    PlaceAllCoins: {
        getRange: ({G, ctx}) => ([0, G.botData.allCoinsOrder.length]),
        getValue: ({G, ctx, id}) => G.botData.allCoinsOrder[id],
        validate: ({G, ctx, id}) => true,
    },
    ClickHeroCard: {
        getRange: ({G, ctx}) => ([0, G.heroes.length]),
        validate: ({G, ctx, id}) => G.heroes[id] !== null,
    },
    ClickCoinToUpgrade: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id}) => G.players[ctx.currentPlayer].boardCoins[id].isTriggerTrading === false,
    },
    ClickCoinToUpgradeDistinction: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id}) => G.players[ctx.currentPlayer].boardCoins[id].isTriggerTrading === false,
    },
    ClickCoinToUpgradeInDistinction: {
        getRange: ({G, ctx}) => ([0, G.players[ctx.currentPlayer].boardCoins.length]),
        validate: ({G, ctx, id}) => G.players[ctx.currentPlayer].boardCoins[id].isTriggerTrading === false,
    },
    ClickCardToPickDistinction: {
        getRange: ({G, ctx}) => ([0, 3]),
        validate: ({G, ctx, id}) => true,
    },
    ClickDistinctionCard: {
        getRange: ({G, ctx}) => ([0, G.distinctions.length]),
        validate: ({G, ctx, id}) => G.distinctions.findIndex(id => id === Number(ctx.currentPlayer)) === id,
    },
};
