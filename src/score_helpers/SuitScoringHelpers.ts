import { HeroNames } from "../typescript/enums";
import type { ISuitScoringFunction, PlayerCardType } from "../typescript/interfaces";
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
 * @returns Суммарное количество очков по фракции кузнецов.
 */
export const BlacksmithScoring: ISuitScoringFunction = (cards: PlayerCardType[], potentialCardValue = 0): number =>
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
* @returns Суммарное количество очков по фракции разведчиков.
*/
export const ExplorerScoring: ISuitScoringFunction = (cards: PlayerCardType[], potentialCardValue = 0): number =>
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
* @returns Суммарное количество очков по фракции охотников.
*/
export const HunterScoring: ISuitScoringFunction = (cards: PlayerCardType[], potentialCardValue = 0): number =>
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
* @param additionalScoring Дополнительное значение специфической карты.
* @returns Суммарное количество очков по фракции горняков.
*/
export const MinerScoring: ISuitScoringFunction = (cards: PlayerCardType[], potentialCardValue = 0,
    additionalScoring = false): number => {
    let ratatoskValue = 0;
    if (additionalScoring) {
        let zeroRankValue = 0;
        cards.forEach((card: PlayerCardType): void => {
            if (card.points === 0) {
                zeroRankValue += 1;
            } else if (card.name === HeroNames.Zoral) {
                zeroRankValue += 2;
            }
        });
        ratatoskValue = Math.floor(zeroRankValue / 2);
    }
    return (cards.reduce(TotalRank, 0) + potentialCardValue) *
        (cards.reduce(TotalPoints, 0) + ratatoskValue + potentialCardValue);
};

/**
* <h3>Получение победных очков по фракции воинов.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракции воинов.</li>
* </ol>
*
* @param cards Массив карт.
* @param potentialCardValue Потенциальное значение карты для ботов.
* @returns Суммарное количество очков по фракции воинов.
*/
export const WarriorScoring: ISuitScoringFunction = (cards: PlayerCardType[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;
