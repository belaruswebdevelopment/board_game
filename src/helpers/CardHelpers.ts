import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { IsDwarfCard } from "../Dwarf";
import { AddDataToLog } from "../Logging";
import { IsGiantCard, IsGodCard, IsMythicalAnimalCard, IsValkyryCard } from "../MythologicalCreature";
import { IsRoyalOfferingCard } from "../RoyalOffering";
import { LogTypes } from "../typescript/enums";
import type { CanBeUndef, IMercenaryPlayerCard, IMyGameState, IPublicPlayer, MythologicalCreatureCommandZoneCardTypes, TavernCardTypes } from "../typescript/interfaces";
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
export const AddCardToPlayer = (G: IMyGameState, ctx: Ctx, card: NonNullable<TavernCardTypes> | IMercenaryPlayerCard):
    boolean => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = card;
    if (IsDwarfCard(card) || IsMythicalAnimalCard(card)) {
        player.cards[card.suit].push(card);
        // TODO When you recruit a Mythical Animal, place it in your army in the matching class. Each animal has its own unique ability!
        AddDataToLog(G, LogTypes.Public, `Игрок '${player.nickname}' выбрал карту${IsMythicalAnimalCard(card) ? ` '${card.type}'` : ``} '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
        return true;
    }
    return false;
};

/**
 * <h3>Добавляет взятую карту Idavoll в командную зону карт Idavoll игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 */
const AddMythologicalCreatureCardToPlayerCommandZone = (G: IMyGameState, ctx: Ctx,
    card: MythologicalCreatureCommandZoneCardTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.mythologicalCreatureCards.push(card);
    if (IsGodCard(card)) {
        card.isPowerTokenUsed = false;
    } else if (IsGiantCard(card)) {
        player.giantTokenSuits[card.placedSuit] = true;
    } else if (IsValkyryCard(card)) {
        card.strengthTokenNotch = 0;
    }
    AddDataToLog(G, LogTypes.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' в командную зону карт Idavoll.`);
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
export const PickCardOrActionCardActions = (G: IMyGameState, ctx: Ctx, card: NonNullable<TavernCardTypes>): boolean => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const isAdded: boolean = AddCardToPlayer(G, ctx, card);
    if (IsDwarfCard(card) || IsMythicalAnimalCard(card)) {
        if (isAdded) {
            CheckAndMoveThrudAction(G, ctx, card);
        }
    } else {
        if (IsRoyalOfferingCard(card)) {
            AddDataToLog(G, LogTypes.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}'.`);
            AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
            DiscardPickedCard(G, player, card);
        } else {
            if (G.expansions.idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone(G, ctx, card);
            }
        }
    }
    return isAdded;
};
