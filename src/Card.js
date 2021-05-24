import {IsTopPlayer, GetTop1PlayerId, GetTop2PlayerId} from "./Player";

export const CreateCard = ({suit, rank = 1, points} = {}) => {
    return {
        suit,
        rank,
        points,
    };
};

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

export const GetAverageSuitCard = (suitConfig, data) => {
    const avgCard = CreateCard({suit: suitConfig.suit, rank: 0, points: 0}),
        count = Array.isArray(suitConfig.pointsValues()[data.players][data.tier]) ?
        suitConfig.pointsValues()[data.players][data.tier].length :
        suitConfig.pointsValues()[data.players][data.tier];
    for (let i = 0; i < count; i++) {
        avgCard.rank += Array.isArray(suitConfig.ranksValues()[data.players][data.tier]) ? suitConfig.ranksValues()[data.players][data.tier][i] : 1;
        avgCard.points += Array.isArray(suitConfig.pointsValues()[data.players][data.tier]) ? suitConfig.pointsValues()[data.players][data.tier][i] : 1;
    }
    avgCard.rank /= count;
    avgCard.points /= count;
    return avgCard;
};

export const CompareCards = (card1, card2) => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (card1.suit === card2.suit) {
        const result = (card1.points === undefined ? 1 : card1.points) - (card2.points === undefined ? 1 : card2.points);
        if (result === 0) {
            return result;
        }
         return result > 0 ? 1 : -1;
    }
    return 0;
};

export const CardProfitForPlayer = (G, ctx, card) => {
    if (IsTopPlayer(G, ctx.currentPlayer)) {
        let top2PlayerId = GetTop2PlayerId(G, ctx.currentPlayer);
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    let top1PlayerId = GetTop1PlayerId(G, ctx.currentPlayer);
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};

export const EvaluateCard = (G, ctx, card) => {
    if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
        return CompareCards(card, G.averageCards[card.suit]);
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        return CardProfitForPlayer(G, ctx, card);
    }
    return CardProfitForPlayer(G, ctx, card);
};
