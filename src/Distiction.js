"use strict";
exports.__esModule = true;
exports.CheckCurrentSuitDistinction = exports.CheckDistinction = void 0;
var Logging_1 = require("./Logging");
var SuitData_1 = require("./data/SuitData");
var SuitHelpers_1 = require("./helpers/SuitHelpers");
var ScoreHelpers_1 = require("./helpers/ScoreHelpers");
/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
var CheckDistinction = function (G, ctx) {
    var i = 0;
    (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "Преимущество по фракциям в конце эпохи:");
    for (var suit in SuitData_1.suitsConfig) {
        var result = (0, exports.CheckCurrentSuitDistinction)(G, ctx, suit);
        G.distinctions[i] = result;
        if (suit === "explorer" && result === undefined) {
            var discardedCard = G.decks[1].splice(0, 1)[0];
            (0, Logging_1.AddDataToLog)(G, "private" /* PRIVATE */, "\u0418\u0437-\u0437\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \n            \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u0430 \u043A\u0430\u0440\u0442\u0430: ".concat(discardedCard.name, "."));
        }
        i++;
    }
};
exports.CheckDistinction = CheckDistinction;
/**
 * <h3>Высчитывает наличие игрока с преимуществом по шевронам конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется в подсчёте преимуществ по количеству шевронов фракций в конце эпохи.</li>
 * <li>Применяется при подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitName Фракция.
 * @constructor
 */
var CheckCurrentSuitDistinction = function (G, ctx, suitName) {
    var playersRanks = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        var suitIndex = (0, SuitHelpers_1.GetSuitIndexByName)(suitName);
        playersRanks.push(G.publicPlayers[i].cards[suitIndex].reduce(ScoreHelpers_1.TotalRank, 0));
    }
    var max = Math.max.apply(Math, playersRanks), maxPlayers = playersRanks.filter(function (count) { return count === max; });
    if (maxPlayers.length === 1) {
        var playerDistinctionIndex = playersRanks.indexOf(maxPlayers[0]);
        (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ".concat(SuitData_1.suitsConfig[suitName].suitName, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \n        \u0438\u0433\u0440\u043E\u043A: ").concat(G.publicPlayers[playerDistinctionIndex].nickname, "."));
        return playerDistinctionIndex;
    }
    else {
        (0, Logging_1.AddDataToLog)(G, "public" /* PUBLIC */, "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ".concat(SuitData_1.suitsConfig[suitName].suitName, " \u043D\u0438\u043A\u0442\u043E \n        \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B."));
        return undefined;
    }
};
exports.CheckCurrentSuitDistinction = CheckCurrentSuitDistinction;
