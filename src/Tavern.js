import { DiscardCardFromTavern } from "./Card";
import { AddDataToLog, LogTypes } from "./Logging";
;
;
/**
 * <h3>Конфиг таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для описания таверн (+для ключей).</li>
 * </ol>
 */
export const tavernsConfig = {
    0: {
        name: `«Весёлый гоблин»`,
    },
    1: {
        name: `«Парящий дракон»`,
    },
    2: {
        name: `«Гарцующий конь»`,
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
 * @returns Пуста ли текущая таверна.
 */
export const CheckIfCurrentTavernEmpty = (G, ctx) => {
    let isCurrentTavernEmpty = false;
    if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        isCurrentTavernEmpty =
            G.taverns[G.currentTavern].every((card) => card === null);
        if (!isCurrentTavernEmpty) {
            const discardCardIndex = G.taverns[G.currentTavern].findIndex((card) => card !== null);
            if (discardCardIndex !== -1) {
                const isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
                if (isCardDiscarded) {
                    isCurrentTavernEmpty = true;
                }
            }
        }
        if (isCurrentTavernEmpty) {
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[G.currentTavern].name} пустая.`);
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
 * @param G
 */
export const RefillTaverns = (G) => {
    let error = false;
    for (let i = 0; i < G.tavernsNum; i++) {
        const refillDeck = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        if (refillDeck.length === G.drawSize) {
            G.taverns[i] = refillDeck;
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[i].name} заполнена новыми картами.`);
        }
        else {
            error = true;
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Таверна ${tavernsConfig[i].name} не заполнена новыми картами из-за их нехватки в колоде.`);
        }
    }
    if (!error) {
        AddDataToLog(G, LogTypes.GAME, `Все таверны заполнены новыми картами.`);
    }
};
