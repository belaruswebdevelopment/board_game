import { AssertRefillDeckCardsWithExpansionArray, AssertRefillDeckCardsWithoutExpansionArray } from "../is_helpers/AssertionTypeHelpers";
//TODO Rework it in one func with switch!?
export const GetCardsFromSecretDwarfDeck = ({ G }, tier, start, amount) => {
    const currentDeck = G.secret.decks[tier], cards = currentDeck.splice(start, amount);
    if (amount !== cards.length) {
        throw new Error(`Недостаточно карт в массиве карт дворфов конкретной эпохи: требуется - '${amount}', в наличии - '${cards.length}'.`);
    }
    G.decksLength[tier] = currentDeck.length;
    AssertRefillDeckCardsWithoutExpansionArray(cards);
    return cards;
};
export const GetCampCardsFromSecretCampDeck = ({ G }, tier, start, amount) => {
    const campDeck = G.secret.campDecks[tier], campCards = campDeck.splice(start, amount);
    if (amount !== campCards.length) {
        throw new Error(`Недостаточно карт в массиве карт лагеря конкретной эпохи: требуется - '${amount}', в наличии - '${campCards.length}'.`);
    }
    G.campDecksLength[tier] = campDeck.length;
    return campCards;
};
export const GetMythologicalCreatureCardsFromSecretMythologicalCreatureDeck = ({ G }, start, amount) => {
    const currentCampDeck = G.secret.mythologicalCreatureDeck, mythologicalCreatureCards = currentCampDeck.splice(start, amount);
    if (amount !== mythologicalCreatureCards.length) {
        throw new Error(`Недостаточно карт в массиве карт мифических существ: требуется - '${amount}', в наличии - '${mythologicalCreatureCards.length}'.`);
    }
    G.mythologicalCreatureDeckLength = currentCampDeck.length;
    AssertRefillDeckCardsWithExpansionArray(mythologicalCreatureCards);
    return mythologicalCreatureCards;
};
//# sourceMappingURL=DecksHelpers.js.map