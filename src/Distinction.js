import { AddDataToLog, LogTypes } from "./Logging";
import { SuitNames, suitsConfig } from "./data/SuitData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var CheckDistinction = function (G, ctx) {
    var i = 0;
    AddDataToLog(G, LogTypes.GAME, "Преимущество по фракциям в конце эпохи:");
    for (var suit in suitsConfig) {
        var result = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (suit === SuitNames.EXPLORER && result === null) {
            var discardedCard = G.decks[1].splice(0, 1)[0];
            AddDataToLog(G, LogTypes.PRIVATE, "\u0418\u0437-\u0437\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \n            \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u0430 \u043A\u0430\u0440\u0442\u0430: ".concat(discardedCard.name, "."));
        }
        i++;
    }
};
/**
 * <h3>Высчитывает наличие игрока с преимуществом по шевронам конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется в подсчёте преимуществ по количеству шевронов фракций в конце эпохи.</li>
 * <li>Применяется при подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {string} suitName Фракция.
 * @returns {number | undefined} Индекс игрока с преимуществом по фракции, если имеется.
 * @constructor
 */
export var CheckCurrentSuitDistinction = function (G, ctx, suitName) {
    var playersRanks = [], suitIndex = GetSuitIndexByName(suitName);
    for (var i = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suitIndex].reduce(TotalRank, 0));
    }
    var max = Math.max.apply(Math, playersRanks), maxPlayers = playersRanks.filter(function (count) { return count === max; });
    if (maxPlayers.length === 1) {
        var playerDistinctionIndex = playersRanks.indexOf(maxPlayers[0]);
        AddDataToLog(G, LogTypes.PUBLIC, "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ".concat(suitsConfig[suitName].suitName, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \n        \u0438\u0433\u0440\u043E\u043A: ").concat(G.publicPlayers[playerDistinctionIndex].nickname, "."));
        return playerDistinctionIndex;
    }
    else {
        AddDataToLog(G, LogTypes.PUBLIC, "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ".concat(suitsConfig[suitName].suitName, " \u043D\u0438\u043A\u0442\u043E \n        \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B."));
        return null;
    }
};
