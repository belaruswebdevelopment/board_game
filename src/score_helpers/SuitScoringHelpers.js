import { ArithmeticSum, TotalPoints, TotalRank } from "./ScoreHelpers";
export const BlacksmithScoring = (cards, potentialCardValue = 0) => ArithmeticSum(3, 1, (cards.reduce(TotalRank, 0) +
    potentialCardValue));
export const ExplorerScoring = (cards, potentialCardValue = 0) => cards.reduce(TotalPoints, 0) + potentialCardValue;
export const HunterScoring = (cards, potentialCardValue = 0) => (cards.reduce(TotalRank, 0) + potentialCardValue) ** 2;
export const MinerScoring = (cards, potentialCardValue = 0) => (cards.reduce(TotalRank, 0) + (potentialCardValue ? 1 : 0)) *
    (cards.reduce(TotalPoints, 0) + potentialCardValue);
export const WarriorScoring = (cards, potentialCardValue = 0) => cards.reduce(TotalPoints, 0) + potentialCardValue;
//# sourceMappingURL=SuitScoringHelpers.js.map