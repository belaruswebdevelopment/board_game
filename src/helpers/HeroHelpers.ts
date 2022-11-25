import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, CampBuffNames, CommonStageNames, ErrorNames, GameModeNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
import type { CanBeUndefType, IHeroCard, IPublicPlayer, IStack, MyFnContext, PlayerCardType } from "../typescript/interfaces";
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
export const CheckPickHero = ({ G, ctx, playerID, ...rest }: MyFnContext): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    if (!CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, CampBuffNames.NoHero)) {
        const playerHasNotCountHero: boolean =
            CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, BuffNames.HasOneNotCountHero),
            playerCards: PlayerCardType[][] = Object.values(player.cards),
            heroesLength: number =
                G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`
                    ? player.heroes.filter((hero: IHeroCard): boolean =>
                        hero.name.startsWith(`Dwerg`)).length : player.heroes.length -
                    ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                        || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy)
                        && ctx.currentPlayer === `1` ? 5 : 0),
            isCanPickHero: boolean =
                (Math.min(...playerCards.map((item: PlayerCardType[]): number =>
                    item.reduce(TotalRank, 0))) -
                    ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                        || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy) ?
                        1 : 0)) > (heroesLength - Number(playerHasNotCountHero)),
            playerPickHeroActionInStackIndex: number = player.stack.findIndex((stack: IStack): boolean =>
                stack.stageName === CommonStageNames.ClickHeroCard);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction({ G, ctx, playerID, ...rest }, 1);
        }
    }
};
