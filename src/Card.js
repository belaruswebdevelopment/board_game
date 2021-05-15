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
            const tempRank = Array.isArray(deckConfig[i].ranksValues()[data.players][data.tier]) ? deckConfig[i].ranksValues()[data.players][data.tier][j] : 1;
            const tempPoints = isArray ? deckConfig[i].pointsValues()[data.players][data.tier][j] : undefined;
            cards.push(CreateCard({suit: deckConfig[i].suit, rank: tempRank, points: tempPoints}));
        }
    }
    return cards;
};