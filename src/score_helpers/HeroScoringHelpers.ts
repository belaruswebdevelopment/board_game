import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import type { IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const AstridScoring = (G?: IMyGameState, playerId?: number): number => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    return GetMaxCoinValue(G, playerId);

};

export const IdunnScoring = (G?: IMyGameState, playerId?: number): number => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;

};
