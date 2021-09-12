import {CompareCards, EvaluateCard} from "./Card";

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param permutation
 * @returns {*[]}
 * @constructor
 */
export const Permute = (permutation) => {
    const length = permutation.length,
        result = [permutation.slice()];
    let c = new Array(length).fill(0),
        i = 1,
        k,
        p;
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

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param set
 * @param k
 * @returns {*[]}
 */
export const k_combinations = (set, k) => {
    let i,
        j,
        combs,
        head,
        tailCombs;
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
        tailCombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailCombs.length; j++) {
            combs.push(head.concat(tailCombs[j]));
        }
    }
    return combs;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param tavernsNum
 * @param playersNum
 * @returns {FlatArray<*[], 1>}
 * @constructor
 */
export const GetAllPicks = ({tavernsNum, playersNum}) => {
    const temp = [],
        cartesian = (...a) => {
            if (a.length === 1) {
                a = a.flat();
            }
            return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        };
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined).map((item, index) => index);
    }
    return cartesian(temp);
};

//absolute heuristics
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}}
 */
const isAllCardsEqual = {
    heuristic: (array) => array.every(card => (card.suit === array[0].suit && CompareCards(card, array[0]) === 0)),
    weight: -100,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}}
 */
//relative heuristics
const isAllWorse = {
    heuristic: (array) => array.every(card => card === -1),
    weight: 40,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}}
 */
const isAllAverage = {
    heuristic: (array) => array.every(card => card === 0),
    weight: 20,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}}
 */
const isAllBetter = {
    heuristic: (array) => array.every(card => card === 1),
    weight: 10,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): boolean), weight: number}}
 */
const isOnlyOneWorse = {
    heuristic: (array) => (array.filter(card => card === -1).length === 1),
    weight: -100,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}}
 */
const isOnlyWorseOrBetter = {
    heuristic: (array) => array.every(card => card !== 0),
    weight: -50,
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {{heuristic: (function(*): *), weight: number}[]}
 */
const absoluteHeuristicsForTradingCoin = [isAllCardsEqual];
/**
 *
 * @todo Саше: сделать описание функции и параметров.
 * @type {({heuristic: (function(*): *), weight: number}|{heuristic: (function(*): boolean), weight: number})[]}
 */
const relativeHeuristicsForTradingCoin = [isAllWorse, isAllAverage, isAllBetter, isOnlyOneWorse, isOnlyWorseOrBetter];
console.log(relativeHeuristicsForTradingCoin ? "" : "");

//may be to add different kinds of variation (1-order, 2-order, 4-order, ..., infinity-order)
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param array
 * @returns {{mean, variation}}
 * @constructor
 */
const GetCharacteristics = (array) => {
    const mean = array.reduce((acc, item) => acc + item / array.length, 0),
        variation = array.reduce((acc, item) => acc + ((item - mean) ** 2) / array.length, 0);
    return {
        mean,
        variation,
    }
}

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param stat1
 * @param stat2
 * @returns {number}
 * @constructor
 */
const CompareCharacteristics = (stat1, stat2) => {
    const eps = 0.0001,
        tempVariation = stat1.variation - stat2.variation;
    if (Math.abs(tempVariation) < eps) {
        return stat1.mean - stat2.mean;
    }
    return tempVariation;
}

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns {any[]}
 * @constructor
 */
export const CheckHeuristicsForCoinsPlacement = (G, ctx) => {
    const taverns = G.taverns/*,
        averageCards = G.averageCards*/;
    let result = Array(taverns.length).fill(0),
        temp = taverns.map(tavern => absoluteHeuristicsForTradingCoin
            .reduce((acc, item) => acc + (item.heuristic(tavern) ? item.weight : 0), 0));
    result = result.map((value, index) => value + temp[index]);
    temp = taverns.map(tavern => tavern.map((card, index, arr) => EvaluateCard(G, ctx, card, index, arr)));
    temp = temp.map(element => GetCharacteristics(element));
    let maxIndex = 0,
        minIndex = temp.length - 1;
    for (let i = 1; i < temp.length; i++) {
        if (CompareCharacteristics(temp[maxIndex], temp[i]) < 0) {
            maxIndex = i;
        }
        if (CompareCharacteristics(temp[minIndex], temp[temp.length - 1 - i]) > 0) {
            minIndex = temp.length - 1 - i;
        }
    }
    result[maxIndex] += 10;
    result[minIndex] += -10;
    return result;
};
