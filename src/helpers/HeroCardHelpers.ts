import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { BuffNames, ErrorNames, HeroNames, LogTypeNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IHeroPlayerCard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { CheckValkyryRequirement } from "./MythologicalCreatureHelpers";

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
export const AddHeroCardToPlayerCards = (G: IMyGameState, ctx: Ctx, hero: IHeroCard | IHeroPlayerCard): void => {
    if (hero.suit !== null && hero.rank !== null) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        const heroCard: IHeroPlayerCard = CreateHeroPlayerCard({
            suit: hero.suit,
            rank: hero.rank,
            points: hero.points,
            type: RusCardTypeNames.Hero_Player_Card,
            name: hero.name,
            description: hero.description,
        });
        player.cards[hero.suit].push(heroCard);
        AddDataToLog(G, LogTypeNames.Private, `Игрок '${player.nickname}' добавил героя '${hero.name}' во фракцию '${suitsConfig[hero.suit].suitName}'.`);
        if (heroCard.name !== HeroNames.Thrud) {
            CheckAndMoveThrudAction(G, ctx, heroCard);
        }
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран ${G.solo && ctx.currentPlayer === `1` ? `соло ботом` : `каким-то игроком`}.`);
    }
    hero.active = false;
    player.heroes.push(hero);
    if (G.expansions.idavoll) {
        CheckValkyryRequirement(player, Number(ctx.currentPlayer),
            BuffNames.CountPickedHeroAmount);
    }
    AddDataToLog(G, LogTypeNames.Public, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} выбрал героя '${hero.name}'.`);
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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран каким-то игроком.`);
    }
    hero.active = false;
    soloBotPublicPlayer.heroes.push(hero);
    AddDataToLog(G, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал героя '${hero.name}' для соло бота.`);
};
