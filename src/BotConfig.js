import { CompareCards, EvaluateCard, isCardNotAction } from "./Card";
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
export var Permute = function (permutation) {
    var length = permutation.length, result = [permutation.slice()];
    var c = new Array(length).fill(0), i = 1, k, p;
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
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param set
 * @param k
 * @returns
 */
export var k_combinations = function (set, k) {
    var combs = [], head, tailCombs;
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        for (var i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    for (var i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailCombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (var j = 0; j < tailCombs.length; j++) {
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
 * @returns
 */
export var GetAllPicks = function (_a) {
    var tavernsNum = _a.tavernsNum, playersNum = _a.playersNum;
    var temp = [], cartesian = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        if (a.length === 1) {
            a = a.flat();
        }
        return a.reduce(function (a, b) {
            return a.flatMap(function (d) { return b.map(function (e) {
                return [d, e].flat();
            }); });
        });
    };
    for (var i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined)
            .map(function (item, index) { return index; });
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
 * @todo Саше: сделать описание функции и параметров.
 */
var isAllCardsEqual = {
    heuristic: function (cards) { return cards.every(function (card) {
        return (card !== null && isCardNotAction(card) && isCardNotAction(cards[0]) && card.suit === cards[0].suit
            && CompareCards(card, cards[0]) === 0);
    }); },
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
var isAllWorse = {
    heuristic: function (array) { return array.every(function (item) { return item === -1; }); },
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
var isAllAverage = {
    heuristic: function (array) { return array.every(function (item) { return item === 0; }); },
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
var isAllBetter = {
    heuristic: function (array) { return array.every(function (item) { return item === 1; }); },
    weight: 10,
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
var isOnlyOneWorse = {
    heuristic: function (array) {
        return (array.filter(function (item) { return item === -1; }).length === 1);
    },
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
var isOnlyWorseOrBetter = {
    heuristic: function (array) { return array.every(function (item) { return item !== 0; }); },
    weight: -50,
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @todo Саше: сделать описание функции и параметров.
 */
var absoluteHeuristicsForTradingCoin = [isAllCardsEqual];
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
var GetCharacteristics = function (array) {
    var mean = array.reduce(function (acc, item) {
        return acc + item / array.length;
    }, 0), variation = array.reduce(function (acc, item) {
        return acc + (Math.pow((item - mean), 2)) / array.length;
    }, 0);
    return {
        mean: mean,
        variation: variation,
    };
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
var CompareCharacteristics = function (stat1, stat2) {
    var eps = 0.0001, tempVariation = stat1.variation - stat2.variation;
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
 * @param G
 * @param ctx
 * @returns
 */
export var CheckHeuristicsForCoinsPlacement = function (G, ctx) {
    var taverns = G.taverns /*,
        averageCards: ICard[] = G.averageCards*/;
    var result = Array(taverns.length).fill(0);
    var temp = taverns.map(function (tavern) {
        return absoluteHeuristicsForTradingCoin.reduce(function (acc, item) {
            return acc + (tavern !== null && item.heuristic(tavern) ? item.weight : 0);
        }, 0);
    });
    result = result.map(function (value, index) { return value + temp[index]; });
    var tempNumbers = taverns.map(function (tavern) { return tavern
        .map(function (card, index, arr) {
        return EvaluateCard(G, ctx, card, index, arr);
    }); });
    var tempChars = tempNumbers.map(function (element) {
        return GetCharacteristics(element);
    });
    var maxIndex = 0, minIndex = tempChars.length - 1;
    for (var i = 1; i < temp.length; i++) {
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
