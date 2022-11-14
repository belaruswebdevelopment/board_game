import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CampBuffNames, ErrorNames, HeroBuffNames, LogTypeNames, PhaseNames, RusCardTypeNames } from "../typescript/enums";
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
 * @returns
 */
export const AddCampCardToCards = ({ G, ctx, playerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0]
            || CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, CampBuffNames.GoCamp))) {
        G.campPicked = true;
    }
    if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.GoCampOneTime)) {
        DeleteBuffFromPlayer({ G, ctx, playerID, ...rest }, HeroBuffNames.GoCampOneTime);
    }
    if (card.type === RusCardTypeNames.Artefact_Player_Card) {
        AddArtefactPlayerCardToPlayerCards({ G, ctx, playerID, ...rest }, card);
        CheckAndMoveThrudAction({ G, ctx, playerID, ...rest }, card);
    }
    else {
        AddCampCardToPlayerCampCards({ G, ctx, playerID, ...rest }, card);
        if (card.type === RusCardTypeNames.Artefact_Card) {
            AddBuffToPlayer({ G, ctx, playerID, ...rest }, card.buff);
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
 * @returns
 */
const AddCampCardToPlayerCampCards = ({ G, ctx, playerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    player.campCards.push(card);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}'.`);
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
const AddArtefactPlayerCardToPlayerCards = ({ G, ctx, playerID, ...rest }, card) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    AddCardToPlayer({ G, ctx, playerID, ...rest }, card);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Игрок '${player.nickname}' выбрал карту лагеря '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
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
 * @returns
 */
export const AddCoinOnOdroerirTheMythicCauldronCampCard = ({ G }) => {
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
export const GetOdroerirTheMythicCauldronCoinsValues = ({ G }) => G.odroerirTheMythicCauldronCoins.reduce((prev, curr) => prev + curr.value, 0);
//# sourceMappingURL=CampCardHelpers.js.map