import { ThrowMyError } from "../Error";
import { ErrorNames } from "../typescript/enums";
import type { CampDeckCardType, CanBeUndefType, DeckCardType, FnContext, MythologicalCreatureDeckCardType, TierType } from "../typescript/interfaces";

//TODO Rework it in one func with switch!?
export const GetCardsFromCardDeck = ({ G, ctx, ...rest }: FnContext, tier: TierType, start: number, amount?: number):
    DeckCardType[] => {
    const currentDeck: CanBeUndefType<DeckCardType[]> = G.secret.decks[tier];
    if (currentDeck === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.DeckWithTierCurrentIdIsUndefined,
            tier);
    }
    const cards: DeckCardType[] = currentDeck.splice(start, amount);
    G.deckLength[tier] = currentDeck.length;
    return cards;
};

export const GetCampCardsFromCampCardDeck = ({ G, ctx, ...rest }: FnContext, tier: TierType, start: number,
    amount?: number): CampDeckCardType[] => {
    const currentCampDeck: CanBeUndefType<CampDeckCardType[]> = G.secret.campDecks[tier];
    if (currentCampDeck === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CampDeckWithTierCurrentIdIsUndefined,
            tier);
    }
    const campCards: CampDeckCardType[] = currentCampDeck.splice(start, amount);
    G.campDeckLength[tier] = currentCampDeck.length;
    return campCards;
};

export const GetMythologicalCreatureCardsFromMythologicalCreatureCardDeck = ({ G }: FnContext, start: number,
    amount?: number): MythologicalCreatureDeckCardType[] => {
    const currentCampDeck: MythologicalCreatureDeckCardType[] = G.secret.mythologicalCreatureDeck,
        mythologicalCreatureCards: MythologicalCreatureDeckCardType[] =
            currentCampDeck.splice(start, amount);
    G.mythologicalCreatureDeckLength = currentCampDeck.length;
    return mythologicalCreatureCards;
};
