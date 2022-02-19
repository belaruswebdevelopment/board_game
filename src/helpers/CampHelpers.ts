import { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { LogTypes } from "../typescript/enums";
import { CampCardTypes, CampDeckCardTypes, IMyGameState, IStack, TavernCardTypes } from "../typescript/interfaces";
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
export const AddBrisingamensEndGameActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.brisingamensEndGameAction()]);
};

/**
* <h3>Заполняет кэмп новой картой из карт кэмп деки текущей эпохи.</h3>
* <p>Применения:</p>
* <ol>
* <li>Происходит при заполнении кэмпа недостающими картами.</li>
* <li>Происходит при заполнении кэмпа картами новой эпохи.</li>
* </ol>
*
* @param G
* @param cardIndex Индекс карты.
*/
const AddCardToCamp = (G: IMyGameState, cardIndex: number): void => {
    const newCampCard: CampDeckCardTypes =
        G.campDecks[G.campDecks.length - G.tierToEnd].splice(0, 1)[0];
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
export const AddEnlistmentMercenariesActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    let stack: IStack[] = [];
    if (ctx.playOrderPos === 0) {
        stack = [StackData.startOrPassEnlistmentMercenaries()];
    } else {
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
export const AddGetMjollnirProfitActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getMjollnirProfit()]);
};

/**
 * <h3>Перемещает все оставшиеся неиспользованные карты кэмпа в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце 1-й эпохи.</li>
 * </ol>
 *
 * @param G
 */
const AddRemainingCampCardsToDiscard = (G: IMyGameState): void => {
    // TODO Add LogTypes.ERROR logging ?
    for (let i = 0; i < G.camp.length; i++) {
        if (G.camp[i] !== null) {
            const card: CampCardTypes = G.camp.splice(i, 1, null)[0];
            if (card !== null) {
                G.discardCampCardsDeck.push(card);
            }
        }
    }
    if (G.campDecks[G.campDecks.length - G.tierToEnd - 1].length) {
        G.discardCampCardsDeck.push(
            ...G.discardCampCardsDeck.concat(G.campDecks[G.campDecks.length - G.tierToEnd - 1]));
        G.campDecks[G.campDecks.length - G.tierToEnd - 1].length = 0;
    }
    AddDataToLog(G, LogTypes.GAME, `Оставшиеся карты кэмпа сброшены.`);
};

/**
 * <h3>Убирает дополнительную карту из таверны в стопку сброса при пике артефакта Jarnglofi.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavernJarnglofi = (G: IMyGameState): void => {
    const cardIndex: number =
        G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
    if (cardIndex !== -1) {
        AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
        DiscardCardFromTavern(G, cardIndex);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось сбросить лишнюю карту из таверны при пике артефакта Jarnglofi.`);
    }
};

/**
 * <h3>Автоматически убирает оставшуюся карту таверны в колоду сброса при выборе карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param G
 */
export const DiscardCardIfCampCardPicked = (G: IMyGameState): void => {
    if (G.campPicked) {
        const discardCardIndex: number =
            G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
        let isCardDiscarded = false;
        if (discardCardIndex !== -1) {
            isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
        }
        if (isCardDiscarded) {
            G.campPicked = false;
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось сбросить лишнюю карту из таверны после выбора карты кэмпа в конце пиков из таверны.`);
        }
    }
};

/**
 * <h3>Автоматически заполняет кэмп картами новой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале новой эпохи.</li>
 * </ol>
 *
 * @param G
 */
export const RefillCamp = (G: IMyGameState): void => {
    AddRemainingCampCardsToDiscard(G);
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    AddDataToLog(G, LogTypes.GAME, `Кэмп заполнен новыми картами новой эпохи.`);
};

/**
 * <h3>Автоматически заполняет кэмп недостающими картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале раунда.</li>
 * </ol>
 *
 * @param G
 */
export const RefillEmptyCampCards = (G: IMyGameState): void => {
    const emptyCampCards: (number | null)[] =
        G.camp.map((card: CampCardTypes, index: number): number | null => {
            if (card === null) {
                return index;
            }
            return null;
        });
    const isEmptyCampCards: boolean = emptyCampCards.length === 0;
    // TODO Add LogTypes.ERROR logging ?
    let isEmptyCurrentTierCampDeck: boolean = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex: number | null): void => {
            isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, LogTypes.GAME, `Кэмп заполнен новыми картами.`);
    }
};
