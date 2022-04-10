import { IsArtefactCard } from "../Camp";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Phases } from "../typescript/enums";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
/**
 * <h3>Действия, связанные с добавлением карт лагеря в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт лагеря, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 */
export const AddCampCardToCards = (G, ctx, card) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (ctx.phase === Phases.PickCards && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0] || CheckPlayerHasBuff(player, BuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff(player, BuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.GoCampOneTime);
    }
    if (IsArtefactCard(card) && card.suit !== null) {
        AddCampCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudAction(G, ctx, card);
    }
    else {
        AddCampCardToPlayer(G, ctx, card);
        if (IsArtefactCard(card)) {
            AddBuffToPlayer(G, ctx, card.buff);
        }
    }
};
/**
 * <h3>Добавляет взятую из лагеря карту в массив карт лагеря игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты лагеря игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта лагеря.
 */
export const AddCampCardToPlayer = (G, ctx, card) => {
    if (IsArtefactCard(card) && card.suit !== null) {
        throw new Error(`Не удалось добавить карту артефакта '${card.name}' в массив карт лагеря игрока с id '${ctx.currentPlayer}' из-за её принадлежности к фракции '${card.suit}'.`);
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.campCards.push(card);
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал карту лагеря '${card.name}'.`);
};
/**
 * <h3>Добавляет карту лагеря в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты лагеря в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта лагеря.
 * @returns Добавлен ли артефакт на планшет игрока.
 */
export const AddCampCardToPlayerCards = (G, ctx, card) => {
    if (card.suit === null) {
        throw new Error(`Не удалось добавить артефакт '${card.name}' на планшет карт фракций игрока с id '${ctx.currentPlayer}' из-за отсутствия принадлежности его к конкретной фракции.`);
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.cards[card.suit].push(card);
    player.pickedCard = card;
    AddDataToLog(G, LogTypes.PRIVATE, `Игрок '${player.nickname}' выбрал карту лагеря '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
    return true;
};
export const GetOdroerirTheMythicCauldronCoinsValues = (G) => G.odroerirTheMythicCauldronCoins.reduce((prev, curr) => prev + curr.value, 0);
//# sourceMappingURL=CampCardHelpers.js.map