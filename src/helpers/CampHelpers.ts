import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { ArtefactNames, ErrorNames, LogTypeNames } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, CanBeNull, CanBeUndef, IMyGameState, ITavernInConfig } from "../typescript/interfaces";

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
const AddCardToCamp = (G: IMyGameState, cardIndex: number): void => {
    const campDeck: CanBeUndef<CampDeckCardTypes[]> = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    const newCampCard: CanBeUndef<CampDeckCardTypes> = campDeck.splice(0, 1)[0];
    if (newCampCard === undefined) {
        throw new Error(`Отсутствует карта лагеря в колоде карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    G.campDeckLength[G.secret.campDecks.length - G.tierToEnd] = campDeck.length;
    G.camp.splice(cardIndex, 1, newCampCard);
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
const AddRemainingCampCardsToDiscard = (G: IMyGameState): void => {
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.camp.length; i++) {
        const campCard: CanBeUndef<CampCardTypes> = G.camp[i];
        if (campCard === undefined) {
            throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${i}'.`);
        }
        if (campCard !== null) {
            const discardedCard: CanBeUndef<CampCardTypes> = G.camp.splice(i, 1, null)[0];
            if (discardedCard === undefined) {
                throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${i}' для сброса.`);
            }
            if (discardedCard !== null) {
                G.discardCampCardsDeck.push(discardedCard);
            }
        }
    }
    const campDeck: CanBeUndef<CampDeckCardTypes[]> = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd - 1];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd - 1}'.`);
    }
    if (campDeck.length) {
        G.discardCampCardsDeck.push(...G.discardCampCardsDeck.concat(campDeck));
        campDeck.splice(0);
        G.campDeckLength[G.secret.campDecks.length - G.tierToEnd - 1] = campDeck.length;
    }
    AddDataToLog(G, LogTypeNames.Game, `Оставшиеся карты лагеря сброшены.`);
};

/**
 * <h3>Убирает одну лишнюю карту из таверны в стопку сброса, если какой-то игрок выбрал в лагере артефакт Jarnglofi и если сброшенная обменная монета была выложена на месте одной из таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе каким-то игроком в лагере артефакта Jarnglofi, если сброшенная обменная монета была выложена на месте одной из таверн.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavernJarnglofi = (G: IMyGameState, ctx: Ctx): void => {
    const currentTavernConfig: CanBeUndef<ITavernInConfig> = tavernsConfig[G.currentTavern];
    if (currentTavernConfig === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernConfigIsUndefined, G.currentTavern);
    }
    AddDataToLog(G, LogTypeNames.Game, `Лишняя карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс при выборе артефакта '${ArtefactNames.Jarnglofi}'.`);
    const isCardDiscarded: boolean = DiscardCardFromTavern(G, ctx);
    if (!isCardDiscarded) {
        throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${G.currentTavern}' при выборе артефакта '${ArtefactNames.Jarnglofi}'.`);
    }
    G.mustDiscardTavernCardJarnglofi = false;
};

/**
 * <h3>Автоматически сбрасывает лишнюю карту таверны в колоду сброса, если первый игрок выбрал карту из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardCardIfCampCardPicked = (G: IMyGameState, ctx: Ctx): void => {
    if (G.campPicked) {
        const currentTavernConfig: CanBeUndef<ITavernInConfig> = tavernsConfig[G.currentTavern];
        if (currentTavernConfig === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentTavernConfigIsUndefined,
                G.currentTavern);
        }
        AddDataToLog(G, LogTypeNames.Game, `Лишняя карта из текущей таверны ${currentTavernConfig.name} должна быть убрана в сброс при после выбора карты лагеря в конце выбора карт из таверны.`);
        const isCardDiscarded: boolean = DiscardCardFromTavern(G, ctx);
        if (!isCardDiscarded) {
            throw new Error(`Не удалось сбросить лишнюю карту из текущей таверны с id '${G.currentTavern}' после выбора карты лагеря в конце выбора карт из таверны.`);
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
export const RefillCamp = (G: IMyGameState): void => {
    AddRemainingCampCardsToDiscard(G);
    const campDeck1: CanBeUndef<CampDeckCardTypes[]> = G.secret.campDecks[1];
    if (campDeck1 === undefined) {
        throw new Error(`Колода карт лагеря '2' эпохи не может отсутствовать.`);
    }
    const index: number = campDeck1.findIndex((card: CampDeckCardTypes): boolean =>
        card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron);
    if (index === -1) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '2' эпохи.`);
    }
    const campCardTemp: CanBeUndef<CampDeckCardTypes> = campDeck1[0];
    if (campCardTemp === undefined) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '1' эпохи.`);
    }
    const odroerirTheMythicCauldron: CanBeUndef<CampDeckCardTypes> = campDeck1[index];
    if (odroerirTheMythicCauldron === undefined) {
        throw new Error(`В колоде лагеря '2' эпохи отсутствует карта с id '${index}'.`);
    }
    campDeck1[0] = odroerirTheMythicCauldron;
    campDeck1[index] = campCardTemp;
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    G.odroerirTheMythicCauldron = true;
    AddDataToLog(G, LogTypeNames.Game, `Кэмп заполнен новыми картами новой эпохи.`);
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
export const RefillEmptyCampCards = (G: IMyGameState): void => {
    const emptyCampCards: (CanBeNull<number>)[] =
        G.camp.map((card: CampCardTypes, index: number): CanBeNull<number> => {
            if (card === null) {
                return index;
            }
            return null;
        }),
        isEmptyCampCards: boolean = emptyCampCards.length === 0,
        campDeck: CanBeUndef<CampDeckCardTypes[]> = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    let isEmptyCurrentTierCampDeck: boolean = campDeck.length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex: CanBeNull<number>): void => {
            isEmptyCurrentTierCampDeck = campDeck.length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, LogTypeNames.Game, `Кэмп заполнен новыми картами.`);
    }
};
