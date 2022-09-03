import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, GameModeNames, SoloGameAndvariStrategyNames, StageNames } from "../typescript/enums";
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
 * @returns
 */
export const CheckPickHero = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards = Object.values(player.cards), heroesLength = G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `1`
            ? player.heroes.filter((hero) => hero.name.startsWith(`Dwerg`)).length : player.heroes.length -
            ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy)
                && ctx.currentPlayer === `1` ? 5 : 0), isCanPickHero = (Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) -
            ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy) ?
                1 : 0)) > heroesLength, playerPickHeroActionInStackIndex = player.stack.findIndex((stack) => stack.stageName === StageNames.pickHero);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction(G, ctx, 1);
        }
    }
};
//# sourceMappingURL=HeroHelpers.js.map