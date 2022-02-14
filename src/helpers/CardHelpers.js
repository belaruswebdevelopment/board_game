import { isCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns Добавлена ли карта на планшет игрока.
 */
export const AddCardToPlayer = (G, ctx, card) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    player.pickedCard = card;
    // TODO Not only deck card types but hero+camp card types?? but they are created as ICard and added to players cards.
    if (isCardNotActionAndNotNull(card)) {
        player.cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал карту '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
        return true;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал карту '${card.name}'.`);
    return false;
};
//# sourceMappingURL=CardHelpers.js.map