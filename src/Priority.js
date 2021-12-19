import { AddDataToLog, LogTypes } from "./Logging";
/**
 * <h3>Создание кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в массиве всех кристаллов.</li>
 * <li>Используется при раздаче кристаллов игрокам.</li>
 * <li>Используется при выдаче преимущества в виде кристалла горняков.</li>
 * </ol>
 *
 * @param value Значение кристалла.
 * @param isExchangeable Является ли кристалл обменным.
 * @returns Кристалл.
 */
export var CreatePriority = function (_a) {
    var _b = _a === void 0 ? {} : _a, value = _b.value, _c = _b.isExchangeable, isExchangeable = _c === void 0 ? true : _c;
    return ({
        value: value,
        isExchangeable: isExchangeable,
    });
};
/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
var priorities = [
    CreatePriority({ value: 1 }),
    CreatePriority({ value: 2 }),
    CreatePriority({ value: 3 }),
    CreatePriority({ value: 4 }),
    CreatePriority({ value: 5 }),
];
/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 */
export var prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};
/**
 * <h3>Генерирует кристаллы из конфига кристаллов по количеству игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param numPlayers Количество игроков.
 * @returns Массив базовых кристаллов.
 */
export var GeneratePrioritiesForPlayerNumbers = function (numPlayers) {
    return prioritiesConfig[numPlayers].map(function (priority) { return priority; });
};
/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 */
export var ChangePlayersPriorities = function (G) {
    var tempPriorities = [];
    for (var i = 0; i < G.exchangeOrder.length; i++) {
        var exchangeOrder = G.exchangeOrder[i];
        if (exchangeOrder !== undefined) {
            tempPriorities[i] = G.publicPlayers[exchangeOrder].priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypes.GAME, "\u041E\u0431\u043C\u0435\u043D \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B\u0430\u043C\u0438 \u043C\u0435\u0436\u0434\u0443 \u0438\u0433\u0440\u043E\u043A\u0430\u043C\u0438:");
        for (var i = 0; i < G.exchangeOrder.length; i++) {
            var tempPriority = tempPriorities[i];
            if (tempPriority !== undefined && G.publicPlayers[i].priority.value !== tempPriority.value) {
                G.publicPlayers[i].priority = tempPriority;
                AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[i].nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u0441 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043E\u043C ").concat(tempPriority.value, "."));
            }
        }
    }
};
/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id выбранного игрока.
 * @returns Имеет ли игрок наименьший кристалл.
 */
export var HasLowestPriority = function (G, playerId) {
    var tempPriorities = G.publicPlayers.map(function (player) { return player.priority.value; }), minPriority = Math.min.apply(Math, tempPriorities), priority = G.publicPlayers[playerId].priority;
    return priority.value === minPriority;
};
