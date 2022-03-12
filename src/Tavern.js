import { AddDataToLog } from "./Logging";
import { LogTypes, TavernNames } from "./typescript/enums";
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
 * @returns Пуста ли текущая таверна.
 */
export const CheckIfCurrentTavernEmpty = (G) => {
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`Отсутствует текущая таверна.`);
    }
    return currentTavern.every((card) => card === null);
};
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
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`Отсутствует текущая таверна.`);
    }
    const discardedCard = currentTavern[discardCardIndex];
    if (discardedCard === undefined) {
        throw new Error(`В текущей таверне отсутствует карта ${discardCardIndex}.`);
    }
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        currentTavern.splice(discardCardIndex, 1, null);
        const currentTavernConfig = tavernsConfig[G.currentTavern];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны.`);
        }
        AddDataToLog(G, LogTypes.GAME, `Карта '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
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
        const deck = G.decks[G.decks.length - G.tierToEnd];
        if (deck === undefined) {
            throw new Error(`Отсутствует колода карт текущей эпохи.`);
        }
        const refillDeck = deck.splice(0, G.drawSize), currentTavernConfig = tavernsConfig[i];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны.`);
        }
        if (refillDeck.length !== G.drawSize) {
            throw new Error(`Таверна ${currentTavernConfig.name} не заполнена новыми картами из-за их нехватки в колоде.`);
        }
        const currentTavern = G.taverns[i];
        if (currentTavern === undefined) {
            throw new Error(`Отсутствует текущая таверна.`);
        }
        currentTavern.splice(0, currentTavern.length, ...refillDeck);
        AddDataToLog(G, LogTypes.GAME, `Таверна ${currentTavernConfig.name} заполнена новыми картами.`);
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
        name: TavernNames.LaughingGoblin,
    },
    1: {
        name: TavernNames.DancingDragon,
    },
    2: {
        name: TavernNames.ShiningHorse,
    },
};
//# sourceMappingURL=Tavern.js.map