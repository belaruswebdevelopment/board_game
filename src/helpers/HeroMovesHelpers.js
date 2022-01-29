import { AddBuffToPlayer } from "./ActionHelpers";
import { AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards } from "./HeroCardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddHeroToCards = (G, ctx, hero) => {
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    AddHeroCardToPlayerCards(G, ctx, hero);
    AddBuffToPlayer(G, ctx, hero.buff);
    CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
};
//# sourceMappingURL=HeroMovesHelpers.js.map