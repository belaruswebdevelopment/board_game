import { godConfig } from "../data/MythologicalCreatureData";
import { ThrowMyError } from "../Error";
import { ErrorNames, RusCardTypeNames } from "../typescript/enums";
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const card = player.mythologicalCreatureCards[cardId];
    if (card === undefined) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне отсутствует карта с id '${cardId}'.`);
    }
    if (card.type !== RusCardTypeNames.God_Card) {
        throw new Error(`В массиве карт мифических существ игрока с id '${ctx.currentPlayer}' в командной зоне карта с id '${cardId}' должна быть с типом '${RusCardTypeNames.God_Card}', а не с типом '${card.type}'.`);
    }
    const godCard = Object.values(godConfig).find((god) => god.name === card.name);
    if (godCard === undefined) {
        throw new Error(`Не удалось найти Бога '${card.name}'.`);
    }
    // TODO Use God power ability!?
    godCard.godPower();
};
//# sourceMappingURL=MythologicalCreatureMoves.js.map