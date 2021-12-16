import { AddDataToLog, LogTypes } from "./Logging";
import { DiscardCardFromTavern } from "./Card";
/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для описания таверн (+для ключей).</li>
 * </ol>
 */
export var tavernsConfig = {
    0: {
        name: "«Весёлый гоблин»",
    },
    1: {
        name: "«Парящий дракон»",
    },
    2: {
        name: "«Гарцующий конь»",
    },
};
/**
 * <h3>Проверяет все ли карты выбраны игроками в текущей таверне.</h1>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяет после каждого выбора карты дворфа из таверны.</li>
 * <li>Проверяет после каждого выбора карты улучшения монеты из таверны.</li>
 * <li>Проверяет после каждого выбора карты кэмпа из таверны.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {boolean} Пуста ли текущая таверна.
 * @constructor
 */
export var CheckIfCurrentTavernEmpty = function (G, ctx) {
    var isCurrentTavernEmpty = false;
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        isCurrentTavernEmpty = G.taverns[G.currentTavern].every(function (card) { return card === null; });
        if (!isCurrentTavernEmpty) {
            var discardCardIndex = G.taverns[G.currentTavern].findIndex(function (card) { return card !== null; });
            if (discardCardIndex !== -1) {
                var isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
                if (isCardDiscarded) {
                    isCurrentTavernEmpty = true;
                }
            }
        }
        if (isCurrentTavernEmpty) {
            AddDataToLog(G, LogTypes.GAME, "\u0422\u0430\u0432\u0435\u0440\u043D\u0430 ".concat(tavernsConfig[G.currentTavern].name, " \u043F\u0443\u0441\u0442\u0430\u044F."));
        }
    }
    return isCurrentTavernEmpty;
};
/**
 * <h3>Автоматически заполняет все таверны картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале нового раунда.</li>
 * <li>Происходит при начале новой эпохе.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @constructor
 */
export var RefillTaverns = function (G) {
    var error = false;
    for (var i = 0; i < G.tavernsNum; i++) {
        var refillDeck = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        if (refillDeck.length === G.drawSize) {
            G.taverns[i] = refillDeck;
            AddDataToLog(G, LogTypes.GAME, "\u0422\u0430\u0432\u0435\u0440\u043D\u0430 ".concat(tavernsConfig[i].name, " \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0430 \u043D\u043E\u0432\u044B\u043C\u0438 \u043A\u0430\u0440\u0442\u0430\u043C\u0438."));
        }
        else {
            error = true;
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u0422\u0430\u0432\u0435\u0440\u043D\u0430 ".concat(tavernsConfig[i].name, " \u043D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0430 \u043D\u043E\u0432\u044B\u043C\u0438 \n            \u043A\u0430\u0440\u0442\u0430\u043C\u0438 \u0438\u0437-\u0437\u0430 \u0438\u0445 \u043D\u0435\u0445\u0432\u0430\u0442\u043A\u0438 \u0432 \u043A\u043E\u043B\u043E\u0434\u0435."));
        }
    }
    if (!error) {
        AddDataToLog(G, LogTypes.GAME, "Все таверны заполнены новыми картами.");
    }
};
