import type { PlayerCardTypes } from "../typescript/interfaces";
import { ArithmeticSum, TotalPoints, TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по фракции кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по фракции кузнецов.</li>
 * </ol>
 *
 * @param cards Массив карт.
 * @param potentialCardValue Потенциальное значение карты для ботов.
 * @returns
 */
export const BlacksmithScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    ArithmeticSum(3, 1, (cards.reduce(TotalRank, 0) +
        potentialCardValue));

/**
* <h3>Получение победных очков по фракции разведчиков.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции разведчиков.</li>
* </ol>
*
* @param cards Массив карт.
* @param potentialCardValue Потенциальное значение карты для ботов.
* @returns
*/
export const ExplorerScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;

/**
* <h3>Получение победных очков по фракции охотников.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции охотников.</li>
* </ol>
*
* @param cards Массив карт.
* @param potentialCardValue Потенциальное значение карты для ботов.
* @returns
*/
export const HunterScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    (cards.reduce(TotalRank, 0) + potentialCardValue) ** 2;

/**
* <h3>Получение победных очков по фракции горняков.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции горняков.</li>
* </ol>
*
* @param cards Массив карт.
* @param potentialCardValue Потенциальное значение карты для ботов.
* @returns
*/
export const MinerScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    (cards.reduce(TotalRank, 0) + (potentialCardValue ? 1 : 0)) *
    (cards.reduce(TotalPoints, 0) + potentialCardValue);

/**
* <h3>Получение победных очков по фракции воинов.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции воинов.</li>
* </ol>
*
* @param cards Массив карт.
* @param potentialCardValue Потенциальное значение карты для ботов.
* @returns
*/
export const WarriorScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;
