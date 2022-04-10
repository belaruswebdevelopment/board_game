import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { ArtefactNames, LogTypes } from "../typescript/enums";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
/**
 * <h3>Добавляет действия в стэк при старте хода в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddBrisingamensEndGameActionsToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.brisingamensEndGameAction()]);
};
/**
* <h3>Заполняет лагерь новой картой из карт лагерь деки текущей эпохи.</h3>
* <p>Применения:</p>
* <ol>
* <li>Происходит при заполнении лагеря недостающими картами.</li>
* <li>Происходит при заполнении лагеря картами новой эпохи.</li>
* </ol>
*
* @param G
* @param cardIndex Индекс карты.
*/
const AddCardToCamp = (G, cardIndex) => {
    const campDeck = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    const newCampCard = campDeck.splice(0, 1)[0];
    if (newCampCard === undefined) {
        throw new Error(`Отсутствует карта лагеря в колоде карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    G.campDeckLength[G.secret.campDecks.length - G.tierToEnd] = campDeck.length;
    G.camp.splice(cardIndex, 1, newCampCard);
};
/**
 * <h3>Добавляет действия в стэк при старте хода в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddEnlistmentMercenariesActionsToStack = (G, ctx) => {
    let stack;
    if (ctx.playOrderPos === 0) {
        stack = [StackData.startOrPassEnlistmentMercenaries()];
    }
    else {
        stack = [StackData.enlistmentMercenaries()];
    }
    AddActionsToStackAfterCurrent(G, ctx, stack);
};
/**
 * <h3>Добавляет действия в стэк при старте фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddGetMjollnirProfitActionsToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getMjollnirProfit()]);
};
/**
 * <h3>Перемещает все оставшиеся неиспользованные карты лагеря в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце 1-й эпохи.</li>
 * </ol>
 *
 * @param G
 */
const AddRemainingCampCardsToDiscard = (G) => {
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.camp.length; i++) {
        const campCard = G.camp[i];
        if (campCard === undefined) {
            throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${i}'.`);
        }
        if (campCard !== null) {
            const discardedCard = G.camp.splice(i, 1, null)[0];
            if (discardedCard === undefined) {
                throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${i}' для сброса.`);
            }
            if (discardedCard !== null) {
                G.discardCampCardsDeck.push(discardedCard);
            }
        }
    }
    const campDeck = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd - 1];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd - 1}'.`);
    }
    if (campDeck.length) {
        G.discardCampCardsDeck.push(...G.discardCampCardsDeck.concat(campDeck));
        campDeck.splice(0);
        G.campDeckLength[G.secret.campDecks.length - G.tierToEnd - 1] = campDeck.length;
    }
    AddDataToLog(G, LogTypes.GAME, `Оставшиеся карты лагеря сброшены.`);
};
/**
 * <h3>Убирает дополнительную карту из таверны в стопку сброса при пике артефакта Jarnglofi.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavernJarnglofi = (G) => {
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
    AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс из-за пика артефакта '${ArtefactNames.Jarnglofi}'.`);
    DiscardCardFromTavern(G, cardIndex);
    G.mustDiscardTavernCardJarnglofi = false;
};
/**
 * <h3>Автоматически убирает оставшуюся карту таверны в колоду сброса при выборе карты из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param G
 */
export const DiscardCardIfCampCardPicked = (G) => {
    if (G.campPicked) {
        const tavern = G.taverns[G.currentTavern];
        if (tavern === undefined) {
            throw new Error(`Отсутствует текущая таверна с id '${G.currentTavern}'.`);
        }
        const discardCardIndex = tavern.findIndex((card) => card !== null);
        let isCardDiscarded = false;
        if (discardCardIndex !== -1) {
            isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
        }
        if (!isCardDiscarded) {
            throw new Error(`Не удалось сбросить лишнюю карту из таверны с id '${G.currentTavern}' после выбора карты лагеря в конце пиков из таверны.`);
        }
        G.campPicked = false;
    }
};
/**
 * <h3>Автоматически заполняет лагерь картами новой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале новой эпохи.</li>
 * </ol>
 *
 * @param G
 */
export const RefillCamp = (G) => {
    AddRemainingCampCardsToDiscard(G);
    const campDeck1 = G.secret.campDecks[1];
    if (campDeck1 === undefined) {
        throw new Error(`Колода карт лагеря '2' эпохи не может отсутствовать.`);
    }
    const index = campDeck1.findIndex((card) => card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron);
    if (index === -1) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '2' эпохи.`);
    }
    const campCardTemp = campDeck1[0];
    if (campCardTemp === undefined) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '1' эпохи.`);
    }
    const odroerirTheMythicCauldron = campDeck1[index];
    if (odroerirTheMythicCauldron === undefined) {
        throw new Error(`В колоде лагеря '2' эпохи отсутствует карта с id '${index}'.`);
    }
    campDeck1[0] = odroerirTheMythicCauldron;
    campDeck1[index] = campCardTemp;
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    G.odroerirTheMythicCauldron = true;
    AddDataToLog(G, LogTypes.GAME, `Кэмп заполнен новыми картами новой эпохи.`);
};
/**
 * <h3>Автоматически заполняет лагерь недостающими картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале раунда.</li>
 * </ol>
 *
 * @param G
 */
export const RefillEmptyCampCards = (G) => {
    const emptyCampCards = G.camp.map((card, index) => {
        if (card === null) {
            return index;
        }
        return null;
    });
    const isEmptyCampCards = emptyCampCards.length === 0, campDeck = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    let isEmptyCurrentTierCampDeck = campDeck.length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex) => {
            isEmptyCurrentTierCampDeck = campDeck.length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, LogTypes.GAME, `Кэмп заполнен новыми картами.`);
    }
};
//# sourceMappingURL=CampHelpers.js.map