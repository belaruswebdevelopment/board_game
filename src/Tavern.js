import {DiscardCardFromTavern} from "./Card";
import {AddDataToLog} from "./Logging";

/**
 * Конфиг таверн.
 * Применения:
 * 1) Применяется для описания таверн (+для ключей).
 *
 * @type {{"0": {name: string}, "1": {name: string}, "2": {name: string}}} Таверна.
 */
export const tavernsConfig = {
    "0": {
        name: "«Весёлый гоблин»",
    },
    "1": {
        name: "«Парящий дракон»",
    },
    "2": {
        name: "«Гарцующий конь»",
    },
};

/**
 * Проверяет все ли карты выбраны игроками в текущей таверне.
 * Применения:
 * 1) Проверяет после каждого выбора карты дворфа из таверны.
 * 2) Проверяет после каждого выбора карты улучшения монеты из таверны.
 * 3) Проверяет после каждого выбора карты кэмпа из таверны.
 *
 * @param G
 * @param ctx
 * @returns {boolean} Пуста ли текущая таверна.
 * @constructor
 */
export const CheckCurrentTavernEmpty = (G, ctx) => {
    if (ctx.numPlayers === 2) {
        if (G.taverns[G.currentTavern].filter(card => card !== null).length === 1) {
            const discardCardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
            DiscardCardFromTavern(G, discardCardIndex);
            return true;
        }
        return false;
    }
    const isCurrentTavernEmpty = G.taverns[G.currentTavern].every(card => card === null);
    if (isCurrentTavernEmpty) {
        AddDataToLog(G, "game", `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
    }
    return isCurrentTavernEmpty;
}

/**
 * Автоматически заполняет все таверны картами текущей эпохи.
 * Применения:
 * 1) Происходит когда начинается новый раунд.
 * 2) Происходит когда начинается новая эпоха.
 *
 * @param G
 * @constructor
 */
export const RefillTaverns = (G) => {
    for (let i = 0; i < G.tavernsNum; i++) {
        G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        AddDataToLog(G, "game", "Все таверны заполнены новыми картами.");
    }
};
