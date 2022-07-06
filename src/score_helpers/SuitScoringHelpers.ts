import { HeroNames, SuitNames } from "../typescript/enums";
import type { PlayerCardTypes, SuitTypes } from "../typescript/interfaces";
import { ArithmeticSum, TotalPoints, TotalRank } from "./ScoreHelpers";

/**
* <h3>Получение победных очков по фракциям дворфов.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по фракциям дворфов.</li>
* </ol>
*
* @param player Игрок.
* @param heroName Название фракции дворфов.
* @returns Количество очков по фракциям дворфов.
*/
export const SuitScoring = (cards: PlayerCardTypes[], suit: SuitTypes, potentialCardValue = 0,
    additionalScoring = false): number => {
    switch (suit) {
        case SuitNames.Blacksmith:
            return BlacksmithScoring(cards, potentialCardValue);
        case SuitNames.Explorer:
            return ExplorerScoring(cards, potentialCardValue);
        case SuitNames.Hunter:
            return HunterScoring(cards, potentialCardValue);
        case SuitNames.Miner:
            return MinerScoring(cards, potentialCardValue, additionalScoring);
        case SuitNames.Warrior:
            return WarriorScoring(cards, potentialCardValue);
        default:
            throw new Error(`У фракций отсутствует фракция с названием '${suit}'.`);
    }
};

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
* @returns Суммарное количество очков по фракции разведчиков.
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
* @returns Суммарное количество очков по фракции охотников.
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
* @returns Суммарное количество очков по фракции горняков.
*/
export const MinerScoring = (cards: PlayerCardTypes[], potentialCardValue = 0, additionalScoring = false): number => {
    let ratatoskValue = 0;
    if (additionalScoring) {
        let zeroRankValue = 0;
        cards.forEach((card: PlayerCardTypes): void => {
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
export const WarriorScoring = (cards: PlayerCardTypes[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;
