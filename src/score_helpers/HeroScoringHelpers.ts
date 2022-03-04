import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import type { IPublicPlayer } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const AstridScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        return GetMaxCoinValue(player);
    }
    throw new Error(`Function param 'player' is undefined.`);
};

export const IdunnScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
