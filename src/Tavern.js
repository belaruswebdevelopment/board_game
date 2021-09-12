import {DiscardCardFromTavern} from "./Card";
import {AddDataToLog} from "./Logging";

/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для описания таверн (+для ключей).</li>
 * </ol>
 *
 * @type {{"0": {name: string}, "1": {name: string}, "2": {name: string}}} Таверна.
 */
export const tavernsConfig = {
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
 * @returns {boolean} Пуста ли текущая таверна.
 * @constructor
 */
export const CheckIfCurrentTavernEmpty = (G, ctx) => {
    let isCurrentTavernEmpty;
    if (ctx.numPlayers === 2 && G.taverns[G.currentTavern].filter(card => card !== null).length === 1) {
        const discardCardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
        DiscardCardFromTavern(G, discardCardIndex);
        isCurrentTavernEmpty = true;
    } else {
        isCurrentTavernEmpty = G.taverns[G.currentTavern].every(card => card === null);
    }
    if (isCurrentTavernEmpty) {
        AddDataToLog(G, "game", `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
    }
    return isCurrentTavernEmpty;
}

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
export const RefillTaverns = (G) => {
    for (let i = 0; i < G.tavernsNum; i++) {
        G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        AddDataToLog(G, "game", "Все таверны заполнены новыми картами.");
    }
};
