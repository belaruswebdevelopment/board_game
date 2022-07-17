import type { Ctx } from "boardgame.io";
import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, StageNames } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IMyGameState, IPublicPlayer, IStack, PlayerCardTypes } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

/**
 * <h3>Проверяет возможность взятия нового героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при расположении на планшете игрока карта из таверны.</li>
 * <li>Происходит при завершении действия взятых героев.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Илуд.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Труд.</li>
 * <li>Происходит при перемещении на планшете игрока карта героя Труд.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickHero = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards: PlayerCardTypes[][] = Object.values(player.cards),
            heroesLength: number = G.solo ? player.heroes.filter((hero: IHeroCard): boolean =>
                hero.name.startsWith(`Dwerg`)).length : player.heroes.length,
            isCanPickHero: boolean =
                Math.min(...playerCards.map((item: PlayerCardTypes[]): number =>
                    item.reduce(TotalRank, 0))) > heroesLength,
            playerPickHeroActionInStackIndex: number = player.stack.findIndex((stack: IStack): boolean =>
                stack.stageName === StageNames.PickHero);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction(G, ctx);
        }
    }
};
