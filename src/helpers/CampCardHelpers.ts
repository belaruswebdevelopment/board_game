import { Ctx } from "boardgame.io";
import { IsArtefactCardNotMercenary } from "../Camp";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { IBuffs } from "../typescript/buff_interfaces";
import { IArtefactCampCard } from "../typescript/camp_card_interfaces";
import { CampDeckCardTypes } from "../typescript/card_types";
import { BuffNames, LogTypes, Phases, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "./ActionHelpers";
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
        || player.buffs.find((buff: IBuffs): boolean => buff.goCamp !== undefined))) {
        G.campPicked = true;
    }
    if (player.buffs.find((buff: IBuffs): boolean => buff.goCampOneTime !== undefined)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.GoCampOneTime);
    }
    if (IsArtefactCardNotMercenary(card) && card.suit !== null) {
        AddCampCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
    } else {
        AddCampCardToPlayer(G, ctx, card);
        if (IsArtefactCardNotMercenary(card)) {
            AddBuffToPlayer(G, ctx, card.buff);
        }
    }
    if (ctx.phase === Phases.EnlistmentMercenaries
        && player.campCards.filter((card: CampDeckCardTypes): boolean =>
            card.type === RusCardTypes.MERCENARY).length) {
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
export const AddCampCardToPlayer = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    if (!IsArtefactCardNotMercenary(card) || (IsArtefactCardNotMercenary(card) && card.suit === null)) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.campCards.push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал карту кэмпа ${card.name}.`);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить карту артефакта ${card.name} в массив карт кэмпа игрока из-за её принадлежности к фракции ${card.suit}.`);
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
export const AddCampCardToPlayerCards = (G: IMyGameState, ctx: Ctx, card: IArtefactCampCard): boolean => {
    if (card.suit !== null) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${player.nickname} выбрал карту кэмпа '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
        return true;
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить артефакт ${card.name} на планшет карт фракций игрока из-за отсутствия принадлежности его к конкретной фракции.`);
        return false;
    }
};
