import { Ctx } from "boardgame.io";
import { ScoreWinner } from "../Score";
import { CampDeckCardTypes } from "../typescript/card_types";
import { DrawNames, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

export const CheckEndGame = (G: IMyGameState): boolean | void => {
    if (G.tierToEnd === 0) {
        const yludIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            player.buffs.endTier === DrawNames.Ylud);
        if (yludIndex !== -1) {
            return false;
        }
        const brisingamensIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.discardCardEndGame));
        if (brisingamensIndex !== -1) {
            return false;
        }
        const mjollnirIndex = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
            Boolean(player.buffs.getMjollnirProfit));
        if (mjollnirIndex !== -1) {
            return false;
        }
        let allMercenariesPlayed = true;
        for (let i = 0; i < G.publicPlayers.length; i++) {
            allMercenariesPlayed = G.publicPlayers[i].campCards
                .filter((card: CampDeckCardTypes): boolean =>
                    card.type === RusCardTypes.MERCENARY).length === 0;
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
