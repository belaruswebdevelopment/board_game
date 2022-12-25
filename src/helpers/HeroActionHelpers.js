import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { ErrorNames, GameModeNames, HeroBuffNames, HeroNames } from "../typescript/enums";
import { CheckPlayerHasBuff, GetBuffValue } from "./BuffHelpers";
import { RemoveCardFromPlayerBoardSuitCards } from "./DiscardCardHelpers";
import { AddActionsToStack } from "./StackHelpers";
/**
 * <h3>Проверяет нужно ли перемещать героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда выкладывается карта на планшет игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Нужно ли перемещать героя Труд.
 */
const CheckAndMoveThrud = ({ G, ctx, myPlayerID, ...rest }, card) => {
    if (card.suit !== null) {
        const player = G.publicPlayers[Number(myPlayerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
        }
        if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud)
            && GetBuffValue({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud) === card.suit) {
            const index = player.cards[card.suit].findIndex((card) => card.name === HeroNames.Thrud);
            if (index !== -1) {
                const thrudCard = player.cards[card.suit][index];
                if (thrudCard === undefined) {
                    throw new Error(`В массиве карт игрока с id '${myPlayerID}' во фракции '${card.suit}' с id '${index}' отсутствует карта героя '${HeroNames.Thrud}' для перемещения на новое место.`);
                }
                RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, card.suit, index);
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
 * @param context
 * @param card Карта, помещающаяся на карту героя Труд.
 * @returns
 */
export const CheckAndMoveThrudAction = ({ G, ctx, myPlayerID, ...rest }, card) => {
    const isMoveThrud = CheckAndMoveThrud({ G, ctx, myPlayerID, ...rest }, card);
    if (isMoveThrud) {
        if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.placeThrudHeroSoloBot()]);
        }
        else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.placeThrudHeroSoloBotAndvari()]);
        }
        else {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.placeThrudHero()]);
        }
    }
};
//# sourceMappingURL=HeroActionHelpers.js.map