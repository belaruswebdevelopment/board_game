import type { Ctx } from "boardgame.io";
import { AddPickHeroAction } from "../actions/HeroAutoActions";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, GameModeNames, SoloGameAndvariStrategyNames, StageNames } from "../typescript/enums";
import type { CanBeUndefType, IHeroCard, IMyGameState, IPublicPlayer, IStack, PlayerCardType } from "../typescript/interfaces";
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
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards: PlayerCardType[][] = Object.values(player.cards),
            heroesLength: number =
                G.mode === GameModeNames.Solo1 ? player.heroes.filter((hero: IHeroCard): boolean =>
                    hero.name.startsWith(`Dwerg`)).length : player.heroes.length -
                ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroEasyStrategy
                    || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroHardStrategy) ? 0 : 5),
            isCanPickHero: boolean =
                (Math.min(...playerCards.map((item: PlayerCardType[]): number =>
                    item.reduce(TotalRank, 0))) -
                    ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroEasyStrategy
                        || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroHardStrategy) ?
                        0 : 1)) > heroesLength,
            playerPickHeroActionInStackIndex: number = player.stack.findIndex((stack: IStack): boolean =>
                stack.stageName === StageNames.pickHero);
        if (isCanPickHero && (playerPickHeroActionInStackIndex === -1)) {
            AddPickHeroAction(G, ctx, 1);
        }
    }
};
