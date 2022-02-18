import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript_enums/enums";
import { TotalRank } from "./ScoreHelpers";
export const AstridScoring = (player) => {
    if (player !== undefined) {
        return GetMaxCoinValue(player);
    }
    // TODO error!?
    return 0;
};
export const IdunnScoring = (player) => {
    if (player !== undefined) {
        return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;
    }
    // TODO error!?
    return 0;
};
//# sourceMappingURL=HeroScoringHelpers.js.map