import { IsCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { DiscardPickedCard } from "./DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
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
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = card;
    if (IsCardNotActionAndNotNull(card)) {
        player.cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал карту '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
        return true;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал карту '${card.name}'.`);
    return false;
};
export const PickCardOrActionCardActions = (G, ctx, card) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const isAdded = AddCardToPlayer(G, ctx, card);
    if (IsCardNotActionAndNotNull(card)) {
        if (isAdded) {
            CheckAndMoveThrudAction(G, ctx, card);
        }
    }
    else {
        AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
        DiscardPickedCard(G, player, card);
    }
    return isAdded;
};
//# sourceMappingURL=CardHelpers.js.map