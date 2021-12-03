"use strict";
exports.__esModule = true;
exports.HasLowestPriority = exports.ChangePlayersPriorities = exports.BuildPriorities = exports.CreatePriority = void 0;
var Logging_1 = require("./Logging");
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
 * @constructor
 */
var CreatePriority = function (_a) {
    var _b = _a === void 0 ? {} : _a, value = _b.value, _c = _b.isExchangeable, isExchangeable = _c === void 0 ? true : _c;
    return ({
        value: value,
        isExchangeable: isExchangeable
    });
};
exports.CreatePriority = CreatePriority;
/**
 * <h3>Массив кристаллов приоритетов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге кристаллов.</li>
 * </ol>
 */
var priorities = [
    (0, exports.CreatePriority)({ value: 1 }),
    (0, exports.CreatePriority)({ value: 2 }),
    (0, exports.CreatePriority)({ value: 3 }),
    (0, exports.CreatePriority)({ value: 4 }),
    (0, exports.CreatePriority)({ value: 5 }),
];
/**
 * <h3>Конфиг кристаллов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при раздаче кристаллов всем игрокам (в зависимости от количества игроков).</li>
 * </ol>
 */
var prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5)
};
/**
 * <h3>Раздать случайные кристаллы по одному каждому игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Раздаёт кристаллы после создания всех игроков.</li>
 * </ol>
 *
 * @param numPlayers Количество игроков.
 * @param players Объект всех игроков.
 * @constructor
 */
var BuildPriorities = function (numPlayers, players) {
    var priorities = prioritiesConfig[numPlayers].map(function (priority) { return priority; });
    for (var i = 0; i < numPlayers; i++) {
        var randomPriorityIndex = Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i].priority = (0, exports.CreatePriority)(priority);
    }
};
exports.BuildPriorities = BuildPriorities;
/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
var ChangePlayersPriorities = function (G) {
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "Обмен кристаллами между игроками:");
    var tempPriorities = [];
    for (var i = 0; i < G.exchangeOrder.length; i++) {
        var priority = G.publicPlayers[G.exchangeOrder[i]].priority;
        if (priority) {
            tempPriorities[i] = priority;
        }
    }
    for (var i = 0; i < G.exchangeOrder.length; i++) {
        var priority = G.publicPlayers[i].priority;
        if (priority) {
            if (priority.value !== tempPriorities[i].value) {
                (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[i].nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u0441 \n                \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043E\u043C ").concat(tempPriorities[i].value, "."));
                G.publicPlayers[i].priority = tempPriorities[i];
            }
        }
    }
};
exports.ChangePlayersPriorities = ChangePlayersPriorities;
/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param playerId Id выбранного игрока.
 * @constructor
 */
var HasLowestPriority = function (G, playerId) {
    var tempPriorities = G.publicPlayers.map(function (player) { return player.priority.value; }), minPriority = Math.min.apply(Math, tempPriorities), priority = G.publicPlayers[playerId].priority;
    if (priority) {
        return priority.value === minPriority;
    }
    return false;
};
exports.HasLowestPriority = HasLowestPriority;
