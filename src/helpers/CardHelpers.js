import { isArtefactCard } from "../Camp";
import { isCardNotAction } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
// todo Move -> CampCardHelpers HeroCardsHelpers
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
export const AddCampCardToPlayer = (G, ctx, card) => {
    if (!isArtefactCard(card) || (isArtefactCard(card) && card.suit === null)) {
        G.publicPlayers[Number(ctx.currentPlayer)].campCards.push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту кэмпа ${card.name}.`);
    }
    else {
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
 */
export const AddCampCardToPlayerCards = (G, ctx, card) => {
    if (card.suit !== null) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту кэмпа '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить артефакт ${card.name} на планшет карт фракций игрока из-за отсутствия принадлежности его к конкретной фракции.`);
    }
};
/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns Добавлена ли карта на планшет игрока.
 */
export const AddCardToPlayer = (G, ctx, card) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = card;
    // TODO Not only deckcardtypes but ihero+icampcardtypes?? but they are created as ICard and added to players cards...
    if (isCardNotAction(card)) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit].push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
        return true;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал карту '${card.name}'.`);
    return false;
};
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
