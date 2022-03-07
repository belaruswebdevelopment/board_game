import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { LogTypes } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, IMyGameState, IStack, ITavernInConfig, TavernCardTypes } from "../typescript/interfaces";
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
    const campDeck: CampDeckCardTypes[] | undefined = G.campDecks[G.campDecks.length - G.tierToEnd];
    if (campDeck !== undefined) {
        const newCampCard: CampDeckCardTypes | undefined = campDeck.splice(0, 1)[0];
        if (newCampCard !== undefined) {
            G.camp.splice(cardIndex, 1, newCampCard);
        } else {
            throw new Error(`Отсутствует карта кэмпа в колоде карт кэмпа текущей эпохи.`);
        }
    } else {
        throw new Error(`Отсутствует колода карт кэмпа текущей эпохи.`);
    }
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
    let stack: IStack[];
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
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.camp.length; i++) {
        if (G.camp[i] !== null) {
            const card: CampCardTypes | undefined = G.camp.splice(i, 1, null)[0];
            if (card !== undefined) {
                if (card !== null) {
                    G.discardCampCardsDeck.push(card);
                }
            } else {
                throw new Error(`Отсутствует карта кэмпа в картах кэмпа.`);
            }
        }
    }
    const campDeck: CampDeckCardTypes[] | undefined = G.campDecks[G.campDecks.length - G.tierToEnd - 1];
    if (campDeck !== undefined) {
        if (campDeck.length) {
            G.discardCampCardsDeck.push(
                ...G.discardCampCardsDeck.concat(campDeck));
            // TODO Check "?"
            G.campDecks[G.campDecks.length - G.tierToEnd - 1]?.splice(0);
        }
        AddDataToLog(G, LogTypes.GAME, `Оставшиеся карты кэмпа сброшены.`);
    } else {
        throw new Error(`Отсутствует колода карт кэмпа текущей эпохи.`);
    }
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
export const DiscardCardFromTavernJarnglofi = (G: IMyGameState): void | never => {
    const tavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
    if (tavern !== undefined) {
        const cardIndex: number = tavern.findIndex((card: TavernCardTypes): boolean => card !== null);
        if (cardIndex !== -1) {
            const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[G.currentTavern];
            if (currentTavernConfig !== undefined) {
                AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
                DiscardCardFromTavern(G, cardIndex);
                G.mustDiscardTavernCardJarnglofi = false;
            } else {
                throw new Error(`Отсутствует конфиг текущей таверны.`);
            }
        } else {
            throw new Error(`Не удалось сбросить лишнюю карту из таверны при пике артефакта Jarnglofi.`);
        }
    } else {
        throw new Error(`Отсутствует текущая таверна.`);
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
export const DiscardCardIfCampCardPicked = (G: IMyGameState): void | never => {
    if (G.campPicked) {
        const tavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
        if (tavern !== undefined) {
            const discardCardIndex: number =
                tavern.findIndex((card: TavernCardTypes): boolean => card !== null);
            let isCardDiscarded = false;
            if (discardCardIndex !== -1) {
                isCardDiscarded = DiscardCardFromTavern(G, discardCardIndex);
            }
            if (isCardDiscarded) {
                G.campPicked = false;
            } else {
                throw new Error(`Не удалось сбросить лишнюю карту из таверны после выбора карты кэмпа в конце пиков из таверны.`);
            }
        } else {
            throw new Error(`Отсутствует текущая таверна.`);
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
    const isEmptyCampCards: boolean = emptyCampCards.length === 0,
        campDeck: CampDeckCardTypes[] | undefined = G.campDecks[G.campDecks.length - G.tierToEnd];
    if (campDeck !== undefined) {
        let isEmptyCurrentTierCampDeck: boolean = campDeck.length === 0;
        if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
            emptyCampCards.forEach((cardIndex: number | null): void => {
                isEmptyCurrentTierCampDeck = campDeck.length === 0;
                if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                    AddCardToCamp(G, cardIndex);
                }
            });
            AddDataToLog(G, LogTypes.GAME, `Кэмп заполнен новыми картами.`);
        }
    } else {
        throw new Error(`Отсутствует колода карт кэмпа текущей эпохи.`);
    }
};
