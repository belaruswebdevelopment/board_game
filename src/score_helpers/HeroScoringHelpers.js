import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
export const AstridScoring = (G, playerId) => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    return GetMaxCoinValue(G, playerId);
};
export const IdunnScoring = (G, playerId) => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;
};
//# sourceMappingURL=HeroScoringHelpers.js.map