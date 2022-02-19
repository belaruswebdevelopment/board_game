import { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { IHeroCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./ActionHelpers";
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
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.cards[hero.suit].push(hero);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${player.nickname} добавил героя ${hero.name} во фракцию ${suitsConfig[hero.suit].suitName}.`);
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
export const AddHeroCardToPlayerHeroCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    player.pickedCard = hero;
    if (hero.active) {
        hero.active = false;
        player.heroes.push(hero);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${player.nickname} выбрал героя ${hero.name}.`);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить героя ${hero.name} из-за того, что он был уже выбран другим игроком.`);
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
 * @param config Конфиг действий героя.
 */
export const AddHeroToCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard): void => {
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    AddHeroCardToPlayerCards(G, ctx, hero);
    AddBuffToPlayer(G, ctx, hero.buff);
    CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
};
