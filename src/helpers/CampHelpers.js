import { AssertCampIndex, AssertSecretAllCampDecksIndex, AssertTierIndex } from "../is_helpers/AssertionTypeHelpers";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { ArtefactNames, LogTypeNames } from "../typescript/enums";
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
const AddCardToCamp = ({ G, ctx, ...rest }, cardId) => {
    const tier = G.secret.campDecks.length - G.tierToEnd;
    AssertTierIndex(tier);
    const newCampCard = GetCampCardsFromSecretCampDeck({ G, ctx, ...rest }, tier, 1)[0];
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
const AddRemainingCampCardsToDiscard = ({ G, ctx, ...rest }) => {
    // TODO Add LogTypes.ERROR logging? Must be only 1-2 discarded card in specific condition!?
    for (let i = 0; i < G.campNum; i++) {
        AssertCampIndex(i);
        const campCard = G.camp[i];
        if (campCard !== null) {
            const discardedCard = RemoveCardsFromCampAndAddIfNeeded({ G, ctx, ...rest }, i, [null]);
            if (discardedCard !== null) {
                DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
            }
        }
    }
    const currentTier = G.secret.campDecks.length - G.tierToEnd - 1;
    AssertSecretAllCampDecksIndex(currentTier);
    // TODO DiscardCardType!?
    const discardedCardsArray = G.secret.campDecks[currentTier];
    if (discardedCardsArray.length) {
        DiscardAllCurrentCards({ G, ctx, ...rest }, discardedCardsArray);
        AssertTierIndex(currentTier);
        GetCampCardsFromSecretCampDeck({ G, ctx, ...rest }, currentTier);
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
export const DiscardCardFromTavernJarnglofi = ({ G, ctx, ...rest }) => {
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс при выборе артефакта '${ArtefactNames.Jarnglofi}'.`);
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
export const DiscardCardIfCampCardPicked = ({ G, ctx, ...rest }) => {
    if (G.campPicked) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Лишняя карта из текущей таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс при после выбора карты лагеря в конце выбора карт из таверны.`);
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
export const RefillCamp = ({ G, ctx, ...rest }) => {
    AddRemainingCampCardsToDiscard({ G, ctx, ...rest });
    const campDeck1 = G.secret.campDecks[1], index = campDeck1.findIndex((card) => card.name === ArtefactNames.OdroerirTheMythicCauldron);
    if (index === -1) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.OdroerirTheMythicCauldron}' в колоде лагеря '2' эпохи.`);
    }
    const campCardTemp = campDeck1[0];
    if (campCardTemp === undefined) {
        throw new Error(`Отсутствует артефакт '${ArtefactNames.OdroerirTheMythicCauldron}' в колоде лагеря '1' эпохи.`);
    }
    const odroerirTheMythicCauldron = campDeck1[index];
    if (odroerirTheMythicCauldron === undefined) {
        throw new Error(`В колоде лагеря '2' эпохи отсутствует карта с id '${index}'.`);
    }
    campDeck1[0] = odroerirTheMythicCauldron;
    campDeck1[index] = campCardTemp;
    for (let i = 0; i < G.campNum; i++) {
        AssertCampIndex(i);
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
export const RefillEmptyCampCards = ({ G, ctx, ...rest }) => {
    const emptyCampCards = G.camp.map((card, index) => {
        if (card === null) {
            return index;
        }
        return null;
    }), isEmptyCampCards = emptyCampCards.length === 0, currentTier = G.secret.campDecks.length - G.tierToEnd;
    AssertSecretAllCampDecksIndex(currentTier);
    const campDeck = G.secret.campDecks[currentTier];
    let isEmptyCurrentTierCampDeck = campDeck.length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex) => {
            // TODO Is it dynamically change campDeck.length after AddCardToCamp!?
            isEmptyCurrentTierCampDeck = campDeck.length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AssertCampIndex(cardIndex);
                AddCardToCamp({ G, ctx, ...rest }, cardIndex);
            }
        });
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Кэмп заполнен новыми картами.`);
    }
};
//# sourceMappingURL=CampHelpers.js.map