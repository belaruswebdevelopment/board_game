export const CreateCoin = ({value, isInitial = false, isTriggerTrading = false} = {}) => {
    return {
        value,
        isInitial,
        isTriggerTrading,
    };
};


export const CountMarketCoins = (G) => {
    const repeated = {};
    for (let i = 0; i < G.marketCoinsUnique.length; i++) {
        let temp = G.marketCoinsUnique[i].value;
        repeated[temp] = G.marketCoins.filter(coin => coin.value === temp).length;
    }
    return repeated;
};

export const BuildCoins = (coinConfig, opts) => {
    const coins = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const isMarket = opts.players !== undefined,
            coinValue = coinConfig[i]?.value ?? coinConfig[i],
            count = isMarket ? coinConfig[i].count()[opts.players] : 1;
        if (isMarket) {
            opts.count.push({value: coinValue});
        }
        for (let c = 0; c < count; c++) {
            coins.push(CreateCoin({
                value: coinValue,
                isInitial: opts.isInitial,
                isTriggerTrading: coinConfig[i].isTriggerTrading,
            }));
        }
    }
    return coins;
};

// todo rework in ONE function
export const Trading = (G, ctx, tradingCoins) => {
    const coinsTotalValue = tradingCoins.reduce((prev, current) => prev + current.value, 0),
        coinsValues = tradingCoins.map(coin => coin.value),
        coinsMaxValue = Math.max(...coinsValues);
    let coinMaxIndex = null;
    for (let i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            if (tradingCoins[i].isInitial) {
                break;
            }
        }
    }
    let tradedCoin = null;
    if (G.marketCoins.length) {
        if (coinsTotalValue > G.marketCoins[G.marketCoins.length - 1].value) {
            tradedCoin = G.marketCoins[G.marketCoins.length - 1];
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                if (G.marketCoins[i].value < coinsTotalValue) {
                    tradedCoin = G.marketCoins[i];
                } else if (G.marketCoins[i].value >= coinsTotalValue) {
                    tradedCoin = G.marketCoins[i];
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = null;
    if (tradedCoin !== null) {
        G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = tradedCoin;
        if (!tradingCoins[coinMaxIndex].isInitial) {
            let returningIndex = null;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                if (G.marketCoins[i].value > tradingCoins[coinMaxIndex].value) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, tradingCoins[coinMaxIndex]);
        }
    } else {
        G.players[ctx.currentPlayer].boardCoins[G.taverns.length + coinMaxIndex] = tradingCoins[coinMaxIndex];
    }
};

export const UpgradeCoin = (G, ctx, j, value) => {
    const upgradedCoin = G.players[ctx.currentPlayer].boardCoins[j],
        newValue = G.players[ctx.currentPlayer].boardCoins[j].value + value;
    let upgradeCoin = null;
    if (G.marketCoins.length) {
        if (newValue > G.marketCoins[G.marketCoins.length - 1].value) {
            upgradeCoin = G.marketCoins[G.marketCoins.length - 1];
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                if (G.marketCoins[i].value < newValue) {
                    upgradeCoin = G.marketCoins[i];
                } else if (G.marketCoins[i].value >= newValue) {
                    upgradeCoin = G.marketCoins[i];
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    G.players[ctx.currentPlayer].boardCoins[j] = null;
    if (upgradeCoin !== null) {
        G.players[ctx.currentPlayer].boardCoins[j] = upgradeCoin;
        if (!G.players[ctx.currentPlayer].boardCoins[j].isInitial) {
            let returningIndex = null;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                if (G.marketCoins[i].value > newValue) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, upgradedCoin);
        }
    } else {
        G.players[ctx.currentPlayer].boardCoins[j] = upgradedCoin;
    }
};
