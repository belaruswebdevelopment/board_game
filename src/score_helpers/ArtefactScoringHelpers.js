import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { BuffNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
export const DraupnirScoring = (player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.boardCoins.filter((coin) => IsCoin(coin) && coin.value >= 15).length * 6;
};
export const HrafnsmerkiScoring = (player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    let score = 0, suit;
    for (suit in player.cards) {
        if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
            score += player.cards[suit].filter((card) => IsMercenaryPlayerCard(card)).length * 5;
        }
    }
    return score;
};
export const MjollnirScoring = (player) => {
    var _a;
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    const suit = (_a = player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined)) === null || _a === void 0 ? void 0 : _a.suitIdForMjollnir;
    if (suit === undefined) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.SuitIdForMjollnir}'.`);
    }
    return player.cards[suit].reduce(TotalRank, 0) * 2;
};
export const OdroerirTheMythicCauldronScoring = (player, G) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    return GetOdroerirTheMythicCauldronCoinsValues(G);
};
export const SvalinnScoring = (player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.heroes.length * 5;
};
//# sourceMappingURL=ArtefactScoringHelpers.js.map