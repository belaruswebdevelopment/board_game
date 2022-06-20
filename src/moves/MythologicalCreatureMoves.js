import { godConfig } from "../data/MythologicalCreatureData";
import { IsGodCard } from "../MythologicalCreature";
import { RusCardTypes } from "../typescript/enums";
/**
 * <h3>Использование способности карты Бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при применении игроком способности карты выбранного Бога.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id выбираемой карты Бога.
 * @returns
 */
export const UseGodPowerMove = (G, ctx, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const card = player.mythologicalCreatureCards[cardId];
    if (card === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта с id '${cardId}'.`);
    }
    else if (!IsGodCard(card)) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне карта с id '${cardId}' должна быть с типом '${RusCardTypes.God}', а не с типом '${card.type}'.`);
    }
    const godCard = Object.values(godConfig).find((god) => god.name === card.name);
    if (godCard === undefined) {
        throw new Error(`Не удалось найти Бога '${card.name}'.`);
    }
    // TODO Use God power ability!?
    godCard.godPower();
};
//# sourceMappingURL=MythologicalCreatureMoves.js.map