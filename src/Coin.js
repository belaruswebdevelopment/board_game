const CreateCoin = ({value, isInitial = false, isTriggerTrading = false} = {}) => {
    return {
        value,
        isInitial,
        isTriggerTrading,
    };
};

const UniqueCoins = (data, value) => {
    data.count.push(value);
};

export const CountMarketCoins = (data) => {
    const marketCoins = [],
        repeated = {};
    let flag = true;
    for (let i = 0; i < data.length; i++) {
        const uniqueArrLength = marketCoins.length;
        let count = 0;
        for (let j = 0; j < uniqueArrLength; j++) {
            if (marketCoins[j].value === data[i].value) {
                count++;
                flag = false;
                break;
            }
        }
        repeated[data[i].value] = count + 1;
        if (flag) {
            marketCoins.push(data[i]);
        }
        flag = true;
    }
    return repeated;
};

export const BuildCoins = (coinConfig, data) => {
    const coins = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const isMarket = data.players !== undefined,
            coinValue = typeof coinConfig[i] === "number" ? coinConfig[i] : coinConfig[i].value,
            count = isMarket ? coinConfig[i].count()[data.players] : 1;
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
