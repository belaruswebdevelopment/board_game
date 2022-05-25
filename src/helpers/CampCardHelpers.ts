import type { Ctx } from "boardgame.io";
import { IsArtefactCard } from "../Camp";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Phases } from "../typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, IArtefactCampCard, ICoin, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
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
export const AddCampCardToCards = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
    } else {
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
export const AddCampCardToPlayer = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    if (IsArtefactCard(card) && card.suit !== null) {
        throw new Error(`Не удалось добавить карту артефакта '${card.name}' в массив карт лагеря игрока с id '${ctx.currentPlayer}' из-за её принадлежности к фракции '${card.suit}'.`);
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
export const AddCampCardToPlayerCards = (G: IMyGameState, ctx: Ctx, card: IArtefactCampCard): boolean => {
    if (card.suit === null) {
        throw new Error(`Не удалось добавить артефакт '${card.name}' на планшет карт фракций игрока с id '${ctx.currentPlayer}' из-за отсутствия принадлежности его к конкретной фракции.`);
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.cards[card.suit].push(card);
    player.pickedCard = card;
    AddDataToLog(G, LogTypes.PRIVATE, `Игрок '${player.nickname}' выбрал карту лагеря '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
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
export const AddCoinOnOdroerirTheMythicCauldronCampCard = (G: IMyGameState): void => {
    const minCoinValue: number = G.marketCoins.reduceRight((prev: ICoin, curr: ICoin): ICoin =>
        prev.value < curr.value ? prev : curr).value,
        minCoinIndex: number =
            G.marketCoins.findIndex((coin: ICoin): boolean => coin.value === minCoinValue);
    if (minCoinIndex === -1) {
        throw new Error(`Не существует минимальная монета на рынке с значением - '${minCoinValue}'.`);
    }
    const coin: CanBeUndef<ICoin> = G.marketCoins.splice(minCoinIndex, 1)[0];
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
export const GetOdroerirTheMythicCauldronCoinsValues = (G: IMyGameState): number =>
    G.odroerirTheMythicCauldronCoins.reduce((prev: number, curr: ICoin): number =>
        prev + curr.value, 0);
