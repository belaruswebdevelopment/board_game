import { AddDataToLog, LogTypes } from "./Logging";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "./helpers/StackHelpers";
import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
import { UpgradeCoinAction } from "./actions/Actions";
/**
 * <h3>Проверка, является ли объект монетой или пустым объектом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param obj Пустой объект или монета.
 * @returns Является ли объект монетой, а не пустым объектом.
 */
const isCoin = (obj) => obj.value !== undefined;
/**
 * <h3>Создание всех монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается при создании всех базовых монет игроков.</li>
 * <li>Вызывается при создании всех монет рынка.</li>
 * </ol>
 *
 * @param coinConfig Конфиг монет.
 * @param options Опции создания монет.
 * @returns Массив всех монет.
 */
export const BuildCoins = (coinConfig, options) => {
    const coins = [];
    for (let i = 0; i < coinConfig.length; i++) {
        const config = coinConfig[i], count = options.players !== undefined && !isInitialPlayerCoinsConfigNotMarket(config) ?
            config.count()[options.players] : 1;
        if (options.players !== undefined && options.count !== undefined) {
            options.count.push({
                value: config.value,
                isInitial: false,
                isTriggerTrading: false,
            });
        }
        for (let c = 0; c < count; c++) {
            coins.push(CreateCoin({
                value: config.value,
                isInitial: options.isInitial,
                isTriggerTrading: isInitialPlayerCoinsConfigNotMarket(config) ? config.isTriggerTrading : false,
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
 * @returns Количество всех монет на рынке (с повторами).
 */
export const CountMarketCoins = (G) => {
    const repeated = {};
    for (let i = 0; i < G.marketCoinsUnique.length; i++) {
        const temp = G.marketCoinsUnique[i].value;
        repeated[temp] = G.marketCoins.filter((coin) => coin.value === temp).length;
    }
    return repeated;
};
/**
 * <h3>Создание монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех монет при инициализации игры.</li>
 * <li>Вызывается при создании монеты преимущества по охотникам.</li>
 * </ol>
 *.
 * @param value Значение.
 * @param isInitial Является ли базовой.
 * @param isTriggerTrading Активирует ли обмен монет.
 * @returns Монета.
 */
export const CreateCoin = ({ value, isInitial = false, isTriggerTrading = false, } = {}) => ({
    value,
    isInitial,
    isTriggerTrading,
});
/**
 * <h3>Возвращает все монеты со стола в руки игроков в начале фазы выставления монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В начале фазы выставления монет.</li>
 * </ol>
 *
 * @param G
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
    AddDataToLog(G, LogTypes.GAME, `Все монеты вернулись в руки игроков.`);
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
 * @returns Вернулась ли монета в руку.
 */
export const ReturnCoinToPlayerHands = (player, coinId) => {
    const tempCoinId = player.handCoins.indexOf(null);
    if (tempCoinId === -1) {
        return false;
    }
    player.handCoins[tempCoinId] = player.boardCoins[coinId];
    player.boardCoins[coinId] = null;
    return true;
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
 */
export const Trading = (G, ctx, tradingCoins) => {
    const coinsValues = tradingCoins.map((coin) => coin.value), coinsMaxValue = Math.max(...coinsValues), coinsMinValue = Math.min(...coinsValues);
    let stack, upgradingCoinId, upgradingCoin, coinMaxIndex = 0, coinMinIndex = 0;
    AddDataToLog(G, LogTypes.GAME, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') игрока ${G.publicPlayers[Number(ctx.currentPlayer)].nickname}.`);
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
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin === `min`) {
        stack = [
            {
                action: UpgradeCoinAction.name,
                config: {
                    number: 1,
                    value: coinsMaxValue,
                    isTrading: true,
                },
            },
        ];
        upgradingCoinId = G.tavernsNum + coinMinIndex;
        upgradingCoin = tradingCoins[coinMinIndex];
    }
    else {
        stack = [
            {
                action: UpgradeCoinAction.name,
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
    StartActionFromStackOrEndActions(G, ctx, false, upgradingCoinId, `board`, upgradingCoin.isInitial);
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
 */
export const UpgradeCoin = (G, ctx, config, upgradingCoinId, type, isInitial) => {
    // todo add LogTypes.ERROR logging
    // todo Split into different functions!
    let upgradingCoin = {}, coin;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeNextCoin;
    }
    if ((config === null || config === void 0 ? void 0 : config.coin) === `min`) {
        // todo Upgrade isInitial min coin or not or User must choose!?
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === `Uline`) {
            const allCoins = [], allHandCoins = G.publicPlayers[Number(ctx.currentPlayer)]
                .handCoins.filter((coin) => coin !== null);
            for (let i = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i] === null) {
                    allCoins.push(allHandCoins.splice(0, 1)[0]);
                }
                else {
                    allCoins.push(G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[i]);
                }
            }
            const minCoinValue = Math.min(...allCoins
                .filter((coin) => coin !== null && !coin.isTriggerTrading)
                .map((coin) => coin.value)), upgradingCoinInitial = allCoins
                .find((coin) => coin.value === minCoinValue && coin.isInitial);
            if (upgradingCoinInitial !== null && upgradingCoinInitial !== undefined) {
                upgradingCoin = upgradingCoinInitial;
            }
            else {
                coin = allCoins.find((coin) => coin.value === minCoinValue && !coin.isInitial);
                if (coin !== null && coin !== undefined) {
                    upgradingCoin = coin;
                }
            }
            upgradingCoinId = allCoins.findIndex((coin) => isCoin(upgradingCoin) && coin.value === upgradingCoin.value);
        }
        else {
            const minCoinValue = Math.min(...G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                .filter((coin) => coin !== null && !coin.isTriggerTrading)
                .map((coin) => coin.value));
            coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                .find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue);
            if (coin !== null && coin !== undefined) {
                upgradingCoin = coin;
                upgradingCoinId = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                    .findIndex((coin) => isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
            }
        }
    }
    else if (type === "hand") {
        const handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin, index) => coin === null && index <= upgradingCoinId).length;
        coin = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin) => coin !== null)[handCoinPosition - 1];
        if (coin !== null && coin !== undefined) {
            upgradingCoin = coin;
            upgradingCoinId = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
                .findIndex((coin) => isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === isInitial);
        }
    }
    else {
        coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId];
        if (coin !== null && coin !== undefined) {
            upgradingCoin = coin;
        }
    }
    if (isCoin(upgradingCoin)) {
        const buffValue = G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeCoin ?
            G.publicPlayers[Number(ctx.currentPlayer)].buffs.upgradeCoin : 0;
        let newValue = 0;
        if (config.value !== undefined) {
            newValue = upgradingCoin.value + config.value + buffValue;
        }
        let upgradedCoin = null;
        if (G.marketCoins.length) {
            if (newValue > G.marketCoins[G.marketCoins.length - 1].value) {
                upgradedCoin = G.marketCoins[G.marketCoins.length - 1];
                G.marketCoins.splice(G.marketCoins.length - 1, 1);
            }
            else {
                for (let i = 0; i < G.marketCoins.length; i++) {
                    if (G.marketCoins[i].value < newValue) {
                        upgradedCoin = G.marketCoins[i];
                    }
                    else if (G.marketCoins[i].value >= newValue) {
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
        AddDataToLog(G, LogTypes.GAME, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на +${config.value}.`);
        if (upgradedCoin !== null) {
            AddDataToLog(G, LogTypes.PRIVATE, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${isInitial}' с ценностью '${upgradingCoin.value}' на +${config.value} с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
            let handCoinIndex = -1;
            if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] === null) {
                handCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
                    .findIndex((coin) => isCoin(upgradingCoin) && (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
            }
            else {
                G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] = null;
            }
            if ((ctx.activePlayers !== null
                && ctx.activePlayers[Number(ctx.currentPlayer)]) === `placeTradingCoinsUline`) {
                const emptyCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.indexOf(null);
                G.publicPlayers[Number(ctx.currentPlayer)].handCoins[emptyCoinIndex] = upgradedCoin;
            }
            else {
                if (handCoinIndex === -1) {
                    G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[upgradingCoinId] = upgradedCoin;
                    AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока ${G.publicPlayers[Number(ctx.currentPlayer)].nickname}.`);
                }
                else {
                    G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinIndex] = upgradedCoin;
                    AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока ${G.publicPlayers[Number(ctx.currentPlayer)].nickname}.`);
                }
            }
            if (!upgradingCoin.isInitial) {
                let returningIndex = 0;
                for (let i = 0; i < G.marketCoins.length; i++) {
                    returningIndex = i;
                    if (G.marketCoins[i].value > upgradingCoin.value) {
                        break;
                    }
                }
                G.marketCoins.splice(returningIndex, 0, upgradingCoin);
                AddDataToLog(G, LogTypes.GAME, `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
            }
        }
        else {
            AddDataToLog(G, LogTypes.PRIVATE, `На рынке монет нет доступных монет для обмена.`);
        }
    }
};
