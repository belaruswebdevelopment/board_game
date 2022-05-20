import type { Ctx } from "boardgame.io";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import type { DeckCardTypes, IdavollDeckCardTypes, IMercenaryPlayerCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
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
 * <li>Происходит при взятии карты из сброса при активации карты лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns Добавлена ли карта на планшет игрока.
 */
export const AddCardToPlayer = (G: IMyGameState, ctx: Ctx,
    card: DeckCardTypes | IMercenaryPlayerCard | IdavollDeckCardTypes): boolean => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = card;
    // TODO Idavoll && IMythicalAnimal
    if (IsCardNotActionAndNotNull(card)) {
        player.cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал карту '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
        return true;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал карту '${card.name}'.`);
    return false;
};

/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * <li>Происходит при взятии карты из сброса при активации карты лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Выбранная карта дворфа или улучшения монет.
 * @returns
 */
export const PickCardOrActionCardActions = (G: IMyGameState, ctx: Ctx, card: DeckCardTypes | IdavollDeckCardTypes):
    boolean => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const isAdded: boolean = AddCardToPlayer(G, ctx, card);
    // TODO Idavoll && IMythicalAnimal
    if (IsCardNotActionAndNotNull(card)) {
        if (isAdded) {
            CheckAndMoveThrudAction(G, ctx, card);
        }
    } else {
        if (IsActionCard(card)) {
            AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
            DiscardPickedCard(G, player, card);
        } else {
            // TODO Add Idavoll cards to Player's Idavoll cards Command Zone
        }
    }
    return isAdded;
};
