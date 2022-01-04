import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
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
export const AddHeroCardToPlayerCards = (G, ctx, hero) => {
    if (hero.suit !== null) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[hero.suit].push(hero);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил героя ${hero.name} во фракцию ${suitsConfig[hero.suit].suitName}.`);
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
export const AddHeroCardToPlayerHeroCards = (G, ctx, hero) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = hero;
    if (hero.active) {
        hero.active = false;
        G.publicPlayers[Number(ctx.currentPlayer)].heroes.push(hero);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал героя ${hero.name}.`);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить героя ${hero.name} из-за того, что он был уже выбран другим игроком.`);
    }
};
