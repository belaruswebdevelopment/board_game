import { IsMercenaryCard } from "../Camp";
import { ScoreWinner } from "../Score";
export const CheckEndGame = (G) => {
    if (G.tierToEnd === 0) {
        const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
        if (yludIndex !== -1) {
            return false;
        }
        const brisingamensIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.discardCardEndGame !== undefined)));
        if (brisingamensIndex !== -1) {
            return false;
        }
        const mjollnirIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.getMjollnirProfit !== undefined)));
        if (mjollnirIndex !== -1) {
            return false;
        }
        let allMercenariesPlayed = true;
        for (let i = 0; i < G.publicPlayers.length; i++) {
            allMercenariesPlayed = G.publicPlayers[i].campCards.filter((card) => IsMercenaryCard(card)).length === 0;
            if (!allMercenariesPlayed) {
                break;
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