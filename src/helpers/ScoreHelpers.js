"use strict";
exports.__esModule = true;
exports.ArithmeticSum = exports.TotalRank = exports.TotalPoints = void 0;
/**
 * <h3>Высчитывает суммарное количество очков фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте очков фракций, не зависящих от количества шевронов.</li>
 * </ol>
 *
 * @param accumulator <i>Аккумулятивное значение очков.</i>
 * @param currentValue <i>Текущее значение очков.</i>
 * @returns {*} <i>Суммарное количество очков фракции.</i>
 * @constructor
 */
var TotalPoints = function (accumulator, currentValue) {
    if (currentValue.points) {
        return accumulator + currentValue.points;
    }
    return accumulator;
};
exports.TotalPoints = TotalPoints;
/**
 * <h3>Высчитывает суммарное количество шевронов фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте шевронов фракций, не зависящих от количества очков.</li>
 * </ol>
 *
 * @param accumulator Аккумулятивное значение шевронов.
 * @param currentValue Текущее значение шевронов.
 * @returns {*} Суммарное количество шевронов фракции.
 * @constructor
 */
var TotalRank = function (accumulator, currentValue) {
    if (currentValue.rank) {
        return accumulator + currentValue.rank;
    }
    return accumulator;
};
exports.TotalRank = TotalRank;
/**
 * <h3>Подсчитывает количество очков фракции в арифметической прогрессии, зависящих от числа шевронов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется для подсчёта очков фракции, зависящих от арифметической прогрессии очков по количеству шевронов (фракция кузнецов).</li>
 * </ol>
 *
 * @param startValue Стартовое значение очков.
 * @param step Шаг.
 * @param ranksCount Суммарное количество шевронов.
 * @returns {number} Суммарное количество очков фракции.
 * @constructor
 */
var ArithmeticSum = function (startValue, step, ranksCount) { return (2 * startValue + step *
    (ranksCount - 1)) * ranksCount / 2; };
exports.ArithmeticSum = ArithmeticSum;
