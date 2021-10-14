import {AddDataToLog} from "./Logging";
import {AddActionsToStack, StartActionFromStackOrEndActions} from "./helpers/StackHelpers";

/**
 * <h3>Создание монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет при инициализации игры.</li>
 * <li>Вызывается при создании монеты преимущества по охотникам.</li>
 * </ol>
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
 * <h3>Создание всех монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * <li>Вызывается при создании всех монет рынка.</li>
 * </ol>
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
            coinValue = (coinConfig[i] && coinConfig[i].value) !== undefined ? coinConfig[i].value : coinConfig[i],
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
 * <h3>Вычисляет количество монет каждого номинала на рынке монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при отрисовке рынка монет.</li>
 * </ol>
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
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
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
    AddDataToLog(G, "game", `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') 
    игрока ${G.publicPlayers[ctx.currentPlayer].nickname}.`);
    // TODO trading isInitial first or playerChoose?
    for (let i = 0; i < tradingCoins.length; i++) {
        if (tradingCoins[i].value === coinsMaxValue) {
            coinMaxIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
        if (tradingCoins[i].value === coinsMinValue) {
            coinMinIndex = i;
            // if (tradingCoins[i].isInitial) {
            //     break;
            // }
        }
    }
    if (G.publicPlayers[ctx.currentPlayer].buffs["upgradeNextCoin"] === "min") {
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
 * <h3>Обмен монеты с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг обмена.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Является ли обменная монета базовой.
 * @constructor
 */
export const UpgradeCoin = (G, ctx, config, upgradingCoinId, type, isInitial) => {
    // todo Split into different functions!
    let upgradingCoin;
    if (G.publicPlayers[ctx.currentPlayer].buffs["upgradeNextCoin"]) {
        delete G.publicPlayers[ctx.currentPlayer].buffs["upgradeNextCoin"];
    }
    if ((config && config.coin) === "min") {
        // todo Upgrade isInitial min coin or not or User must choose!?
        if (G.publicPlayers[ctx.currentPlayer].buffs["everyTurn"] === "Uline") {
            const allCoins = [],
                allHandCoins = G.publicPlayers[ctx.currentPlayer].handCoins.filter(coin => coin !== null);
            for (let i = 0; i < G.publicPlayers[ctx.currentPlayer].boardCoins.length; i++) {
                if (G.publicPlayers[ctx.currentPlayer].boardCoins[i] === null) {
                    allCoins.push(allHandCoins.splice(0, 1)[0]);
                } else {
                    allCoins.push(G.publicPlayers[ctx.currentPlayer].boardCoins[i]);
                }
            }
            const minCoinValue = Math.min(...allCoins.filter(coin => coin !== null && !coin.isTriggerTrading)
                    .map(coin => coin.value)),
                upgradingCoinInitial = allCoins.find(coin => coin.value === minCoinValue && coin.isInitial);
            if (upgradingCoinInitial) {
                upgradingCoin = upgradingCoinInitial;
            } else {
                upgradingCoin = allCoins.find(coin => coin.value === minCoinValue && !coin.isInitial);
            }
            upgradingCoinId = allCoins.findIndex(coin => coin.value === upgradingCoin.value);
        } else {
            const minCoinValue = Math.min(...G.publicPlayers[ctx.currentPlayer].boardCoins
                .filter(coin => coin !== null && !coin.isTriggerTrading).map(coin => coin.value));
            upgradingCoin = G.publicPlayers[ctx.currentPlayer].boardCoins.find(coin => (coin && coin.value) === minCoinValue);
            upgradingCoinId = G.publicPlayers[ctx.currentPlayer].boardCoins.findIndex(coin => (coin && coin.value) ===
                upgradingCoin.value);
        }
    } else if (type === "hand") {
        const handCoinPosition = G.publicPlayers[ctx.currentPlayer].boardCoins
            .filter((coin, index) => coin === null && index <= upgradingCoinId).length;
        upgradingCoin = G.publicPlayers[ctx.currentPlayer].handCoins.filter(coin => coin !== null)[handCoinPosition - 1];
        upgradingCoinId = G.publicPlayers[ctx.currentPlayer].handCoins.findIndex(coin => (coin && coin.value) ===
            upgradingCoin.value && (coin && coin.isInitial) === isInitial);
    } else {
        upgradingCoin = G.publicPlayers[ctx.currentPlayer].boardCoins[upgradingCoinId];
    }
    const buffValue = G.publicPlayers[ctx.currentPlayer].buffs["upgradeCoin"] ?
            G.publicPlayers[ctx.currentPlayer].buffs["upgradeCoin"] : 0,
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
        if (G.publicPlayers[ctx.currentPlayer].boardCoins[upgradingCoinId] === null) {
            handCoinIndex = G.publicPlayers[ctx.currentPlayer].handCoins.findIndex(coin => (coin && coin.value) ===
                upgradingCoin.value);
        } else {
            G.publicPlayers[ctx.currentPlayer].boardCoins[upgradingCoinId] = null;
        }
        if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline") {
            const emptyCoinIndex = G.publicPlayers[ctx.currentPlayer].handCoins.indexOf(null);
            G.publicPlayers[ctx.currentPlayer].handCoins[emptyCoinIndex] = upgradedCoin;
        } else {
            if (handCoinIndex === -1) {
                G.publicPlayers[ctx.currentPlayer].boardCoins[upgradingCoinId] = upgradedCoin;
                AddDataToLog(G, "public", `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока 
                ${G.publicPlayers[ctx.currentPlayer].nickname}.`);
            } else {
                G.publicPlayers[ctx.currentPlayer].handCoins[handCoinIndex] = upgradedCoin;
                AddDataToLog(G, "public", `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока 
                ${G.publicPlayers[ctx.currentPlayer].nickname}.`);
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
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export const ReturnCoinsToPlayerHands = (G) => {
    for (let i = 0; i < G.publicPlayers.length; i++) {
        for (let j = 0; j < G.publicPlayers[i].boardCoins.length; j++) {
            const isCoinReturned = ReturnCoinToPlayerHands(G.publicPlayers[i], j);
            if (!isCoinReturned) {
                break;
            }
        }
    }
    AddDataToLog(G, "game", "Все монеты вернулись в руки игроков.");
};

/**
 * <h3>Возвращает указанную монету в руку игрока, если она ещё не в руке.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При возврате всех монет в руку в начале фазы выставления монет.</li>
 * <li>При возврате монет в руку, когда взят герой Улина.</li>
 * </ol>
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
