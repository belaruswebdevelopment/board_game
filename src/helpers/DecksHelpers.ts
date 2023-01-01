import type { CampDeckCardType, DwarfDeckCardType, FnContext, IndexOf, MythologicalCreatureCardType, SecretAllCampDecks, SecretAllDwarfDecks, SecretCampDeckType, SecretDwarfDeckType, SecretMythologicalCreatureDeck, TierType } from "../typescript/interfaces";

//TODO Rework it in one func with switch!?
export const GetCardsFromSecretDwarfDeck = ({ G }: FnContext, tier: TierType, start: number, amount?: number):
    DwarfDeckCardType[] => {
    const currentDeck: SecretDwarfDeckType = G.secret.decks[tier satisfies IndexOf<SecretAllDwarfDecks>],
        cards: DwarfDeckCardType[] = currentDeck.splice(start, amount);
    if (amount !== cards.length) {
        throw new Error(`Недостаточно карт в массиве карт дворфов конкретной эпохи: требуется - '${amount}', в наличии - '${cards.length}'.`);
    }
    G.decksLength[tier] = currentDeck.length;
    return cards;
};

export const GetCampCardsFromSecretCampDeck = ({ G }: FnContext, tier: TierType, start: number,
    amount?: number): CampDeckCardType[] => {
    const campDeck: SecretCampDeckType = G.secret.campDecks[tier satisfies IndexOf<SecretAllCampDecks>],
        campCards: CampDeckCardType[] = campDeck.splice(start, amount);
    if (amount !== campCards.length) {
        throw new Error(`Недостаточно карт в массиве карт лагеря конкретной эпохи: требуется - '${amount}', в наличии - '${campCards.length}'.`);
    }
    G.campDecksLength[tier] = campDeck.length;
    return campCards;
};

export const GetMythologicalCreatureCardsFromSecretMythologicalCreatureDeck = ({ G }: FnContext, start: number,
    amount?: number): MythologicalCreatureCardType[] => {
    const currentCampDeck: SecretMythologicalCreatureDeck = G.secret.mythologicalCreatureDeck,
        mythologicalCreatureCards: MythologicalCreatureCardType[] =
            currentCampDeck.splice(start, amount);
    if (amount !== mythologicalCreatureCards.length) {
        throw new Error(`Недостаточно карт в массиве карт мифических существ: требуется - '${amount}', в наличии - '${mythologicalCreatureCards.length}'.`);
    }
    G.mythologicalCreatureDeckLength = currentCampDeck.length;
    return mythologicalCreatureCards;
};
