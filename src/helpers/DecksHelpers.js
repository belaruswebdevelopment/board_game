import { ThrowMyError } from "../Error";
import { ErrorNames } from "../typescript/enums";
//TODO Rework it in one func with switch!?
export const GetCardsFromCardDeck = ({ G, ctx, ...rest }, tier, start, amount) => {
    const currentDeck = G.secret.decks[tier];
    if (currentDeck === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.DeckWithTierCurrentIdIsUndefined, tier);
    }
    const cards = currentDeck.splice(start, amount);
    G.deckLength[tier] = currentDeck.length;
    return cards;
};
export const GetCampCardsFromCampCardDeck = ({ G, ctx, ...rest }, tier, start, amount) => {
    const currentCampDeck = G.secret.campDecks[tier];
    if (currentCampDeck === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CampDeckWithTierCurrentIdIsUndefined, tier);
    }
    const campCards = currentCampDeck.splice(start, amount);
    G.campDeckLength[tier] = currentCampDeck.length;
    return campCards;
};
export const GetMythologicalCreatureCardsFromMythologicalCreatureCardDeck = ({ G }, start, amount) => {
    const currentCampDeck = G.secret.mythologicalCreatureDeck, mythologicalCreatureCards = currentCampDeck.splice(start, amount);
    G.mythologicalCreatureDeckLength = currentCampDeck.length;
    return mythologicalCreatureCards;
};
//# sourceMappingURL=DecksHelpers.js.map