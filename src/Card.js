const CreateCard = (cardConfig) => {
    return {
        suit: cardConfig.suit,
        rank: cardConfig.rank,
        points: cardConfig.points,
    };
}

export const BuildCards = (deckConfig) => {
    const cards = [];
    for (let i = 0; i < deckConfig.length; i++) {
        const isArray =  Array.isArray(deckConfig[i].pointsValues());
        const count = isArray ? deckConfig[i].pointsValues().length : deckConfig[i].pointsValues();
        for (let j = 0; j < count; j++) {
            const tempRank = Array.isArray(deckConfig[i].ranksValues()) ? deckConfig[i].ranksValues()[j] : 1;
            const tempPoints = isArray ? deckConfig[i].pointsValues()[j] : undefined;
            cards.push(CreateCard({suit: deckConfig[i].suit, rank: tempRank, points: tempPoints}));
        }
    }
    return cards;
};