import { isInitialPlayerCoinsConfigNotMarket } from "./data/CoinData";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./helpers/BuffHelpers";
import { AddDataToLog } from "./Logging";
import { BuffNames, CoinTypes, LogTypes, Stages } from "./typescript/enums";
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
        const config = coinConfig[i];
        if (config === undefined) {
            throw new Error(`В массиве конфига монет отсутствует монета ${i}.`);
        }
        const count = options.players !== undefined
            && !isInitialPlayerCoinsConfigNotMarket(config) ? config.count()[options.players] : 1;
        if (count === undefined) {
            throw new Error(`В конфиге монет для монеты ${i} отсутствует количество нужных монет для количества игроков - ${options.players}.`);
        }
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
        const marketCoin = G.marketCoinsUnique[i];
        if (marketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
        }
        const temp = marketCoin.value;
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
 * @param coin Пустой объект или монета.
 * @returns Является ли объект монетой, а не пустым объектом.
 */
export const IsCoin = (coin) => coin !== null && coin.value !== undefined;
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
        const player = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
        for (let j = 0; j < player.boardCoins.length; j++) {
            const isCoinReturned = ReturnCoinToPlayerHands(player, j);
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
    const coin = player.boardCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${coinId}.`);
    }
    player.handCoins[tempCoinId] = coin;
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
 * @param value Значение увеличения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Является ли обменная монета базовой.
 */
export const UpgradeCoin = (G, ctx, value, upgradingCoinId, type, isInitial) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    // TODO Split into different functions!?
    let upgradingCoin = {}, coin;
    if (CheckPlayerHasBuff(player, BuffNames.Coin)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.Coin);
        // TODO Upgrade isInitial min coin or not or User must choose!?
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
            const allCoins = [], allHandCoins = player.handCoins.filter((coin) => IsCoin(coin));
            for (let i = 0; i < player.boardCoins.length; i++) {
                if (player.boardCoins[i] === null) {
                    const handCoin = allHandCoins.splice(0, 1)[0];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${i}.`);
                    }
                    allCoins.push(handCoin);
                }
                else {
                    const boardCoin = player.boardCoins[i];
                    if (boardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
                    }
                    allCoins.push(boardCoin);
                }
            }
            const minCoinValue = Math.min(...allCoins.filter((coin) => IsCoin(coin) && !coin.isTriggerTrading).map((coin) => coin.value)), upgradingCoinInitial = allCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue && coin.isInitial);
            if (IsCoin(upgradingCoinInitial)) {
                upgradingCoin = upgradingCoinInitial;
            }
            else {
                coin = allCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue && !coin.isInitial);
                if (IsCoin(coin)) {
                    upgradingCoin = coin;
                }
            }
            upgradingCoinId = allCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
            if (player.boardCoins[upgradingCoinId] === null) {
                type = CoinTypes.Hand;
            }
            else {
                type = CoinTypes.Board;
            }
        }
        else {
            const minCoinValue = Math.min(...player.boardCoins.filter((coin) => IsCoin(coin) && !coin.isTriggerTrading).map((coin) => coin.value));
            coin = player.boardCoins.find((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue);
            if (IsCoin(coin)) {
                upgradingCoin = coin;
                upgradingCoinId = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value);
                type = CoinTypes.Board;
            }
        }
        if (IsCoin(upgradingCoin)) {
            isInitial = upgradingCoin.isInitial;
        }
    }
    if (upgradingCoinId === undefined || upgradingCoinId === -1 || type === undefined || isInitial === undefined) {
        throw new Error(`Отсутствует обязательный параметр 'upgradingCoinId' и/или 'type' и/или 'isInitial'.`);
    }
    if (!IsCoin(upgradingCoin)) {
        if (type === CoinTypes.Hand) {
            const handCoinPosition = player.boardCoins.filter((coin, index) => coin === null && upgradingCoinId !== undefined && index <= upgradingCoinId).length;
            coin = player.handCoins.filter((coin) => IsCoin(coin))[handCoinPosition - 1];
            if (IsCoin(coin)) {
                upgradingCoin = coin;
                upgradingCoinId = player.handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === isInitial);
            }
        }
        else {
            coin = player.boardCoins[upgradingCoinId];
            if (IsCoin(coin)) {
                upgradingCoin = coin;
            }
        }
    }
    if (IsCoin(upgradingCoin)) {
        const buffValue = CheckPlayerHasBuff(player, BuffNames.UpgradeCoin) ? 2 : 0, newValue = upgradingCoin.value + value + buffValue;
        let upgradedCoin = null;
        if (G.marketCoins.length) {
            const lastMarketCoin = G.marketCoins[G.marketCoins.length - 1];
            if (lastMarketCoin === undefined) {
                throw new Error(`В массиве монет рынка отсутствует последняя монета.`);
            }
            if (newValue > lastMarketCoin.value) {
                upgradedCoin = lastMarketCoin;
                G.marketCoins.splice(G.marketCoins.length - 1, 1);
            }
            else {
                for (let i = 0; i < G.marketCoins.length; i++) {
                    const marketCoin = G.marketCoins[i];
                    if (marketCoin === undefined) {
                        throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
                    }
                    if (marketCoin.value < newValue) {
                        upgradedCoin = marketCoin;
                    }
                    else if (marketCoin.value >= newValue) {
                        upgradedCoin = marketCoin;
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
            if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === Stages.PlaceTradingCoinsUline) {
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
                    const marketCoinReturn = G.marketCoins[i];
                    if (marketCoinReturn === undefined) {
                        throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
                    }
                    if (marketCoinReturn.value > upgradingCoin.value) {
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
//# sourceMappingURL=Coin.js.map