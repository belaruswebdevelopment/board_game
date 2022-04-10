import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { HeroNames } from "../typescript/enums";
import type { IMyGameState, IPublicPlayer, PlayerCardsType } from "../typescript/interfaces";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

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
export const CheckAndMoveThrud = (G: IMyGameState, ctx: Ctx, card: PlayerCardsType): boolean => {
    if (card.suit !== null) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        const index: number = player.cards[card.suit].findIndex((card: PlayerCardsType): boolean =>
            card.name === HeroNames.Thrud);
        if (index !== -1) {
            const thrudCard: PlayerCardsType | undefined = player.cards[card.suit][index];
            if (thrudCard === undefined) {
                throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' во фракции '${card.suit}' с id '${index}' отсутствует карта героя '${HeroNames.Thrud}' для перемещения на новое место.`);
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

export const CheckAndMoveThrudAction = (G: IMyGameState, ctx: Ctx, card: PlayerCardsType): void => {
    const isMoveThrud: boolean = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.placeThrudHero()]);
    }
};
