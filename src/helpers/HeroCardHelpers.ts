import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { ErrorNames, GameModeNames, HeroNames, LogTypeNames, RusCardTypeNames, ValkyryBuffNames } from "../typescript/enums";
import type { AllHeroCardType, CanBeUndefType, IHeroCard, IHeroPlayerCard, IPublicPlayer, MyFnContext } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./BuffHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { CheckIfRecruitedCardHasNotLeastRankOfChosenClass, CheckValkyryRequirement } from "./MythologicalCreatureHelpers";

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
 * @returns
 */
export const AddHeroCardToPlayerCards = ({ G, ctx, playerID, ...rest }: MyFnContext, hero: AllHeroCardType): void => {
    if (hero.suit !== null && hero.rank !== null) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                playerID);
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
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Игрок '${player.nickname}' добавил героя '${hero.name}' во фракцию '${suitsConfig[hero.suit].suitName}'.`);
        if (heroCard.name !== HeroNames.Thrud) {
            CheckAndMoveThrudAction({ G, ctx, playerID, ...rest }, heroCard);
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
 * @returns
 */
export const AddHeroCardToPlayerHeroCards = ({ G, ctx, playerID, ...rest }: MyFnContext, hero: IHeroCard): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло ботом` : `каким-то игроком`}.`);
    }
    hero.active = false;
    player.heroes.push(hero);
    if (G.expansions.idavoll.active) {
        // TODO Add Odin ability not trigger this!!!!!!
        CheckValkyryRequirement({ G, ctx, playerID, ...rest },
            ValkyryBuffNames.CountPickedHeroAmount);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} выбрал героя '${hero.name}'.`);
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
 * @returns
 */
export const AddHeroToPlayerCards = ({ G, ctx, playerID, ...rest }: MyFnContext, hero: IHeroCard): void => {
    AddHeroCardToPlayerHeroCards({ G, ctx, playerID, ...rest }, hero);
    if (G.expansions.idavoll.active) {
        if (`suit` in hero && hero.suit !== null) {
            if (CheckIfRecruitedCardHasNotLeastRankOfChosenClass({ G, ctx, playerID, ...rest },
                Number(playerID), hero.suit)) {
                CheckValkyryRequirement({ G, ctx, playerID, ...rest },
                    ValkyryBuffNames.CountPickedCardClassRankAmount);
            }
        }
    }
    AddHeroCardToPlayerCards({ G, ctx, playerID, ...rest }, hero);
    AddBuffToPlayer({ G, ctx, playerID, ...rest }, hero.buff);
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
 * @returns
 */
export const AddHeroForDifficultyToSoloBotCards = ({ G, ctx, playerID, ...rest }: MyFnContext, hero: IHeroCard):
    void => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1],
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            playerID);
    }
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            1);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран каким-то игроком.`);
    }
    hero.active = false;
    soloBotPublicPlayer.heroes.push(hero);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал героя '${hero.name}' для соло бота.`);
};
