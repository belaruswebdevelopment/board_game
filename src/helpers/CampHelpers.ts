import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { ArtefactNames, LogTypeNames } from "../typescript/enums";
import type { CampCardArrayType, CampCardType, CampDeckCardType, CanBeNullType, CanBeUndefType, FnContext, IndexOf, ITavernInConfig } from "../typescript/interfaces";

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
* @returns
*/
const AddCardToCamp = ({ G }: FnContext, cardIndex: number): void => {
    const campDeck: CanBeUndefType<CampDeckCardType[]> = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    const newCampCard: CanBeUndefType<CampDeckCardType> = campDeck.splice(0, 1)[0];
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
 * @returns
 */
const AddRemainingCampCardsToDiscard = ({ G, ctx, ...rest }: FnContext): void => {
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.campNum; i++) {
        const campCard: CampCardType = G.camp[i as IndexOf<CampCardArrayType>];
        if (campCard !== null) {
            const discardedCard: CanBeUndefType<CampCardType> =
                G.camp.splice(i, 1, null)[0];
            if (discardedCard === undefined) {
                throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${i}' для сброса.`);
            }
            if (discardedCard !== null) {
                G.discardCampCardsDeck.push(discardedCard);
            }
        }
    }
    const campDeck: CanBeUndefType<CampDeckCardType[]> =
        G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd - 1];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd - 1}'.`);
    }
    if (campDeck.length) {
        G.discardCampCardsDeck.push(...G.discardCampCardsDeck.concat(campDeck));
        campDeck.splice(0);
        G.campDeckLength[G.secret.campDecks.length - G.tierToEnd - 1] = campDeck.length;
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Оставшиеся карты лагеря сброшены.`);
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
 * @returns
 */
export const DiscardCardFromTavernJarnglofi = ({ G, ctx, ...rest }: FnContext): void => {
    const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс при выборе артефакта '${ArtefactNames.Jarnglofi}'.`);
    const isCardDiscarded: boolean = DiscardCardFromTavern({ G, ctx, ...rest });
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
 * @returns
 */
export const DiscardCardIfCampCardPicked = ({ G, ctx, ...rest }: FnContext): void => {
    if (G.campPicked) {
        const currentTavernConfig: ITavernInConfig = tavernsConfig[G.currentTavern];
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из текущей таверны ${currentTavernConfig.name} должна быть убрана в сброс при после выбора карты лагеря в конце выбора карт из таверны.`);
        const isCardDiscarded: boolean = DiscardCardFromTavern({ G, ctx, ...rest });
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
 * @returns
 */
export const RefillCamp = ({ G, ctx, ...rest }: FnContext): void => {
    AddRemainingCampCardsToDiscard({ G, ctx, ...rest });
    const campDeck1: CampDeckCardType[] = G.secret.campDecks[1],
        index: number = campDeck1.findIndex((card: CampDeckCardType): boolean =>
            card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron);
    if (index === -1) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '2' эпохи.`);
    }
    const campCardTemp: CanBeUndefType<CampDeckCardType> = campDeck1[0];
    if (campCardTemp === undefined) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.Odroerir_The_Mythic_Cauldron}' в колоде лагеря '1' эпохи.`);
    }
    const odroerirTheMythicCauldron: CanBeUndefType<CampDeckCardType> = campDeck1[index];
    if (odroerirTheMythicCauldron === undefined) {
        throw new Error(`В колоде лагеря '2' эпохи отсутствует карта с id '${index}'.`);
    }
    campDeck1[0] = odroerirTheMythicCauldron;
    campDeck1[index] = campCardTemp;
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp({ G, ctx, ...rest }, i);
    }
    G.odroerirTheMythicCauldron = true;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Кэмп заполнен новыми картами новой эпохи.`);
};

/**
 * <h3>Автоматически заполняет лагерь недостающими картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале раунда.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const RefillEmptyCampCards = ({ G, ctx, ...rest }: FnContext): void => {
    const emptyCampCards: (CanBeNullType<number>)[] =
        G.camp.map((card: CampCardType, index: number): CanBeNullType<number> => {
            if (card === null) {
                return index;
            }
            return null;
        }),
        isEmptyCampCards: boolean = emptyCampCards.length === 0,
        campDeck: CanBeUndefType<CampDeckCardType[]> = G.secret.campDecks[G.secret.campDecks.length - G.tierToEnd];
    if (campDeck === undefined) {
        throw new Error(`Отсутствует колода карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    let isEmptyCurrentTierCampDeck: boolean = campDeck.length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex: CanBeNullType<number>): void => {
            isEmptyCurrentTierCampDeck = campDeck.length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp({ G, ctx, ...rest }, cardIndex);
            }
        });
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Кэмп заполнен новыми картами.`);
    }
};
