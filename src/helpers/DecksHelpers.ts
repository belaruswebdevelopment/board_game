import { AssertRefillDeckCardsWithExpansionArray, AssertRefillDeckCardsWithoutExpansionArray } from "../is_helpers/AssertionTypeHelpers";
import type { CampDeckCardType, DrawSizeType, DwarfDeckCardType, ExplorerDistinctionCardIdType, FnContext, MythologicalCreatureCardType, RefillDeckCardsWithExpansionArray, RefillDeckCardsWithoutExpansionArray, SecretCampDeckType, SecretDwarfDeckType, SecretMythologicalCreatureDeck, TierType } from "../typescript/interfaces";

export const GetCardsFromSecretDwarfDeck = ({ G }: FnContext, tier: TierType, start: ExplorerDistinctionCardIdType,
    amount: 1 | DrawSizeType): RefillDeckCardsWithoutExpansionArray => {
    const currentDeck: SecretDwarfDeckType = G.secret.decks[tier],
        cards: DwarfDeckCardType[] = currentDeck.splice(start, amount);
    if (amount !== cards.length) {
        throw new Error(`Недостаточно карт в массиве карт дворфов конкретной эпохи: требуется - '${amount}', в наличии - '${cards.length}'.`);
    }
    G.decksLength[tier] = currentDeck.length;
    AssertRefillDeckCardsWithoutExpansionArray(cards);
    return cards;
};

export const GetCampCardsFromSecretCampDeck = ({ G }: FnContext, tier: TierType, amount?: TierType):
    CampDeckCardType[] => {
    const campDeck: SecretCampDeckType = G.secret.campDecks[tier],
        campCards: CampDeckCardType[] = campDeck.splice(0, amount);
    if (amount !== campCards.length) {
        throw new Error(`Недостаточно карт в массиве карт лагеря конкретной эпохи: требуется - '${amount}', в наличии - '${campCards.length}'.`);
    }
    G.campDecksLength[tier] = campDeck.length;
    return campCards;
};

export const GetMythologicalCreatureCardsFromSecretMythologicalCreatureDeck = ({ G }: FnContext):
    RefillDeckCardsWithExpansionArray => {
    const currentCampDeck: SecretMythologicalCreatureDeck = G.secret.mythologicalCreatureDeck,
        mythologicalCreatureCards: MythologicalCreatureCardType[] =
            currentCampDeck.splice(0, G.drawSize);
    if (G.drawSize !== mythologicalCreatureCards.length) {
        throw new Error(`Недостаточно карт в массиве карт мифических существ: требуется - '${G.drawSize}', в наличии - '${mythologicalCreatureCards.length}'.`);
    }
    G.mythologicalCreatureDeckLength = currentCampDeck.length;
    AssertRefillDeckCardsWithExpansionArray(mythologicalCreatureCards);
    return mythologicalCreatureCards;
};
