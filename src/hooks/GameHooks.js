import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { ScoreWinner } from "../Score";
import { BuffNames, ErrorNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любом действии.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Должна ли быть завершена игра.
 */
export const CheckEndGame = (G, ctx) => {
    if (G.tierToEnd === 0) {
        const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            return false;
        }
        if (G.expansions.thingvellir.active) {
            const brisingamensIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensIndex !== -1) {
                return false;
            }
            const mjollnirIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
            if (mjollnirIndex !== -1) {
                return false;
            }
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                allMercenariesPlayed = player.campCards.filter(IsMercenaryCampCard).length === 0;
                if (!allMercenariesPlayed) {
                    break;
                }
            }
            return allMercenariesPlayed;
        }
        return true;
    }
};
/**
 * <h3>Формирует данные окончания игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Финальные данные о игре.
 */
export const ReturnEndGameData = (G, ctx) => ScoreWinner(G, ctx);
//# sourceMappingURL=GameHooks.js.map