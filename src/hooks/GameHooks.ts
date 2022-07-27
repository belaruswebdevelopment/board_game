import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { ScoreWinner } from "../Score";
import { BuffNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndGame = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (G.tierToEnd === 0) {
        const yludIndex: number =
            Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                CheckPlayerHasBuff(player, BuffNames.EndTier));
        if (yludIndex !== -1) {
            return false;
        }
        if (G.expansions.thingvellir.active) {
            const brisingamensIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensIndex !== -1) {
                return false;
            }
            const mjollnirIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
            if (mjollnirIndex !== -1) {
                return false;
            }
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        i);
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
export const ReturnEndGameData = (G: IMyGameState, ctx: Ctx): CanBeVoidType<IMyGameState> => ScoreWinner(G, ctx);
