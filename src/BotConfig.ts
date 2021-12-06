import {CompareCards, EvaluateCard, IActionCard, ICard, isCardNotAction} from "./Card";
import {DeckCardTypes, MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param permutation
 * @constructor
 */
export const Permute = (permutation: number[]): number[][] => {
    const length: number = permutation.length,
        result: number[][] = [permutation.slice()];
    let c: number[] = new Array(length).fill(0),
        i: number = 1,
        k: number,
        p: number;
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
 */
export const k_combinations = (set: number[], k: number): number[][] => {
    let combs: number[][] = [],
        head: number[],
        tailCombs: number[][];
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        for (let i: number = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    for (let i: number = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailCombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (let j: number = 0; j < tailCombs.length; j++) {
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
 * @constructor
 */
export const GetAllPicks = ({tavernsNum, playersNum}: { tavernsNum: number, playersNum: number }) => {
    const temp: number[][] = [],
        cartesian = (...a: any) => {
            if (a.length === 1) {
                a = a.flat();
            }
            return a.reduce((a: number[][], b: number[][]): number[][] => a.flatMap((d: number[]): number[][] =>
                b.map((e: number[]): number[] => [d, e].flat())));
        };
    for (let i: number = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined).map((item: number, index: number): number => index);
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
 */
const isAllCardsEqual: { heuristic: (cards: DeckCardTypes[]) => boolean, weight: number } = {
    heuristic: (cards: DeckCardTypes[]): boolean => cards.every((card: DeckCardTypes | null): boolean =>
        (card !== null && isCardNotAction(card) && isCardNotAction(cards[0]) && card.suit === cards[0].suit
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
 *
 * @todo Саше: сделать описание функции и параметров.
 */
const isAllWorse: { heuristic: (array: number[]) => boolean, weight: number } = {
    heuristic: (array: number[]): boolean => array.every((item: number): boolean => item === -1),
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
 */
const isAllAverage: { heuristic: (array: number[]) => boolean, weight: number } = {
    heuristic: (array: number[]): boolean => array.every((item: number): boolean => item === 0),
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
 */
const isAllBetter: { heuristic: (array: number[]) => boolean, weight: number } = {
    heuristic: (array: number[]): boolean => array.every((item: number): boolean => item === 1),
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
 */
const isOnlyOneWorse: { heuristic: (array: number[]) => boolean, weight: number } = {
    heuristic: (array: number[]): boolean => (array.filter((item: number): boolean => item === -1).length === 1),
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
 */
const isOnlyWorseOrBetter: { heuristic: (array: number[]) => boolean, weight: number } = {
    heuristic: (array: number[]): boolean => array.every((item: number): boolean => item !== 0),
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
 */
const absoluteHeuristicsForTradingCoin: { heuristic: (cards: DeckCardTypes[]) => boolean, weight: number }[] =
    [isAllCardsEqual];

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 */
const relativeHeuristicsForTradingCoin: (((array: number[]) => boolean) | {
    heuristic: (array: number[]) => boolean,
    weight: number
})[] = [isAllWorse, isAllAverage, isAllBetter, isOnlyOneWorse, isOnlyWorseOrBetter];
console.log(relativeHeuristicsForTradingCoin ?? "");

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
 * @constructor
 */
const GetCharacteristics = (array: number[]): { mean: number, variation: number } => {
    const mean: number = array.reduce((acc: number, item: number): number => acc + item / array.length, 0),
        variation: number = array.reduce((acc: number, item: number): number => acc + ((item - mean) ** 2) / array.length, 0);
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
 * @constructor
 */
const CompareCharacteristics = (stat1: { variation: number, mean: number }, stat2: { variation: number, mean: number }):
    number => {
    const eps: number = 0.0001,
        tempVariation: number = stat1.variation - stat2.variation;
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
 * @constructor
 */
export const CheckHeuristicsForCoinsPlacement = (G: MyGameState, ctx: Ctx) => {
    const taverns: (DeckCardTypes | null)[][] = G.taverns/*,
        averageCards: ICard[] = G.averageCards*/;
    let result: number[] = Array(taverns.length).fill(0);
    const temp: number[] = taverns.map((tavern: (DeckCardTypes | null)[]): number => absoluteHeuristicsForTradingCoin
        .reduce((acc: number, item: { heuristic: (cards: DeckCardTypes[]) => boolean; weight: number }): number =>
            acc + (tavern !== null && item.heuristic(tavern as DeckCardTypes[]) ? item.weight : 0), 0));
    result = result.map((value: number, index: number) => value + temp[index]);
    const tempNumbers: number[][] = taverns.map((tavern: (DeckCardTypes | null)[]): number[] => tavern
        .map((card: ICard | IActionCard | null, index: number, arr: (DeckCardTypes | null)[]): number =>
            EvaluateCard(G, ctx, card as ICard, index, arr)));
    const tempChars: { mean: number; variation: number }[] = tempNumbers.map((element: number[]):
    { mean: number, variation: number } => GetCharacteristics(element));
    let maxIndex: number = 0,
        minIndex: number = tempChars.length - 1;
    for (let i: number = 1; i < temp.length; i++) {
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
