import { DiscardCardFromTavern } from "./Card";
import { AddDataToLog } from "./Logging";
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
 * @param G
 * @param ctx
 * @constructor
 */
export var CheckIfCurrentTavernEmpty = function (G, ctx) {
    var isCurrentTavernEmpty = false;
    if (ctx.numPlayers === 2 && G.taverns[G.currentTavern]
        .filter(function (card) { return card !== null; }).length === 1) {
        var discardCardIndex = G.taverns[G.currentTavern]
            .findIndex(function (card) { return card !== null; });
        if (discardCardIndex !== -1) {
            var isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
            if (isCardDiscarded) {
                isCurrentTavernEmpty = true;
            }
            // fixme else Error Card not discarded???
        }
    }
    else {
        isCurrentTavernEmpty = G.taverns[G.currentTavern].every(function (card) { return card === null; });
    }
    if (isCurrentTavernEmpty) {
        AddDataToLog(G, "game" /* GAME */, "\u0422\u0430\u0432\u0435\u0440\u043D\u0430 ".concat(tavernsConfig[G.currentTavern].name, " \u043F\u0443\u0441\u0442\u0430\u044F."));
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
 * @param G
 * @constructor
 */
export var RefillTaverns = function (G) {
    for (var i = 0; i < G.tavernsNum; i++) {
        G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        AddDataToLog(G, "game" /* GAME */, "Все таверны заполнены новыми картами.");
    }
};
