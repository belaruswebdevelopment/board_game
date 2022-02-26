import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
import { DeleteBuffFromPlayer } from "./helpers/ActionHelpers";
import { AddDataToLog } from "./Logging";
import { BuffNames, LogTypes, Stages } from "./typescript/enums";
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
 * <li>Вызывается при отображении рынка монет.</li>
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
 * <h3>Проверка, является ли объект монетой или пустым объектом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функции улучшения монеты.</li>
 * </ol>
 *
 * @param obj Пустой объект или монета.
 * @returns Является ли объект монетой, а не пустым объектом.
 */
export const isCoin = (coin) => coin !== null && coin.value !== undefined;
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
 * <h3>Обмен монеты с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг обмена.
 * @param value Значение увеличения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Является ли обменная монета базовой.
 */
export const UpgradeCoin = (G, ctx, value, upgradingCoinId, type, isInitial) => {
    var _a;
    // TODO add LogTypes.ERROR logging
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    // TODO Split into different functions!
    let upgradingCoin = {}, coin;
    if (player.buffs.find((buff) => buff.upgradeNextCoin !== undefined) !== undefined) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.UpgradeNextCoin);
    }
    if (player.buffs.find((buff) => buff.coin !== undefined) !== undefined) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.Coin);
        // TODO Upgrade isInitial min coin or not or User must choose!?
        if (player.buffs.find((buff) => buff.everyTurn !== undefined) !== undefined) {
            const allCoins = [], allHandCoins = player.handCoins.filter((coin) => isCoin(coin));
            for (let i = 0; i < player.boardCoins.length; i++) {
                if (player.boardCoins[i] === null) {
                    allCoins.push(allHandCoins.splice(0, 1)[0]);
                }
                else {
                    allCoins.push(player.boardCoins[i]);
                }
            }
            const minCoinValue = Math.min(...allCoins.filter((coin) => isCoin(coin) && !coin.isTriggerTrading).map((coin) => coin.value)), upgradingCoinInitial = allCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue && coin.isInitial);
            if (isCoin(upgradingCoinInitial)) {
                upgradingCoin = upgradingCoinInitial;
            }
            else {
                coin = allCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue && !coin.isInitial);
                if (isCoin(coin)) {
                    upgradingCoin = coin;
                }
            }
            upgradingCoinId = allCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
        }
        else {
            const minCoinValue = Math.min(...player.boardCoins.filter((coin) => isCoin(coin) && !coin.isTriggerTrading).map((coin) => coin.value));
            coin = player.boardCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue);
            if (isCoin(coin)) {
                upgradingCoin = coin;
                upgradingCoinId = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
            }
        }
    }
    if (upgradingCoinId !== undefined && upgradingCoinId !== -1 && type !== undefined && isInitial !== undefined) {
        if (type === `hand`) {
            const handCoinPosition = player.boardCoins.filter((coin, index) => coin === null && upgradingCoinId !== undefined && index <= upgradingCoinId).length;
            coin = player.handCoins.filter((coin) => isCoin(coin))[handCoinPosition - 1];
            if (isCoin(coin)) {
                upgradingCoin = coin;
                upgradingCoinId = player.handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === isInitial);
            }
        }
        else {
            coin = player.boardCoins[upgradingCoinId];
            if (isCoin(coin)) {
                upgradingCoin = coin;
            }
        }
        if (isCoin(upgradingCoin)) {
            const buffValue = ((_a = player.buffs.find((buff) => buff.upgradeCoin !== undefined)) === null || _a === void 0 ? void 0 : _a.upgradeCoin) !== undefined ? 2 : 0, newValue = upgradingCoin.value + value + buffValue;
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
            // TODO Check coin returned to public or private player's coins
            AddDataToLog(G, LogTypes.GAME, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на +${value}.`);
            if (upgradedCoin !== null) {
                AddDataToLog(G, LogTypes.PRIVATE, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${isInitial}' с ценностью '${upgradingCoin.value}' на +${value} с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
                let handCoinIndex = -1;
                if (player.boardCoins[upgradingCoinId] === null) {
                    handCoinIndex = player.handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
                }
                else {
                    player.boardCoins[upgradingCoinId] = null;
                }
                if ((ctx.activePlayers !== null
                    && ctx.activePlayers[Number(ctx.currentPlayer)]) === Stages.PlaceTradingCoinsUline) {
                    const emptyCoinIndex = player.handCoins.indexOf(null);
                    player.handCoins[emptyCoinIndex] = upgradedCoin;
                    AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока ${player.nickname}.`);
                }
                else {
                    if (handCoinIndex === -1) {
                        player.boardCoins[upgradingCoinId] = upgradedCoin;
                        AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока ${player.nickname}.`);
                    }
                    else {
                        player.handCoins[handCoinIndex] = upgradedCoin;
                        AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока ${player.nickname}.`);
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
    }
    else {
        // TODO Add error logging!
    }
};
//# sourceMappingURL=Coin.js.map