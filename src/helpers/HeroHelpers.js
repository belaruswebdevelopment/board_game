import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, CampBuffNames, CommonStageNames, ErrorNames, GameModeNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
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
export const CheckPickHero = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    if (!CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CampBuffNames.NoHero)) {
        const playerHasNotCountHero = CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, BuffNames.HasOneNotCountHero), playerCards = Object.values(player.cards), heroesLength = G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`
            ? player.heroes.filter((hero) => hero.name.startsWith(`Dwerg`)).length : player.heroes.length -
            ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy)
                && ctx.currentPlayer === `1` ? 5 : 0), isCanPickHero = (Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) -
            ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy) ?
                1 : 0)) > (heroesLength - Number(playerHasNotCountHero)), playerPickHeroActionInStackIndex = player.stack.findIndex((stack) => stack.stageName === CommonStageNames.ClickHeroCard);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction({ G, ctx, myPlayerID, ...rest }, 1);
        }
    }
};
//# sourceMappingURL=HeroHelpers.js.map