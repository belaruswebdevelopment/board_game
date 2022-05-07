import type { Ctx } from "boardgame.io";
import { AddPickHeroAction } from "../actions/CampAutoActions";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, Stages } from "../typescript/enums";
import type { IHeroCard, IMyGameState, IPublicPlayer, IStack, PlayerCardsType } from "../typescript/interfaces";
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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards: PlayerCardsType[][] = Object.values(player.cards),
            heroesLength: number = G.solo ? player.heroes.filter((hero: IHeroCard): boolean =>
                hero.name.startsWith(`Dwerg`)).length : player.heroes.length,
            isCanPickHero: boolean =
                Math.min(...playerCards.map((item: PlayerCardsType[]): number =>
                    item.reduce(TotalRank, 0))) > heroesLength,
            isPlayerHasPickHeroActionInStack: number = player.stack.findIndex((stack: IStack): boolean =>
                stack.config?.stageName === Stages.PickHero);
        if (isCanPickHero && isPlayerHasPickHeroActionInStack === -1) {
            AddPickHeroAction(G, ctx);
        }
    }
};
