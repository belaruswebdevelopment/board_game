import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
export const AstridScoring = (player) => {
    if (player !== undefined) {
        return GetMaxCoinValue(player);
    }
    throw new Error(`Function param 'player' is undefined.`);
};
export const IdunnScoring = (player) => {
    if (player !== undefined) {
        return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
//# sourceMappingURL=HeroScoringHelpers.js.map