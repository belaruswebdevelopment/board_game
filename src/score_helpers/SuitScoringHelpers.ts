import { PlayerCardsType } from "../typescript/interfaces";
import { ArithmeticSum, TotalPoints, TotalRank } from "./ScoreHelpers";

export const BlacksmithScoring = (cards: PlayerCardsType[], potentialCardValue = 0): number =>
    ArithmeticSum(3, 1, (cards.reduce(TotalRank, 0) +
        potentialCardValue));

export const ExplorerScoring = (cards: PlayerCardsType[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;

export const HunterScoring = (cards: PlayerCardsType[], potentialCardValue = 0): number =>
    (cards.reduce(TotalRank, 0) + potentialCardValue) ** 2;

export const MinerScoring = (cards: PlayerCardsType[], potentialCardValue = 0): number =>
    (cards.reduce(TotalRank, 0) + (potentialCardValue ? 1 : 0)) *
    (cards.reduce(TotalPoints, 0) + potentialCardValue);

export const WarriorScoring = (cards: PlayerCardsType[], potentialCardValue = 0): number =>
    cards.reduce(TotalPoints, 0) + potentialCardValue;
