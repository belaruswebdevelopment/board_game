import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ScoreWinner } from "../Score";
import { BuffNames, ErrorNames, RusCardTypeNames } from "../typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

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
export const CheckEndGame = (G: IMyGameState, ctx: Ctx): boolean | void => {
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
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        i);
                }
                allMercenariesPlayed = player.campCards.filter((card: CampDeckCardTypes): boolean =>
                    card.type === RusCardTypeNames.Mercenary_Card).length === 0;
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
export const ReturnEndGameData = (G: IMyGameState, ctx: Ctx): IMyGameState | void => ScoreWinner(G, ctx);
