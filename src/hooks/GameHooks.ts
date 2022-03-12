import type { Ctx } from "boardgame.io";
import { IsMercenaryCampCard } from "../Camp";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ScoreWinner } from "../Score";
import { BuffNames } from "../typescript/enums";
import type { CampDeckCardTypes, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

export const CheckEndGame = (G: IMyGameState): boolean | void => {
    if (G.tierToEnd === 0) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            return false;
        }
        const brisingamensIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
        if (brisingamensIndex !== -1) {
            return false;
        }
        const mjollnirIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
        if (mjollnirIndex !== -1) {
            return false;
        }
        let allMercenariesPlayed = true;
        for (let i = 0; i < G.publicPlayers.length; i++) {
            const player: IPublicPlayer | undefined = G.publicPlayers[i];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
            }
            allMercenariesPlayed = player.campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCampCard(card)).length === 0;
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
export const ReturnEndGameData = (G: IMyGameState, ctx: Ctx): IMyGameState | void => ScoreWinner(G, ctx);
