import { CompareCards, EvaluateCard, isCardNotAction } from "./Card";
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
 * @returns
 */
export const CheckHeuristicsForCoinsPlacement = (G, ctx) => {
    const taverns = G.taverns /*,
        averageCards: ICard[] = G.averageCards*/;
    let result = Array(taverns.length).fill(0);
    const temp = taverns.map((tavern) => absoluteHeuristicsForTradingCoin.reduce((acc, item) => acc + (tavern !== null && item.heuristic(tavern) ? item.weight : 0), 0));
    result = result.map((value, index) => value + temp[index]);
    const tempNumbers = taverns.map((tavern) => tavern
        .map((card, index, arr) => EvaluateCard(G, ctx, card, index, arr)));
    const tempChars = tempNumbers.map((element) => GetCharacteristics(element));
    let maxIndex = 0, minIndex = tempChars.length - 1;
    for (let i = 1; i < temp.length; i++) {
        if (CompareCharacteristics(tempChars[maxIndex], tempChars[i]) < 0) {
            maxIndex = i;
        }
        if (CompareCharacteristics(tempChars[minIndex], tempChars[tempChars.length - 1 - i]) > 0) {
            minIndex = tempChars.length - 1 - i;
        }
    }
    result[maxIndex] += 10;
    result[minIndex] += -10;
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
 * @param stat1
 * @param stat2
 * @returns
 */
const CompareCharacteristics = (stat1, stat2) => {
    const eps = 0.0001, tempVariation = stat1.variation - stat2.variation;
    if (Math.abs(tempVariation) < eps) {
        return stat1.mean - stat2.mean;
    }
    return tempVariation;
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
 * @returns
 */
export const GetAllPicks = ({ tavernsNum, playersNum }) => {
    const temp = [], cartesian = (...a) => {
        if (a.length === 1) {
            a = a.flat();
        }
        return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
    };
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined)
            .map((item, index) => index);
    }
    return cartesian(temp);
};
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
 * @returns
 */
const GetCharacteristics = (array) => {
    const mean = array.reduce((acc, item) => acc + item / array.length, 0), variation = array.reduce((acc, item) => acc + ((item - mean) ** 2) / array.length, 0);
    return {
        mean,
        variation,
    };
};
//absolute heuristics
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
const isAllCardsEqual = {
    heuristic: (cards) => cards.every((card) => (card !== null && isCardNotAction(card) && isCardNotAction(cards[0]) && card.suit === cards[0].suit
        && CompareCards(card, cards[0]) === 0)),
    weight: -100,
};
//relative heuristics
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
const isAllAverage = {
    heuristic: (array) => array.every((item) => item === 0),
    weight: 20,
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
const isAllWorse = {
    heuristic: (array) => array.every((item) => item === -1),
    weight: 40,
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
const isOnlyOneWorse = {
    heuristic: (array) => (array.filter((item) => item === -1).length === 1),
    weight: -100,
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
const isOnlyWorseOrBetter = {
    heuristic: (array) => array.every((item) => item !== 0),
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
 * @param set
 * @param k
 * @returns
 */
export const k_combinations = (set, k) => {
    let combs = [], head, tailCombs;
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        for (let i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    for (let i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailCombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (let j = 0; j < tailCombs.length; j++) {
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
 * @param permutation
 * @returns
 */
export const Permute = (permutation) => {
    const length = permutation.length, result = [permutation.slice()];
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
        }
        else {
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
 * @todo Саше: сделать описание функции и параметров.
 */
const absoluteHeuristicsForTradingCoin = [isAllCardsEqual];
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
//const relativeHeuristicsForTradingCoin: (((array: number[]) => boolean) | {
//    heuristic: (array: number[]) => boolean,
//    weight: number
//})[] = [isAllWorse, isAllAverage, isAllBetter, isOnlyOneWorse, isOnlyWorseOrBetter];
//console.log(relativeHeuristicsForTradingCoin ?? "");
