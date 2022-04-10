import { AddDataToLog } from "./Logging";
import { ArtefactNames, LogTypes, TavernNames } from "./typescript/enums";
/**
 * <h3>Проверяет все ли карты выбраны игроками в текущей таверне.</h1>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяет после каждого выбора карты дворфа из таверны.</li>
 * <li>Проверяет после каждого выбора карты улучшения монеты из таверны.</li>
 * <li>Проверяет после каждого выбора карты лагеря из таверны.</li>
 * </ol>
 *
 * @param G
 * @returns Пуста ли текущая таверна.
 */
export const CheckIfCurrentTavernEmpty = (G) => {
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`Отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    return currentTavern.every((card) => card === null);
};
export const DiscardCardIfTavernHasCardFor2Players = (G) => {
    const tavern = G.taverns[G.currentTavern];
    if (tavern === undefined) {
        throw new Error(`Отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    const cardIndex = tavern.findIndex((card) => card !== null);
    if (cardIndex === -1) {
        throw new Error(`Не удалось сбросить лишнюю карту из таверны с id '${G.currentTavern}' при пике артефакта '${ArtefactNames.Jarnglofi}'.`);
    }
    const currentTavernConfig = tavernsConfig[G.currentTavern];
    if (currentTavernConfig === undefined) {
        throw new Error(`Отсутствует конфиг текущей таверны с id '${G.currentTavern}'.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс из-за наличия двух игроков в игре.`);
    DiscardCardFromTavern(G, cardIndex);
};
/**
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из лагеря.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из лагеря.</li>
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
        throw new Error(`Отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    const discardedCard = currentTavern[discardCardIndex];
    if (discardedCard === undefined) {
        throw new Error(`В текущей таверне с id '${G.currentTavern}' отсутствует карта с id '${discardCardIndex}'.`);
    }
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        currentTavern.splice(discardCardIndex, 1, null);
        const currentTavernConfig = tavernsConfig[G.currentTavern];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны с id '${G.currentTavern}'.`);
        }
        AddDataToLog(G, LogTypes.GAME, `Карта '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
        return true;
    }
    throw new Error(`Не удалось сбросить карту с id '${discardCardIndex}' из таверны.`);
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
        const deck = G.secret.decks[G.secret.decks.length - G.tierToEnd];
        if (deck === undefined) {
            throw new Error(`Отсутствует колода карт текущей эпохи '${G.secret.decks.length - G.tierToEnd}'.`);
        }
        const refillDeck = deck.splice(0, G.drawSize), currentTavernConfig = tavernsConfig[i];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны с id '${i}'.`);
        }
        if (refillDeck.length !== G.drawSize) {
            throw new Error(`Таверна ${currentTavernConfig.name} не заполнена новыми картами из-за их нехватки в колоде.`);
        }
        G.deckLength[G.secret.decks.length - G.tierToEnd] = deck.length;
        const currentTavern = G.taverns[i];
        if (currentTavern === undefined) {
            throw new Error(`Отсутствует текущая таверна с id '${i}'.`);
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