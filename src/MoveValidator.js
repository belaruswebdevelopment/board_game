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

const CreateMoveValidator = ({move, getValue, getRange}) => {
    return {
        move,
        getValue,
        getRange,
    };
};

export const moveValidators = {
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
