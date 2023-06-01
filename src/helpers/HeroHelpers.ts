import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { CampBuffNames, CommonBuffNames, CommonStageNames, ErrorNames, GameModeNames, PlayerIdForSoloGameNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
import type { CanBeUndefType, HeroCard, MyFnContextWithMyPlayerID, PlayerBoardCardType, PublicPlayer, Stack } from "../typescript/interfaces";
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
 * @param context
 * @returns
 */
export const CheckPickHero = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (!CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CampBuffNames.NoHero)) {
        const playerHasNotCountHero: boolean =
            CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CommonBuffNames.HasOneNotCountHero),
            playerCards: PlayerBoardCardType[][] = Object.values(player.cards),
            heroesLength: number =
                G.mode === GameModeNames.Solo && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId
                    ? player.heroes.filter((hero: HeroCard): boolean =>
                        hero.name.startsWith(`Dwerg`)).length : player.heroes.length -
                    ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                        || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy)
                        && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? 5 : 0),
            isCanPickHero: boolean =
                (Math.min(...playerCards.map((item: PlayerBoardCardType[]): number =>
                    item.reduce(TotalRank, 0))) -
                    ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroEasyStrategy
                        || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.WithHeroHardStrategy) ?
                        1 : 0)) > (heroesLength - Number(playerHasNotCountHero)),
            playerPickHeroActionInStackIndex: number = player.stack.findIndex((stack: Stack): boolean =>
                stack.stageName === CommonStageNames.ClickHeroCard);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction({ G, ctx, myPlayerID, ...rest }, 1);
        }
    }
};
