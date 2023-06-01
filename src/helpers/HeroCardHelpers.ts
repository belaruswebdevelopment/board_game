import { ThrowMyError } from "../Error";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { CardTypeRusNames, ErrorNames, GameModeNames, LogTypeNames, PlayerIdForSoloGameNames, ValkyryBuffNames } from "../typescript/enums";
import type { AllHeroCardType, CanBeUndefType, HeroCard, MyFnContextWithMyPlayerID, PublicPlayer } from "../typescript/interfaces";
import { AddBuffToPlayer } from "./BuffHelpers";
import { CheckValkyryRequirement } from "./MythologicalCreatureHelpers";

/**
 * <h3>Добавляет героя в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя.</li>
 * </ol>
 *
 * @param context
 * @param hero Герой.
 * @returns
 */
const CreateHeroPlayerCardIfAvailableFromHeroCardData = (hero: HeroCard): AllHeroCardType => {
    if (hero.playerSuit !== null && hero.rank !== null) {
        return CreateHeroPlayerCard({
            description: hero.description,
            name: hero.name,
            points: hero.points,
            rank: hero.rank,
            suit: hero.playerSuit,
            type: CardTypeRusNames.HeroPlayerCard,
        });
    }
    return hero;
};

/**
 * <h3>Добавляет карту героя в массив карт героев игрока или соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты героя игрока.</li>
 * <li>Происходит при добавлении карты героя соло бота.</li>
 * </ol>
 *
 * @param context
 * @param hero Карта героя.
 * @returns
 */
const AddHeroCardToPlayerHeroCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    hero: HeroCard): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло ботом` : `каким-то игроком`}.`);
    }
    hero.active = false;
    player.heroes.push(hero);
    if (G.expansions.Idavoll.active) {
        // TODO Add Odin ability not trigger this!!!!!!
        CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest }, ValkyryBuffNames.CountPickedHeroAmount);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === PlayerIdForSoloGameNames.SoloBotPlayerId ? `Соло бот` : `Игрок '${player.nickname}'`} выбрал героя '${hero.name}'.`);
};

/**
 * <h3>Действия, связанные с добавлением карты героя в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты героя, добавляющейся в массив карт игрока.</li>
 * </ol>
 *
 * @param context
 * @param hero Карта героя.
 * @returns Карта героя | карта героя на пол игрока.
 */
export const AddHeroToPlayerCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, hero: HeroCard):
    AllHeroCardType => {
    AddHeroCardToPlayerHeroCards({ G, ctx, myPlayerID, ...rest }, hero);
    AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, hero.buff);
    return CreateHeroPlayerCardIfAvailableFromHeroCardData(hero);
};

/**
 * <h3>Действия, связанные с добавлением героев в массив карт соло бота.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт соло бота.</li>
 * </ol>
 *
 * @param context
 * @param hero Карта героя.
 * @returns
 */
export const AddHeroForDifficultyToSoloBotCards = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    hero: HeroCard): void => {
    const soloBotPublicPlayer: CanBeUndefType<PublicPlayer> = G.publicPlayers[1],
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
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
