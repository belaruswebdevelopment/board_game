const CreateCard = ({suit, rank = 1, points} = {}) => {
    return {
        suit,
        rank,
        points,
    };
}

export const BuildCards = (deckConfig, data) => {
    const cards = [];
    for (let i = 0; i < deckConfig.length; i++) {
        const count = Array.isArray(deckConfig[i].pointsValues()[data.players][data.tier]) ?
            deckConfig[i].pointsValues()[data.players][data.tier].length :
            deckConfig[i].pointsValues()[data.players][data.tier];
        for (let j = 0; j < count; j++) {
            cards.push(CreateCard({
                suit: deckConfig[i].suit,
                rank: deckConfig[i].ranksValues()[data.players][data.tier][j],
                points: deckConfig[i].pointsValues()[data.players][data.tier][j],
            }));
        }
    }
    return cards;
};
