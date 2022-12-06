import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMercenaryCampCard } from "../helpers/IsCampTypeHelpers";
import { ScoreWinner } from "../Score";
import { CampBuffNames, ErrorNames, HeroBuffNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, IMyGameState, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любом действии.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения игры.
 */
export const CheckEndGame = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (G.tierToEnd === 0) {
        const yludIndex: number =
            Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
                CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                    HeroBuffNames.EndTier));
        if (yludIndex !== -1) {
            return false;
        }
        if (G.expansions.Thingvellir.active) {
            const brisingamensIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number):
                    boolean => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                        CampBuffNames.DiscardCardEndGame));
            if (brisingamensIndex !== -1) {
                return false;
            }
            const mjollnirIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number):
                    boolean => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                        CampBuffNames.GetMjollnirProfit));
            if (mjollnirIndex !== -1) {
                return false;
            }
            let allMercenariesPlayed = true;
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
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
export const ReturnEndGameData = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<IMyGameState> =>
    ScoreWinner({ G, ctx, ...rest });
