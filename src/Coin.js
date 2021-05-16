const CreateCoin = ({value, isInitial = false, isTriggerTrading = false} = {}) => {
    return {
        value,
        isInitial,
        isTriggerTrading,
    };
}

const UniqueCoins = (data, value) => {
    data.count.push(value);
}

export const CountMarketCoins = (data) => {
    const marketCoins = [];
    let flag = true;
    let repeated = {};
    for (let i = 0; i < data.length; i++) {
        let count = 0;
        let uniqueArrLength = marketCoins.length;
        for (let j = 0; j < uniqueArrLength; j++) {
            if (marketCoins[j].value === data[i].value) {
                count++;
                flag = false;
                j = uniqueArrLength;
            }
        }
        repeated[data[i].value] = count + 1;
        if (flag) {
            marketCoins.push(data[i]);
        }
        flag = true;
    }
    return repeated;
}

export const BuildCoins = (coinConfig, data) => {
    const coins = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const coinValue = typeof coinConfig[i] === "number" ? coinConfig[i] : coinConfig[i].value;
        const isMarket = data.players !== undefined;
        const count = isMarket ? coinConfig[i].count()[data.players] : 1;
        if (isMarket) {
            UniqueCoins(data, coinValue);
        }
        for (let c = 0; c < count; c++) {
            coins.push(CreateCoin({
                value: coinValue,
                isInitial: data.isInitial,
                isTriggerTrading: coinConfig[i].isTriggerTrading,
            }));
        }
    }
    return coins;
};