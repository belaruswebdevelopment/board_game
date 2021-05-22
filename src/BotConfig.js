import {suitsConfigArray} from "./data/SuitData";
import {CompareCards} from "./Card";

export const Permute = (permutation) => {
    const length = permutation.length,
        result = [permutation.slice()];
    let c = new Array(length).fill(0), i = 1, k, p;
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
};

export const k_combinations = (set, k) => {
    let i, j, combs, head, tailcombs;
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
};

export const GetAllPicks = ({tavernsNum, playersNum}) => {
    const temp = [],
        cartesian = (...a) => {
        if (a.length === 1) {
            a = a.flat();
        }
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    };
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill().map((item, index) => index);
    }
    return cartesian(temp);
};

export const PotentialScoring = ({cards = [], coins = [], tavernsNum = 0, marketCoinsMaxValue = 0}) => {
    let score = 0;
    for (let i = 0; i < cards.length; i++) {
        score += suitsConfigArray[i].scoringRule(cards[i]);
    }
    /*for (let i = 0; i < coins.length; i++) {
        if (coins[i]) {
            score += coins[i].value;
        }
        if (coins[i].isTriggerTrading && i < tavernsNum) {
            let coinsTotalValue = coins.slice(tavernsNum).reduce((prev, current) => prev + current.value, 0);
            let coinsMaxValue = coins.slice(tavernsNum).reduce((prev, current) => (prev.value > current.value) ? prev.value : current.value, 0);
            if (marketCoinsMaxValue < coinsMaxValue)
            {
                coinsMaxValue = marketCoinsMaxValue;
            }
            score += (coinsTotalValue - coinsMaxValue);
        }
    }*/
    return score;
};

//absolute heuristics
const isAllCardsEqual = {
    heuristic: (array) => array.every(element => (element.suit === array[0].suit && CompareCards(element, array[0]) === 0)),
    weight: -100,
};

//relative heuristics
const isAllWorse = {
    heuristic: (array) => array.every(element => element === -1),
    weight: 40,
};

const isAllAverage = {
    heuristic: (array) => array.every(element => element === 0),
    weight: 20,
};

const isAllBetter = {
    heuristic: (array) => array.every(element => element === 1),
    weight: 10,
};

const isOnlyOneWorse = {
    heuristic: (array) => (array.filter(element => element === -1).length === 1),
    weight: -100,
};

const isOnlyWorseOrBetter = {
    heuristic: (array) => array.every(element => element !== 0),
    weight: -50,
};

const absoluteHeuristicsForTradingCoin = [isAllCardsEqual];
const relativeHeuristicsForTradingCoin = [isAllWorse, isAllAverage, isAllBetter, isOnlyOneWorse, isOnlyWorseOrBetter];
console.log(relativeHeuristicsForTradingCoin ? "" : "");

//may be add different kinds of variation (1-order, 2-order, 4-order, ..., infinity-order)
const GetCharacteristics = (array) => {
    const mean = array.reduce((acc, item) => acc + item / array.length, 0),
          variation = array.reduce((acc, item) => acc + ((item - mean) ** 2) / array.length, 0);
    return {
        mean,
        variation,
    }
}

const CompareCharacteristics = (stat1, stat2) => {
    const eps = 0.0001,
        tempVariation = stat1.variation - stat2.variation;
    if (Math.abs(tempVariation) < eps)
    {
        return stat1.mean - stat2.mean;
    }
    return tempVariation;
}

export const CheckHeuristicsForCoinsPlacement = (taverns, averageCards) => {
    let result = Array(taverns.length).fill(0),
        temp = taverns.map((tavern) => absoluteHeuristicsForTradingCoin.reduce((acc, item) => acc + (item.heuristic(tavern) ? item.weight: 0), 0));
    result = result.map((value, index) => value + temp[index]);
    temp = taverns.map((tavern) => tavern.map((card) => CompareCards(card, averageCards[card.suit])));
    temp = temp.map(element => GetCharacteristics(element));
    //console.log("Characteristics: ");
    //console.log(temp);
    let maxIndex = 0,
        minIndex = temp.length - 1;
    for (let i = 0; i < temp.length; i++) {
        if (CompareCharacteristics(temp[maxIndex], temp[i]) < 0) {
            maxIndex = i;
        }
        if (CompareCharacteristics(temp[minIndex], temp[i]) > 0) {
            minIndex = i;
        }
    }
    result[maxIndex] += 10;
    result[minIndex] += -10;
    return result;
};
