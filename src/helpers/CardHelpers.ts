import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames, RusCardTypeNames } from "../typescript/enums";
import type { AddCardToPlayerTypes, CanBeUndef, IMyGameState, IPublicPlayer, MythologicalCreatureCommandZoneCardTypes, TavernCardTypes } from "../typescript/interfaces";
import { DiscardPickedCard } from "./DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddActionsToStack } from "./StackHelpers";

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
export const AddCardToPlayer = (G: IMyGameState, ctx: Ctx, card: AddCardToPlayerTypes): boolean => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    switch (card.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mercenary_Player_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
        case RusCardTypeNames.Special_Card:
        case RusCardTypeNames.Multi_Suit_Player_Card:
            return true;
        default:
            return false;
    }
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    player.mythologicalCreatureCards.push(card);
    switch (card.type) {
        case RusCardTypeNames.God_Card:
            card.isPowerTokenUsed = false;
            break;
        case RusCardTypeNames.Giant_Card:
            player.giantTokenSuits[card.placedSuit] = true;
            break;
        case RusCardTypeNames.Valkyry_Card:
            card.strengthTokenNotch = 0;
            break;
        default:
            throw new Error(`Добавленная в командную зону для карт мифических существ карта не может быть с недопустимым типом.`);
    }
    AddDataToLog(G, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' в командную зону карт Idavoll.`);
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const isAdded: boolean = AddCardToPlayer(G, ctx, card);
    switch (card.type) {
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
            if (isAdded) {
                CheckAndMoveThrudAction(G, ctx, card);
            }
            break;
        case RusCardTypeNames.Royal_Offering_Card:
            AddDataToLog(G, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}'.`);
            AddActionsToStack(G, ctx, card.stack, card);
            DiscardPickedCard(G, card);
            break;
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            if (G.expansions.idavoll.active) {
                AddMythologicalCreatureCardToPlayerCommandZone(G, ctx, card);
            }
            break;
        default:
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
    }
    return isAdded;
};
