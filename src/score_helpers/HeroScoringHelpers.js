import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { SuitNames } from "../typescript/enums";
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
export const AstridScoring = (G, playerId) => {
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
export const IdunnScoring = (G, playerId) => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (playerId === undefined) {
        throw new Error(`Function param 'playerId' is undefined.`);
    }
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    return player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2;
};
//# sourceMappingURL=HeroScoringHelpers.js.map