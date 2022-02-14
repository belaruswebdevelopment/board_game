import { Ctx } from "boardgame.io";
import { IsMercenaryCard } from "../Camp";
import { ScoreWinner } from "../Score";
import { IBuffs } from "../typescript/buff_interfaces";
import { CampDeckCardTypes } from "../typescript/camp_card_types";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

export const CheckEndGame = (G: IMyGameState): boolean | void => {
    if (G.tierToEnd === 0) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean => buff.endTier !== undefined)));
        if (yludIndex !== -1) {
            return false;
        }
        const brisingamensIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean =>
                buff.discardCardEndGame !== undefined)));
        if (brisingamensIndex !== -1) {
            return false;
        }
        const mjollnirIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.find((buff: IBuffs): boolean =>
                buff.getMjollnirProfit !== undefined)));
        if (mjollnirIndex !== -1) {
            return false;
        }
        let allMercenariesPlayed = true;
        for (let i = 0; i < G.publicPlayers.length; i++) {
            allMercenariesPlayed = G.publicPlayers[i].campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCard(card)).length === 0;
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
