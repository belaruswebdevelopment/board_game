import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { BuffNames, ErrorNames, GameModeNames, HeroNames } from "../typescript/enums";
import { CheckPlayerHasBuff, GetBuffValue } from "./BuffHelpers";
import { AddActionsToStack } from "./StackHelpers";
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
const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit !== null) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (CheckPlayerHasBuff(player, BuffNames.MoveThrud)
            && GetBuffValue(G, ctx, BuffNames.MoveThrud) === card.suit) {
            const index = player.cards[card.suit].findIndex((card) => card.name === HeroNames.Thrud);
            if (index !== -1) {
                const thrudCard = player.cards[card.suit][index];
                if (thrudCard === undefined) {
                    throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' во фракции '${card.suit}' с id '${index}' отсутствует карта героя '${HeroNames.Thrud}' для перемещения на новое место.`);
                }
                player.cards[card.suit].splice(index, 1);
            }
            return index !== -1;
        }
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
 * @returns
 */
export const CheckAndMoveThrudAction = (G, ctx, card) => {
    const isMoveThrud = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        if (G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.placeThrudHeroSoloBot()]);
        }
        else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.placeThrudHeroSoloBotAndvari()]);
        }
        else {
            AddActionsToStack(G, ctx, [StackData.placeThrudHero()]);
        }
    }
};
//# sourceMappingURL=HeroActionHelpers.js.map