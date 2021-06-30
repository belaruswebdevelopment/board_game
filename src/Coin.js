import {AddDataToLog} from "./Logging";
import {AddActionsToStack, StartActionFromStackOrEndActions} from "./helpers/StackHelpers";

/**
 * Создание монеты.
 * Применения:
 * 1) Происходит при создании всех монет при инициализации игры.
 * 2) Вызывается при создании монеты примущества по охотникам.
 *
 * @param value Значение.
 * @param isInitial Является ли базовой.
 * @param isTriggerTrading Активирует ли обмен монет.
 * @returns {{isTriggerTrading: boolean, isInitial: boolean, value}} Монета.
 * @constructor
 */
export const CreateCoin = ({value, isInitial = false, isTriggerTrading = false} = {}) => {
    return {
        value,
        isInitial,
        isTriggerTrading,
    };
};

/**
 * Создание всех монет.
 * Применения:
 * 1) Вызывается при создании всех базовых монет игроков.
 * 2) Вызывается при создании всех монет рынка.
 *
 * @param coinConfig Конфиг монет.
 * @param opts Опции создания монет.
 * @returns {*[]} Массив монет.
 * @constructor
 */
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

/**
 * Вычисляет количество монет каждого номинала на рынке монет.
 * Применения:
 * 1) Вызывается при отрисовке рынка монет.
 *
 * @param G
 * @returns {{}} Количество монет каждого номинала на рынке монет.
 * @constructor
 */
export const CountMarketCoins = (G) => {
    const repeated = {};
    for (let i = 0; i < G.marketCoinsUnique.length; i++) {
        const temp = G.marketCoinsUnique[i].value;
        repeated[temp] = G.marketCoins.filter(coin => coin.value === temp).length;
    }
    return repeated;
};

/**
 * Активация обмена монет с рынка.
 * Применения:
 * 1) Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.
 *
 * @param G
 * @param ctx
 * @param tradingCoins Монеты для обмена.
 * @constructor
 */
export const Trading = (G, ctx, tradingCoins) => {
    const coinsValues = tradingCoins.map(coin => coin.value),
        coinsMaxValue = Math.max(...coinsValues),
        coinsMinValue = Math.min(...coinsValues);
    let stack,
        upgradingCoinId,
        upgradingCoin,
        coinMaxIndex,
        coinMinIndex;
    AddDataToLog(G, "game", `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока 
    ${G.players[ctx.currentPlayer].nickname}.`);
    // TODO trading isInitial first or playerChoose?
    for (let i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        } else if (tradingCoins[i].value === coinsMinValue) {
            coinMinIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
    }
    if (G.players[ctx.currentPlayer].buffs?.["upgradeNextCoin"] === "min") {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: coinsMaxValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        upgradingCoin = tradingCoins[coinMinIndex];
    } else {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: coinsMinValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMaxIndex;
        upgradingCoin = tradingCoins[coinMaxIndex];
    }
    AddActionsToStack(G, ctx, stack);
    return StartActionFromStackOrEndActions(G, ctx, null, upgradingCoinId, "board", upgradingCoin.isInitial);
};

/**
 * Обмен монеты с рынка.
 * Применения:
 * 1) Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.
 *
 * @param G
 * @param ctx
 * @param config Конфиг обмена.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Являетя ли обменная монета базовой.
 * @constructor
 */
export const UpgradeCoin = (G, ctx, config, upgradingCoinId, type, isInitial) => {
    let upgradingCoin;
    // todo Add logging
    if (G.players[ctx.currentPlayer].buffs["upgradeNextCoin"]) {
        delete G.players[ctx.currentPlayer].buffs["upgradeNextCoin"];
    }
    if (config?.coin === "min") {
        // todo Upgrade isInitial min coin or not or User must choose!?
        if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline") {
            const allCoins = [],
                allHandCoins = G.players[ctx.currentPlayer].handCoins.filter(coin => coin !== null);
            for (let i = 0; i < G.players[ctx.currentPlayer].boardCoins.length; i++) {
                if (G.players[ctx.currentPlayer].boardCoins[i] === null) {
                    allCoins.push(allHandCoins.splice(0, 1)[0]);
                } else {
                    allCoins.push(G.players[ctx.currentPlayer].boardCoins[i]);
                }
            }
            const minCoinValue = Math.min(...allCoins.filter(coin => !coin?.isTriggerTrading).map(coin => coin?.value));
            const upgradingCoinInitial = allCoins.find(coin => coin.value === minCoinValue && coin.isInitial);
            if (upgradingCoinInitial) {
                upgradingCoin = upgradingCoinInitial;
            } else {
                upgradingCoin = allCoins.find(coin => coin.value === minCoinValue && !coin.isInitial);
            }
            upgradingCoinId = allCoins.findIndex(coin => coin.value === upgradingCoin.value);
        } else {
            const minCoinValue = Math.min(...G.players[ctx.currentPlayer].boardCoins.filter(coin => !coin?.isTriggerTrading).map(coin => coin?.value));
            upgradingCoin = G.players[ctx.currentPlayer].boardCoins.find(coin => coin?.value === minCoinValue);
            upgradingCoinId = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin?.value === upgradingCoin.value);
        }
    } else if (type === "hand") {
        const handCoinPosition = G.players[ctx.currentPlayer].boardCoins
            .filter((coin, index) => coin === null && index <= upgradingCoinId).length;
        upgradingCoin = G.players[ctx.currentPlayer].handCoins.filter(coin => coin !== null)[handCoinPosition - 1];
        upgradingCoinId = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin.value === upgradingCoin.value &&
            coin.isInitial === isInitial);
    } else {
        upgradingCoin = G.players[ctx.currentPlayer].boardCoins[upgradingCoinId];
    }
    const buffValue = G.players[ctx.currentPlayer].buffs?.["upgradeCoin"] ?? 0,
        newValue = upgradingCoin.value + config.value + buffValue;
    let upgradedCoin = null;
    if (G.marketCoins.length) {
        if (newValue > G.marketCoins[G.marketCoins.length - 1].value) {
            upgradedCoin = G.marketCoins[G.marketCoins.length - 1];
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                if (G.marketCoins[i].value < newValue) {
                    upgradedCoin = G.marketCoins[i];
                } else if (G.marketCoins[i].value >= newValue) {
                    upgradedCoin = G.marketCoins[i];
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    AddDataToLog(G, "game", `Начато обновление монеты с ценностью '${upgradingCoin.value}' на +${config.value}.`);
    if (upgradedCoin !== null) {
        AddDataToLog(G, "private", `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' 
        с initial '${isInitial}' с ценностью '${upgradingCoin.value}' на +${config.value} с новым значением '${newValue}' 
        с итоговым значением '${upgradedCoin.value}'.`);
        let handCoinIndex = -1;
        if (G.players[ctx.currentPlayer].boardCoins[upgradingCoinId] === null) {
            handCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin?.value === upgradingCoin.value);
        } else {
            G.players[ctx.currentPlayer].boardCoins[upgradingCoinId] = null;
        }
        if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline") {
            const emptyCoinIndex = G.players[ctx.currentPlayer].handCoins.indexOf(null);
            G.players[ctx.currentPlayer].handCoins[emptyCoinIndex] = upgradedCoin;
        } else {
            if (handCoinIndex === -1) {
                G.players[ctx.currentPlayer].boardCoins[upgradingCoinId] = upgradedCoin;
                AddDataToLog(G, "public", `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока 
                ${G.players[ctx.currentPlayer].nickname}.`);
            } else {
                G.players[ctx.currentPlayer].handCoins[handCoinIndex] = upgradedCoin;
                AddDataToLog(G, "public", `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока 
                ${G.players[ctx.currentPlayer].nickname}.`);
            }
        }
        if (!upgradingCoin.isInitial) {
            let returningIndex = null;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                if (G.marketCoins[i].value > upgradingCoin.value) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, upgradingCoin);
            AddDataToLog(G, "game", `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
        }
    } else {
        AddDataToLog(G, "private", "На рынке монет нет доступных монет для обмена.");
    }
};

/**
 * Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.
 * Применения:
 * 1) В начале фазы выставления монет.
 *
 * @param G
 * @constructor
 */
export const ReturnCoinsToPlayerHands = (G) => {
    for (let i = 0; i < G.players.length; i++) {
        for (let j = 0; j < G.players[i].boardCoins.length; j++) {
            const isCoinReturned = ReturnCoinToPlayerHands(G.players[i], j);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, "game", "Все монеты вернулись в руки игроков.");
};

/**
 * Возвращает указанную монету в руку игрока, если она ещё не в руке.
 * Применения:
 * 1) При возврате всех монет в руку в начале фазы выставления монет.
 * 2) При возврате монет в руку, когда взят герой Улина.
 *
 * @param player Игрок.
 * @param coinId Id монеты.
 * @returns {boolean} Вернулась ли монета в руку.
 * @constructor
 */
export const ReturnCoinToPlayerHands = (player, coinId) => {
    const tempCoinId = player.handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    player.handCoins[tempCoinId] = player.boardCoins[coinId];
    player.boardCoins[coinId] = null;
    return true;
}
