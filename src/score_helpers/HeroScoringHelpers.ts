import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
import type { CanBeUndef, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по герою Astrid.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Astrid.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const AstridScoring = (G?: IMyGameState, playerId?: number): number => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    return GetMaxCoinValue(G, playerId);

};

/**
 * <h3>Получение победных очков по герою Idunn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по герою Idunn.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const IdunnScoring = (G?: IMyGameState, playerId?: number): number => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;

};
