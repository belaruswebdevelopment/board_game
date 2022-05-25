import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";

/**
 * <h3>Добавляет героя в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 */
export const AddHeroCardToPlayerCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    if (hero.suit !== null) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        player.cards[hero.suit].push(hero);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок '${player.nickname}' добавил героя '${hero.name}' во фракцию '${suitsConfig[hero.suit].suitName}'.`);
    }
};

/**
 * <h3>Добавляет героя в массив героев игрока или соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * <li>Происходит при добавлении героя на планшет соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 */
export const AddHeroCardToPlayerHeroCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (G.solo && player === undefined && ctx.currentPlayer === `1`) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    } else if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = hero;
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран ${G.solo && ctx.currentPlayer === `1` ? `соло ботом` : `каким-то игроком`}.`);
    }
    hero.active = false;
    player.heroes.push(hero);
    AddDataToLog(G, LogTypes.PUBLIC, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} выбрал героя '${hero.name}'.`);
};

/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Карта героя.
 */
export const AddHeroToPlayerCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    AddHeroCardToPlayerCards(G, ctx, hero);
    AddBuffToPlayer(G, ctx, hero.buff);
    CheckAndMoveThrudAction(G, ctx, hero);
};

/**
 * <h3>Действия, связанные с добавлением героев в массив карт соло бота.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Карта героя.
 */
export const AddHeroForDifficultyToSoloBotCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1],
        player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран каким-то игроком.`);
    }
    hero.active = false;
    soloBotPublicPlayer.heroes.push(hero);
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок '${player.nickname}' выбрал героя '${hero.name}' для соло бота.`);
};
