import { IsMercenaryCard } from "../Camp";
import { TotalRank } from "./ScoreHelpers";
export const DraupnirScoring = (player) => {
    if (player !== undefined) {
        return player.boardCoins.filter((coin) => Boolean(coin !== null && coin.value >= 15)).length * 6;
    }
    // TODO error!?
    return 0;
};
export const HrafnsmerkiScoring = (player) => {
    if (player !== undefined) {
        let score = 0;
        for (const suit in player.cards) {
            if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
                score += player.cards[suit].filter((card) => IsMercenaryCard(card)).length * 5;
            }
        }
        return score;
    }
    // TODO error!?
    return 0;
};
export const MjollnirScoring = (player) => {
    var _a;
    if (player !== undefined) {
        const suit = (_a = player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined)) === null || _a === void 0 ? void 0 : _a.suitIdForMjollnir;
        if (suit !== undefined) {
            return player.cards[suit].reduce(TotalRank, 0) * 2;
        }
        else {
            // TODO Error suitIdForMjollnir must be!
        }
    }
    // TODO error!?
    return 0;
};
export const SvalinnScoring = (player) => {
    if (player !== undefined) {
        return player.heroes.length * 5;
    }
    // TODO error!?
    return 0;
};
//# sourceMappingURL=ArtefactScoringHelpers.js.map