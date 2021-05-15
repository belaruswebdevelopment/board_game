const CreateCard = (cardConfig) => {
    return {
        suit: cardConfig.suit,
        rank: cardConfig.rank,
        points: cardConfig.points,
    };
}

export const BuildCards = (deckConfig, data) => {
    const cards = [];
    for (let i = 0; i < deckConfig.length; i++) {
        const isArray =  Array.isArray(deckConfig[i].pointsValues()[data.players][data.tier]);
        const count = isArray ? deckConfig[i].pointsValues()[data.players][data.tier].length : deckConfig[i].pointsValues()[data.players][data.tier];
        for (let j = 0; j < count; j++) {
            const tempPoints = isArray ? deckConfig[i].pointsValues()[data.players][data.tier][j] : undefined;
            cards.push(CreateCard({suit: deckConfig[i].suit, rank: deckConfig[i].ranksValues()[data.players][data.tier][j], points: tempPoints}));
        }
    }
    return cards;
};