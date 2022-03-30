import { AddPickHeroAction } from "../actions/AutoActions";
import { StackData } from "../data/StackData";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, HeroNames } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
/**
 * <h3>Добавляет действия в стэк при старте хода в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddEndTierActionsToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeYludHero()]);
};
/**
 * <h3>Проверяет нужно ли перемещать героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда выкладывается карта на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns Нужно ли перемещать героя Труд.
 */
export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit !== null) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        const index = player.cards[card.suit].findIndex((card) => card.name === HeroNames.Thrud);
        if (index !== -1) {
            const thrudCard = player.cards[card.suit][index];
            if (thrudCard === undefined) {
                throw new Error(`В массиве карт игрока во фракции ${card.suit} под индексом ${index} отсутствует карта героя ${HeroNames.Thrud} для перемещения на новое место.`);
            }
            player.pickedCard = thrudCard;
            player.cards[card.suit].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};
/**
 * <h3>Действия, связанные с проверкой перемещения героя Труд или выбора героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении карт, героев или карт лагеря, помещающихся на карту героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта, помещающаяся на карту героя Труд.
 */
export const CheckAndMoveThrudOrPickHeroAction = (G, ctx, card) => {
    const isMoveThrud = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        StartThrudMoving(G, ctx);
    }
    else {
        CheckPickHero(G, ctx);
    }
};
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
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    if (!CheckPlayerHasBuff(player, BuffNames.NoHero)) {
        const playerCards = Object.values(player.cards), isCanPickHero = Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) > player.heroes.length;
        if (isCanPickHero) {
            AddPickHeroAction(G, ctx);
        }
    }
};
/**
 * <h3>Перемещение героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда выкладывается карта на планшет игрока и требуется переместить героя Труд.</li>
 * </ol>
 я
 * @param G
 * @param ctx
 */
export const StartThrudMoving = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeThrudHero()]);
};
//# sourceMappingURL=HeroHelpers.js.map