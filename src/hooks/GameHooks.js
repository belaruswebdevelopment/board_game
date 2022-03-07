import { IsMercenaryCampCard } from "../Camp";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ScoreWinner } from "../Score";
import { BuffNames } from "../typescript/enums";
export const CheckEndGame = (G) => {
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            return false;
        }
        const brisingamensIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
        if (brisingamensIndex !== -1) {
            return false;
        }
        const mjollnirIndex = G.publicPlayers.findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
        if (mjollnirIndex !== -1) {
            return false;
        }
        let allMercenariesPlayed = true;
        for (let i = 0; i < G.publicPlayers.length; i++) {
            const player = G.publicPlayers[i];
            if (player !== undefined) {
                allMercenariesPlayed =
                    player.campCards.filter((card) => IsMercenaryCampCard(card)).length === 0;
                if (!allMercenariesPlayed) {
                    break;
                }
            }
            else {
                throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
            }
        }
        return allMercenariesPlayed;
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