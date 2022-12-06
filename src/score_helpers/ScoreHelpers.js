import { ThrowMyError } from "../Error";
import { ErrorNames, HeroNames, SuitNames } from "../typescript/enums";
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
 * @returns Суммарное количество очков фракции.
 */
export const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;
/**
 * <h3>Высчитывает суммарное количество очков за карты, зависящие от множителя за количество шевронов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте очков за карты, зависящие от множителя за количество шевронов.</li>
 * </ol>
 *
 * @param player Игрок.
 * @param suit Фракция.
 * @param multiplier Множитель.
 * @returns Суммарное количество очков за множитель.
 */
export const GetRanksValueMultiplier = ({ G, ctx, myPlayerID, ...rest }, suit, multiplier) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    return player.cards[suit].reduce(TotalRank, 0) * multiplier;
};
/**
 * <h3>Высчитывает суммарное количество очков фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте очков фракций, не зависящих от количества шевронов.</li>
 * </ol>
 *
 * @param accumulator Аккумулятивное значение очков.
 * @param currentValue Текущее значение очков.
 * @returns Суммарное количество очков фракции.
 */
export const TotalPoints = (accumulator, currentValue) => {
    if (currentValue.points !== null) {
        return accumulator + currentValue.points;
    }
    return accumulator;
};
/**
 * <h3>Высчитывает суммарное количество шевронов фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте шевронов фракций, не зависящих от количества очков.</li>
 * </ol>
 *
 * @param accumulator Аккумулятивное значение шевронов.
 * @param currentValue Текущее значение шевронов.
 * @returns Суммарное количество шевронов фракции.
 */
export const TotalRank = (accumulator, currentValue) => {
    if (currentValue.rank !== null) {
        return accumulator + currentValue.rank;
    }
    return accumulator;
};
/**
 * <h3>Высчитывает суммарное количество шевронов фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте шевронов фракций, не зависящих от количества очков.</li>
 * </ol>
 *
 * @param accumulator Аккумулятивное значение шевронов.
 * @param currentValue Текущее значение шевронов.
 * @returns Суммарное количество шевронов фракции.
 */
export const TotalRankWithoutThrud = (accumulator, currentValue) => {
    if (currentValue.name !== HeroNames.Thrud && currentValue.rank !== null) {
        return accumulator + currentValue.rank;
    }
    return accumulator;
};
//# sourceMappingURL=ScoreHelpers.js.map