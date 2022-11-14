import { RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndefType, FnContext, ICardCharacteristics, IHeuristic, TavernAllCardType, TavernCardType, TavernsType } from "../typescript/interfaces";
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
 * @returns Результат эвристики.
 */
export const CheckHeuristicsForCoinsPlacement = ({ G, ctx, ...rest }: FnContext): number[] => {
    const taverns: TavernsType = G.taverns,
        temp: number[] = taverns.map((tavern: TavernAllCardType): number =>
            absoluteHeuristicsForTradingCoin.reduce((acc: number, item: IHeuristic<TavernAllCardType>):
                number => acc + (item.heuristic(tavern) ? item.weight : 0), 0)),
        result: number[] =
            Array(taverns.length).fill(0).map((value: number, index: number):
                number => {
                const num: CanBeUndefType<number> = temp[index];
                if (num === undefined) {
                    throw new Error(`Отсутствует значение с id '${index}'.`);
                }
                return value + num;
            }),
        tempNumbers: number[][] = taverns.map((tavern: TavernAllCardType): number[] =>
            tavern.map((card: TavernCardType, index: number, arr: TavernAllCardType): number =>
                EvaluateCard({ G, ctx, ...rest }, card, index, arr))),
        tempChars: ICardCharacteristics[] = tempNumbers.map((element: number[]): ICardCharacteristics =>
            GetCharacteristics(element))/*,
        averageCards: ICard[] = G.averageCards*/;
    let maxIndex = 0,
        minIndex: number = tempChars.length - 1;
    for (let i = 1; i < temp.length; i++) {
        const maxCard: CanBeUndefType<ICardCharacteristics> = tempChars[maxIndex],
            tempCard1: CanBeUndefType<ICardCharacteristics> = tempChars[i];
        if (maxCard === undefined) {
            throw new Error(`Отсутствует значение максимальной карты с id '${maxIndex}'.`);
        }
        if (tempCard1 === undefined) {
            throw new Error(`Отсутствует значение '1' темп карты с id '${i}'.`);
        }
        if (CompareCharacteristics(maxCard, tempCard1) < 0) {
            maxIndex = i;
        }
        const minCard: CanBeUndefType<ICardCharacteristics> = tempChars[minIndex],
            tempCard2: CanBeUndefType<ICardCharacteristics> = tempChars[tempChars.length - 1 - i];
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
 * @returns Результат сравнения двух эвристик.
 */
const CompareCharacteristics = (stat1: ICardCharacteristics, stat2: ICardCharacteristics): number => {
    const eps = 0.0001,
        tempVariation: number = stat1.variation - stat2.variation;
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
export const GetAllPicks = (tavernsNum: number, playersNum: number): number[][] => {
    const temp: number[][] = [],
        cartesian = (...arrays: number[][]): number[][] =>
            arrays.reduce((accSets: number[][], set: number[]): number[][] =>
                // TODO It's only validation or can be!?
                // if (a.length === 1) {
                //     a = a.flat();
                // }
                accSets.flatMap((accSet: number[]): number[][] =>
                    set.map((value: number): number[] => [...accSet, value])), [[]]);
    for (let i = 0; i < tavernsNum; i++) {
        temp[i] = Array(playersNum).fill(undefined)
            .map((item: undefined, index: number): number => index);
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
 * @returns Характеристики карты для ботов.
 */
const GetCharacteristics = (array: number[]): ICardCharacteristics => {
    const mean: number = array.reduce((acc: number, item: number): number =>
        acc + item / array.length, 0),
        variation: number = array.reduce((acc: number, item: number): number =>
            acc + ((item - mean) ** 2) / array.length, 0);
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
const isAllCardsEqual: IHeuristic<TavernAllCardType> = {
    // TODO Add errors for undefined
    heuristic: (cards: TavernCardType[]): boolean => cards.every((card: TavernCardType): boolean =>
    (card !== null && card.type === RusCardTypeNames.Dwarf_Card && cards[0] !== undefined && cards[0] !== null
        && cards[0].type === RusCardTypeNames.Dwarf_Card && card.suit === cards[0].suit
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
 * @returns Все комбинации расположения монет.
 */
export const k_combinations = (set: number[], k: number): number[][] => {
    const combs: number[][] = [];
    let head: number[],
        tailCombs: number[][];
    if (k > set.length || k <= 0) {
        return [];
    }
    if (k === set.length) {
        return [set];
    }
    if (k === 1) {
        for (let i = 0; i < set.length; i++) {
            const num1: CanBeUndefType<number> = set[i];
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
            const num2: CanBeUndefType<number[]> = tailCombs[j];
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
 * @returns Результат перестановки.
 */
export const Permute = (permutation: number[]): number[][] => {
    const length: number = permutation.length,
        result: number[][] = [permutation.slice()],
        c: number[] = new Array(length).fill(0);
    let i = 1,
        k: number,
        p: number;
    while (i < length) {
        const num: CanBeUndefType<number> = c[i];
        if (num === undefined) {
            throw new Error(`Отсутствует значение '1' с id '${i}'.`);
        }
        if (num < i) {
            k = i % 2 && num;
            const permI: CanBeUndefType<number> = permutation[i];
            if (permI === undefined) {
                throw new Error(`Отсутствует значение '2' с id '${i}'.`);
            }
            p = permI;
            const permK: CanBeUndefType<number> = permutation[k];
            if (permK === undefined) {
                throw new Error(`Отсутствует значение '3' с id '${i}'.`);
            }
            permutation[i] = permK;
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
 * @TODO Саше: сделать описание функции и параметров.
 */
const absoluteHeuristicsForTradingCoin: IHeuristic<TavernAllCardType>[] = [isAllCardsEqual];

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
