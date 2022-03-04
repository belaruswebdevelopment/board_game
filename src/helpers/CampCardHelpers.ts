import type { Ctx } from "boardgame.io";
import { IsArtefactCard, IsMercenaryCampCard } from "../Camp";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Phases } from "../typescript/enums";
import type { CampDeckCardTypes, IArtefactCampCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

/**
 * <h3>Действия, связанные с добавлением карт кэмпа в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 */
export const AddCampCardToCards = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (ctx.phase === Phases.PickCards && ctx.activePlayers === null && (ctx.currentPlayer === G.publicPlayersOrder[0]
        || CheckPlayerHasBuff(player, BuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff(player, BuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.GoCampOneTime);
    }
    if (IsArtefactCard(card) && card.suit !== null) {
        AddCampCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
    } else {
        AddCampCardToPlayer(G, ctx, card);
        if (IsArtefactCard(card)) {
            AddBuffToPlayer(G, ctx, card.buff);
        }
    }
    if (ctx.phase === Phases.EnlistmentMercenaries
        && player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card)).length) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
    }
};

/**
 * <h3>Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты кэмпа игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 */
export const AddCampCardToPlayer = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void | never => {
    if (!IsArtefactCard(card) || (IsArtefactCard(card) && card.suit === null)) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.campCards.push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал карту кэмпа ${card.name}.`);
    } else {
        throw new Error(`Не удалось добавить карту артефакта ${card.name} в массив карт кэмпа игрока из-за её принадлежности к фракции ${card.suit}.`);
    }
};

/**
 * <h3>Добавляет карту кэмпа в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты кэмпа в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @returns Добавлен ли артефакт на планшет игрока.
 */
export const AddCampCardToPlayerCards = (G: IMyGameState, ctx: Ctx, card: IArtefactCampCard): boolean | never => {
    if (card.suit !== null) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.cards[card.suit].push(card);
        player.pickedCard = card;
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${player.nickname} выбрал карту кэмпа '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
        return true;
    } else {
        throw new Error(`Не удалось добавить артефакт '${card.name}' на планшет карт фракций игрока из-за отсутствия принадлежности его к конкретной фракции.`);
    }
};
