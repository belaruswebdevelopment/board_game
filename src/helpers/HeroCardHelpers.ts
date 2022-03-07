import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import type { IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";

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
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player !== undefined) {
            player.cards[hero.suit].push(hero);
            AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${player.nickname} добавил героя ${hero.name} во фракцию ${suitsConfig[hero.suit].suitName}.`);
        } else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }
};

/**
 * <h3>Добавляет героя в массив героев игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 */
export const AddHeroCardToPlayerHeroCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void | never => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        player.pickedCard = hero;
        if (hero.active) {
            hero.active = false;
            player.heroes.push(hero);
            AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал героя ${hero.name}.`);
        } else {
            throw new Error(`Не удалось добавить героя ${hero.name} из-за того, что он был уже выбран каким-то игроком.`);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
export const AddHeroToCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    AddHeroCardToPlayerCards(G, ctx, hero);
    AddBuffToPlayer(G, ctx, hero.buff);
    CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
};
