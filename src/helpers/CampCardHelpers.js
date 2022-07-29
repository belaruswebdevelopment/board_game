import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { BuffNames, ErrorNames, LogTypeNames, PhaseNames, RusCardTypeNames } from "../typescript/enums";
import { AddBuffToPlayer, CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { AddCardToPlayer } from "./CardHelpers";
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0] || CheckPlayerHasBuff(player, BuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff(player, BuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.GoCampOneTime);
    }
    if (card.type === RusCardTypeNames.Artefact_Player_Card && card.suit !== null) {
        AddArtefactPlayerCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudAction(G, ctx, card);
    }
    else {
        AddCampCardToPlayer(G, ctx, card);
        if (card.type === RusCardTypeNames.Artefact_Card) {
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
const AddCampCardToPlayer = (G, ctx, card) => {
    if (card.type === RusCardTypeNames.Artefact_Player_Card && card.suit !== null) {
        throw new Error(`Не удалось добавить карту лагеря '${card.type}' '${card.name}' в массив карт лагеря игрока с id '${ctx.currentPlayer}' из-за её принадлежности к фракции '${card.suit}'.`);
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    player.campCards.push(card);
    AddDataToLog(G, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}'.`);
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
const AddArtefactPlayerCardToPlayerCards = (G, ctx, card) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    AddCardToPlayer(G, ctx, card);
    AddDataToLog(G, LogTypeNames.Private, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
    return true;
};
/**
 * <h3>Действия, связанные с выкладкой монет на артефакт Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря.</li>
 * </ol>
 *
 * @param G
 */
export const AddCoinOnOdroerirTheMythicCauldronCampCard = (G) => {
    const minCoinValue = G.marketCoins.reduceRight((prev, curr) => prev.value < curr.value ? prev : curr).value, minCoinIndex = G.marketCoins.findIndex((coin) => coin.value === minCoinValue);
    if (minCoinIndex === -1) {
        throw new Error(`Не существует минимальная монета на рынке с значением - '${minCoinValue}'.`);
    }
    const coin = G.marketCoins.splice(minCoinIndex, 1)[0];
    if (coin === undefined) {
        throw new Error(`Отсутствует минимальная монета на рынке с id '${minCoinIndex}'.`);
    }
    G.odroerirTheMythicCauldronCoins.push(coin);
};
/**
 * <h3>Действия, связанные с завершением выкладки монет на артефакт Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отрисовке артефакта Odroerir The Mythic Cauldron.</li>
 * <li>При финальном подсчёте очков за артефакт Odroerir The Mythic Cauldron.</li>
 * </ol>
 *
 * @param G
 * @returns Значение всех монет на артефакте Odroerir The Mythic Cauldron.
 */
export const GetOdroerirTheMythicCauldronCoinsValues = (G) => G.odroerirTheMythicCauldronCoins.reduce((prev, curr) => prev + curr.value, 0);
//# sourceMappingURL=CampCardHelpers.js.map