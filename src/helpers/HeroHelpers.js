import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, StageNames } from "../typescript/enums";
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
export const CheckPickHero = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${ctx.currentPlayer}'.`);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards = Object.values(player.cards), heroesLength = G.solo ? player.heroes.filter((hero) => hero.name.startsWith(`Dwerg`)).length : player.heroes.length, isCanPickHero = Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) > heroesLength, playerPickHeroActionInStackIndex = player.stack.findIndex((stack) => stack.stageName === StageNames.PickHero);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction(G, ctx);
        }
    }
};
//# sourceMappingURL=HeroHelpers.js.map