import { CheckIsMercenaryCampCardInPlayerCards } from "../Card";
import { IsCoin } from "../Coin";
import { BuffNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
export const DraupnirScoring = (player) => {
    if (player !== undefined) {
        return player.boardCoins.filter((coin) => IsCoin(coin) && coin.value >= 15).length * 6;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
export const HrafnsmerkiScoring = (player) => {
    if (player !== undefined) {
        let score = 0, suit;
        for (suit in player.cards) {
            if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
                score += player.cards[suit].filter((card) => CheckIsMercenaryCampCardInPlayerCards(card)).length * 5;
            }
        }
        return score;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
export const MjollnirScoring = (player) => {
    var _a;
    if (player !== undefined) {
        const suit = (_a = player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined)) === null || _a === void 0 ? void 0 : _a.suitIdForMjollnir;
        if (suit === undefined) {
            throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.SuitIdForMjollnir}'.`);
        }
        return player.cards[suit].reduce(TotalRank, 0) * 2;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
export const SvalinnScoring = (player) => {
    if (player !== undefined) {
        return player.heroes.length * 5;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
//# sourceMappingURL=ArtefactScoringHelpers.js.map