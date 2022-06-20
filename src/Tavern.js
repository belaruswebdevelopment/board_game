import { DiscardPickedCard } from "./helpers/DiscardCardHelpers";
import { AddDataToLog } from "./Logging";
import { LogTypes, TavernNames } from "./typescript/enums";
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
/**
 * <h3>Убирает карту из таверны в стопку сброса при игре на 2-х игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При соло игре убирает не выбранную карту.</li>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardCardIfTavernHasCardFor2Players = (G, ctx) => {
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    const cardIndex = currentTavern.findIndex((card) => card !== null);
    if (cardIndex === -1) {
        throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${G.currentTavern}'.`);
    }
    const currentTavernConfig = tavernsConfig[G.currentTavern];
    if (currentTavernConfig === undefined) {
        throw new Error(`Отсутствует конфиг текущей таверны с id '${G.currentTavern}'.`);
    }
    AddDataToLog(G, LogTypes.Game, `Карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс из-за ${G.solo ? `игры в соло режиме` : `наличия двух игроков в игре`}.`);
    DiscardCardFromTavern(G, ctx, cardIndex);
};
/**
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При соло игре убирает не выбранную карту.</li>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из лагеря.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из лагеря.</li>
 * <li>Игрок пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavern = (G, ctx, discardCardIndex) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    const discardedCard = currentTavern[discardCardIndex];
    if (discardedCard === undefined) {
        throw new Error(`В текущей таверне с id '${G.currentTavern}' отсутствует карта с id '${discardCardIndex}'.`);
    }
    if (discardedCard !== null) {
        DiscardPickedCard(G, player, discardedCard);
        currentTavern.splice(discardCardIndex, 1, null);
        const currentTavernConfig = tavernsConfig[G.currentTavern];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны с id '${G.currentTavern}'.`);
        }
        AddDataToLog(G, LogTypes.Game, `Карта '${discardedCard.name}' из таверны ${currentTavernConfig.name} убрана в сброс.`);
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
    G.round++;
    for (let t = 0; t < G.tavernsNum; t++) {
        let refillDeck;
        if (G.expansions.idavoll.active && G.tierToEnd === 2 && G.round < 3 && t === 1) {
            refillDeck = G.secret.mythologicalCreatureDecks.splice(0, G.drawSize);
            G.mythologicalCreatureDeckLength = G.secret.mythologicalCreatureDecks.length;
        }
        else {
            const deck = G.secret.decks[G.secret.decks.length - G.tierToEnd];
            if (deck === undefined) {
                throw new Error(`Отсутствует колода карт текущей эпохи '${G.secret.decks.length - G.tierToEnd}'.`);
            }
            refillDeck = deck.splice(0, G.drawSize);
            G.deckLength[G.secret.decks.length - G.tierToEnd] = deck.length;
        }
        if (refillDeck.length !== G.drawSize) {
            throw new Error(`Таверна с id '${t}' не заполнена новыми картами из-за их нехватки в колоде.`);
        }
        const currentTavern = G.taverns[t];
        if (currentTavern === undefined) {
            throw new Error(`Отсутствует текущая таверна с id '${t}'.`);
        }
        currentTavern.splice(0, currentTavern.length, ...refillDeck);
        const currentTavernConfig = tavernsConfig[t];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг текущей таверны с id '${t}'.`);
        }
        AddDataToLog(G, LogTypes.Game, `Таверна ${currentTavernConfig.name} заполнена новыми картами.`);
    }
    AddDataToLog(G, LogTypes.Game, `Все таверны заполнены новыми картами.`);
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