import { IsDwarfCard } from "../Dwarf";
import { CompareCards, EvaluateCard } from "./BotCardLogic";
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns
 */
export const CheckHeuristicsForCoinsPlacement = (G, ctx) => {
    const taverns = G.taverns, temp = taverns.map((tavern) => absoluteHeuristicsForTradingCoin.reduce((acc, item) => acc + (item.heuristic(tavern) ? item.weight : 0), 0)), result = Array(taverns.length).fill(0).map((value, index) => {
        const num = temp[index];
        if (num === undefined) {
            throw new Error(`Отсутствует значение с id '${index}'.`);
        }
        return value + num;
    }), tempNumbers = taverns.map((tavern) => tavern.map((card, index, arr) => EvaluateCard(G, ctx, card, index, arr))), tempChars = tempNumbers.map((element) => GetCharacteristics(element)) /*,
averageCards: ICard[] = G.averageCards*/;
    let maxIndex = 0, minIndex = tempChars.length - 1;
    for (let i = 1; i < temp.length; i++) {
        const maxCard = tempChars[maxIndex], tempCard1 = tempChars[i];
        if (maxCard === undefined) {
            throw new Error(`Отсутствует значение максимальной карты с id '${maxIndex}'.`);
        }
        if (tempCard1 === undefined) {
            throw new Error(`Отсутствует значение '1' темп карты с id '${i}'.`);
        }
        if (CompareCharacteristics(maxCard, tempCard1) < 0) {
            maxIndex = i;
        }
        const minCard = tempChars[minIndex], tempCard2 = tempChars[tempChars.length - 1 - i];
        if (minCard === undefined) {
            throw new Error(`Отсутствует значение минимальной карты с id '${minIndex}'.`);
        }
        if (tempCard2 === undefined) {
            throw new Error(`Отсутствует значение 2 темп карты с id '${tempChars.length - 1 - i}'.`);
        }
        if (CompareCharacteristics(minCard, tempCard2) > 0) {
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
 * @TODO Саше: сделать описание функции и параметров.
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
 * <h3>Получает все комбинации взятия карт из всех таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При формировании данных для ботов.</li>
 * </oL>
 *
 * @param tavernsNum Количество таверн.
 * @param playersNum Количество игроков.
 * @returns Перечень всех комбинаций взятия карт.
 */
export const GetAllPicks = (tavernsNum, playersNum) => {
    const temp = [], cartesian = (...arrays) => arrays.reduce((accSets, set) => 
    // TODO It's only validation or can be!?
    // if (a.length === 1) {
    //     a = a.flat();
    // }
    accSets.flatMap((accSet) => set.map((value) => [...accSet, value])), [[]]);
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined)
            .map((item, index) => index);
    }
    return cartesian(...temp);
};
//may be to add different kinds of variation (1-order, 2-order, 4-order, ..., infinity-order)
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
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
 * @TODO Саше: сделать описание функции и параметров.
 */
const isAllCardsEqual = {
    heuristic: (cards) => cards.every((card) => (IsDwarfCard(card) && IsDwarfCard(cards[0]) && card.suit === cards[0].suit
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
 * @TODO Саше: сделать описание функции и параметров.
 */
// const isAllAverage: IHeuristic<number[]> = {
//     heuristic: (array: number[]): boolean => array.every((item: number): boolean => item === 0),
//     weight: 20,
// };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
// const isAllWorse: IHeuristic<number[]> = {
//     heuristic: (array: number[]): boolean => array.every((item: number): boolean => item === -1),
//     weight: 40,
// };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
// const isOnlyOneWorse: IHeuristic<number[]> = {
//     heuristic: (array: number[]): boolean =>
//         (array.filter((item: number): boolean => item === -1).length === 1),
//     weight: -100,
// };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
// const isOnlyWorseOrBetter: IHeuristic<number[]> = {
//     heuristic: (array: number[]): boolean => array.every((item: number): boolean => item !== 0),
//     weight: -50,
// };
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param set
 * @param k
 * @returns
 */
export const k_combinations = (set, k) => {
    const combs = [];
    let head, tailCombs;
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        for (let i = 0; i < set.length; i++) {
            const num1 = set[i];
            if (num1 === undefined) {
                throw new Error(`Отсутствует значение с id '${i}'.`);
            }
            combs.push([num1]);
        }
        return combs;
    }
    for (let i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailCombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current and store it to the set of k-combinations.
        for (let j = 0; j < tailCombs.length; j++) {
            const num2 = tailCombs[j];
            if (num2 === undefined) {
                throw new Error(`Отсутствует значение с id '${i}'.`);
            }
            combs.push(head.concat(num2));
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
 * @TODO Саше: сделать описание функции и параметров.
 * @param permutation
 * @returns
 */
export const Permute = (permutation) => {
    const length = permutation.length, result = [permutation.slice()], c = new Array(length).fill(0);
    let i = 1, k, p;
    while (i < length) {
        const num = c[i];
        if (num === undefined) {
            throw new Error(`Отсутствует значение '1' с id '${i}'.`);
        }
        if (num < i) {
            k = i % 2 && num;
            const permI = permutation[i];
            if (permI === undefined) {
                throw new Error(`Отсутствует значение '2' с id '${i}'.`);
            }
            p = permI;
            const permK = permutation[k];
            if (permK === undefined) {
                throw new Error(`Отсутствует значение '3' с id '${i}'.`);
            }
            permutation[i] = permK;
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
 * @TODO Саше: сделать описание функции и параметров.
 */
const absoluteHeuristicsForTradingCoin = [isAllCardsEqual];
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
// const relativeHeuristicsForTradingCoin: (((array: number[]) => boolean) | IHeuristic<number[]>)[] =
// [isAllWorse, isAllAverage, isAllBetter, isOnlyOneWorse, isOnlyWorseOrBetter];
// console.log(relativeHeuristicsForTradingCoin ?? "");
//# sourceMappingURL=BotConfig.js.map