import { AddDataToLog } from "./Logging";
import { LogTypes } from "./typescript/enums";
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
export const CheckIfCurrentTavernEmpty = (G) => G.taverns[G.currentTavern].every((card) => card === null);
/**
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из кэмпа.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.</li>
 * <li>Игрок пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G, discardCardIndex) => {
    const discardedCard = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern].splice(discardCardIndex, 1, null);
        AddDataToLog(G, LogTypes.GAME, `Карта '${discardedCard.name}' из таверны ${tavernsConfig[G.currentTavern].name} убрана в сброс.`);
        return true;
    }
    throw new Error(`Не удалось сбросить лишнюю карту из таверны.`);
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
    for (let i = 0; i < G.tavernsNum; i++) {
        const refillDeck = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        if (refillDeck.length === G.drawSize) {
            G.taverns[i].splice(0, G.taverns[i].length, ...refillDeck);
            AddDataToLog(G, LogTypes.GAME, `Таверна ${tavernsConfig[i].name} заполнена новыми картами.`);
        }
        else {
            throw new Error(`Таверна ${tavernsConfig[i].name} не заполнена новыми картами из-за их нехватки в колоде.`);
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Все таверны заполнены новыми картами.`);
};
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
//# sourceMappingURL=Tavern.js.map