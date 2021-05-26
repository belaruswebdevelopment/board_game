import {suitsConfigArray} from "./data/SuitData";

export const TotalPoints = (accumulator, currentValue) => accumulator + currentValue.points;

export const TotalRank = (accumulator, currentValue) => accumulator + currentValue.rank;

export const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;

export const CheckDistinction = (G, ctx) => {
    for (let s = 0; s < G.suitsNum; s++) {
        const result = CheckCurrentSuitDistinction(G, ctx, s);
        G.distinctions[s] = result;
        if (result === undefined) {
            if (s === 4) {
                G.decks[1].splice(0, 1);
            }
        }
    }
};

const CheckCurrentSuitDistinction = (G, ctx, suit) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.players[i].cards[suit].reduce(TotalRank, 0));
    }
    const max = Math.max(...playersRanks),
        maxPlayers = playersRanks.filter(count => count === max);
    if (maxPlayers.length === 1) {
        return playersRanks.findIndex(count => count === maxPlayers[0]);
    } else {
        return undefined;
    }
};

export const CurrentScoring = (player) => {
    let score = 0;
    for (let i = 0; i < player.cards.length; i++) {
        score += suitsConfigArray[i].scoringRule(player.cards[i]);
    }
    return score;
};

export const FinalScoring = (G, ctx, player, currentScore) => {
    let score = currentScore;
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i].value;
    }
    const warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, 3);
    if (warriorsDistinction !== undefined && G.players.findIndex(p => p.nickname === player.nickname) === warriorsDistinction) {
        score += suitsConfigArray[3].distinction.awarding(G, ctx, player);
    }
    // todo rework heroes profit
    score += player.heroes.length * 17;
    return score;
};
