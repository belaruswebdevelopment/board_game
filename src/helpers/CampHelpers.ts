import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { ArtefactNames, LogTypeNames } from "../typescript/enums";
import type { CampCardArray, CampCardType, CampDeckCardType, CanBeNullType, CanBeUndefType, FnContext, IndexOf, SecretAllCampDecks, SecretCampDeckTier1, SecretCampDeckType, TavernInConfig, TierType } from "../typescript/interfaces";
import { GetCampCardsFromSecretCampDeck } from "./DecksHelpers";
import { DiscardAllCurrentCards, DiscardCurrentCard, RemoveCardsFromCampAndAddIfNeeded } from "./DiscardCardHelpers";

/**
* <h3>Заполняет лагерь новой картой из карт лагерь деки текущей эпохи.</h3>
* <p>Применения:</p>
* <ol>
* <li>Происходит при заполнении лагеря недостающими картами.</li>
* <li>Происходит при заполнении лагеря картами новой эпохи.</li>
* </ol>
*
* @param context
* @param cardId Индекс карты.
* @returns
*/
const AddCardToCamp = ({ G, ctx, ...rest }: FnContext, cardId: number): void => {
    const newCampCard: CanBeUndefType<CampDeckCardType> = GetCampCardsFromSecretCampDeck({ G, ctx, ...rest },
        (G.secret.campDecks.length - G.tierToEnd) as TierType, 0, 1)[0];
    if (newCampCard === undefined) {
        throw new Error(`Отсутствует карта лагеря в колоде карт лагеря текущей эпохи '${G.secret.campDecks.length - G.tierToEnd}'.`);
    }
    RemoveCardsFromCampAndAddIfNeeded({ G, ctx, ...rest }, cardId, [newCampCard]);
};

/**
 * <h3>Перемещает все оставшиеся неиспользованные карты лагеря в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце 1-й эпохи.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
const AddRemainingCampCardsToDiscard = ({ G, ctx, ...rest }: FnContext): void => {
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.campNum; i++) {
        const campCard: CampCardType = G.camp[i as IndexOf<CampCardArray>];
        if (campCard !== null) {
            const discardedCard: CampCardType =
                RemoveCardsFromCampAndAddIfNeeded({ G, ctx, ...rest }, i, [null]);
            if (discardedCard !== null) {
                DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
            }
        }
    }
    // TODO DiscardCardType!?
    const discardedCardsArray: CampDeckCardType[] =
        G.secret.campDecks[(G.secret.campDecks.length - G.tierToEnd - 1) as IndexOf<SecretAllCampDecks>];
    if (discardedCardsArray.length) {
        DiscardAllCurrentCards({ G, ctx, ...rest }, discardedCardsArray);
        GetCampCardsFromSecretCampDeck({ G, ctx, ...rest },
            (G.secret.campDecks.length - G.tierToEnd - 1) as TierType, 0);
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
 * @param context
 * @returns
 */
export const DiscardCardFromTavernJarnglofi = ({ G, ctx, ...rest }: FnContext): void => {
    const currentTavernConfig: TavernInConfig = tavernsConfig[G.currentTavern];
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из таверны ${currentTavernConfig.name} должна быть убрана в сброс при выборе артефакта '${ArtefactNames.Jarnglofi}'.`);
    DiscardCardFromTavern({ G, ctx, ...rest });
    G.mustDiscardTavernCardJarnglofi = false;
};

/**
 * <h3>Автоматически сбрасывает лишнюю карту таверны в колоду сброса, если первый игрок выбрал карту из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const DiscardCardIfCampCardPicked = ({ G, ctx, ...rest }: FnContext): void => {
    if (G.campPicked) {
        const currentTavernConfig: TavernInConfig = tavernsConfig[G.currentTavern];
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из текущей таверны ${currentTavernConfig.name} должна быть убрана в сброс при после выбора карты лагеря в конце выбора карт из таверны.`);
        DiscardCardFromTavern({ G, ctx, ...rest });
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
 * @param context
 * @returns
 */
export const RefillCamp = ({ G, ctx, ...rest }: FnContext): void => {
    AddRemainingCampCardsToDiscard({ G, ctx, ...rest });
    const campDeck1: SecretCampDeckTier1 = G.secret.campDecks[1],
        index: number = campDeck1.findIndex((card: CampDeckCardType): boolean =>
            card.name === ArtefactNames.OdroerirTheMythicCauldron);
    if (index === -1) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.OdroerirTheMythicCauldron}' в колоде лагеря '2' эпохи.`);
    }
    const campCardTemp: CanBeUndefType<CampDeckCardType> = campDeck1[0];
    if (campCardTemp === undefined) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.OdroerirTheMythicCauldron}' в колоде лагеря '1' эпохи.`);
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
 * @param context
 * @returns
 */
export const RefillEmptyCampCards = ({ G, ctx, ...rest }: FnContext): void => {
    const emptyCampCards: CanBeNullType<number>[] =
        G.camp.map((card: CampCardType, index: number): CanBeNullType<number> => {
            if (card === null) {
                return index;
            }
            return null;
        }),
        isEmptyCampCards: boolean = emptyCampCards.length === 0,
        campDeck: SecretCampDeckType =
            G.secret.campDecks[(G.secret.campDecks.length - G.tierToEnd) as IndexOf<SecretAllCampDecks>];
    let isEmptyCurrentTierCampDeck: boolean = campDeck.length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex: CanBeNullType<number>): void => {
            // TODO Is it dynamically change campDeck.length after AddCardToCamp!?
            isEmptyCurrentTierCampDeck = campDeck.length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp({ G, ctx, ...rest }, cardIndex);
            }
        });
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Кэмп заполнен новыми картами.`);
    }
};
