import {suitsConfigArray} from "./data/SuitData";

export const TotalPoints = (accumulator, currentValue) => accumulator + currentValue.points;

export const TotalRank = (accumulator, currentValue) => accumulator + currentValue.rank;

export const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;

export const CheckDistinction = (G, ctx) => {
    let i = 0;
    for (const suit in suitsConfigArray) {
        const result = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (result === undefined) {
            if (suit === "explorer") {
                G.decks[1].splice(0, 1);
            }
        }
        i++;
    }
};

const CheckCurrentSuitDistinction = (G, ctx, suit) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.players[i].cards[Object.keys(suitsConfigArray).findIndex(item => item === suit)].reduce(TotalRank, 0));
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
    let score = 0,
        i = 0;
    for (const suit in suitsConfigArray) {
        if (player.cards[i] !== undefined) {
            score += suitsConfigArray[suit].scoringRule(player.cards[i]);
        }
        i++;
    }
    return score;
};

export const FinalScoring = (G, ctx, player, currentScore) => {
    let score = currentScore;
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i].value;
    }
    // todo Check if Distinctions exists!
    const warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, "warrior");
    if (warriorsDistinction !== undefined && G.players.findIndex(p => p.nickname === player.nickname) === warriorsDistinction) {
        score += suitsConfigArray["warrior"].distinction.awarding(G, ctx, player);
    }
    score += suitsConfigArray["miner"].distinction.awarding(G, ctx, player) ?? 0;
    // todo rework heroes profit
    score += player.heroes.length * 17;
    return score;
};
