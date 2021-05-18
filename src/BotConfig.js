import {suitsConfigArray} from "./SuitData";

export function Permute(permutation) {
    const result = [permutation.slice()];
    const length = permutation.length;
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
}

export function k_combinations(set, k) {
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
}

export const GetAllPicks = ({tavernsNum, playersNum}) => {
    const temp = [];
    const cartesian = (...a) => {
        if (a.length === 1)
        {
            a = a.flat();
        }
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    };
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill().map((item, index) => index);
    }
    return cartesian(temp);
}

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
}
