import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { BuffNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
export const DraupnirScoring = (G, player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    const basicScore = player.boardCoins.filter((coin, index) => {
        if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
            throw new Error(`В массиве монет игрока ${player.nickname} в руке не может быть закрыта монета с id ${index}.`);
        }
        return IsCoin(coin) && coin.value >= 15;
    }).length, odroerirScore = G.odroerirTheMythicCauldronCoins.filter((coin) => coin.value >= 15).length;
    return (basicScore + odroerirScore) * 6;
};
export const HrafnsmerkiScoring = (G, player) => {
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
export const MjollnirScoring = (G, player) => {
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
export const OdroerirTheMythicCauldronScoring = (G, player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    return GetOdroerirTheMythicCauldronCoinsValues(G);
};
export const SvalinnScoring = (G, player) => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.heroes.length * 5;
};
//# sourceMappingURL=ArtefactScoringHelpers.js.map