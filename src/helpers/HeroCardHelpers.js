import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { ErrorNames, GameModeNames, HeroNames, LogTypeNames, RusCardTypeNames, ValkyryBuffNames } from "../typescript/enums";
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
 * @param context
 * @param hero Герой.
 * @returns
 */
export const AddHeroCardToPlayerCards = ({ G, ctx, myPlayerID, ...rest }, hero) => {
    if (hero.suit !== null && hero.rank !== null) {
        const player = G.publicPlayers[Number(myPlayerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
        }
        const heroCard = CreateHeroPlayerCard({
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
            CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, heroCard);
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
 * @param context
 * @param hero Герой.
 * @returns
 */
export const AddHeroCardToPlayerHeroCards = ({ G, ctx, myPlayerID, ...rest }, hero) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `соло ботом` : `каким-то игроком`}.`);
    }
    hero.active = false;
    player.heroes.push(hero);
    if (G.expansions.Idavoll.active) {
        // TODO Add Odin ability not trigger this!!!!!!
        CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest }, ValkyryBuffNames.CountPickedHeroAmount);
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
 * @param context
 * @param hero Карта героя.
 * @returns
 */
export const AddHeroToPlayerCards = ({ G, ctx, myPlayerID, ...rest }, hero) => {
    AddHeroCardToPlayerHeroCards({ G, ctx, myPlayerID, ...rest }, hero);
    if (G.expansions.Idavoll.active) {
        if (`suit` in hero && hero.suit !== null) {
            if (CheckIfRecruitedCardHasNotLeastRankOfChosenClass({ G, ctx, myPlayerID, ...rest }, hero.suit)) {
                CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest }, ValkyryBuffNames.CountPickedCardClassRankAmount);
            }
        }
    }
    AddHeroCardToPlayerCards({ G, ctx, myPlayerID, ...rest }, hero);
    AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, hero.buff);
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
export const AddHeroForDifficultyToSoloBotCards = ({ G, ctx, myPlayerID, ...rest }, hero) => {
    const soloBotPublicPlayer = G.publicPlayers[1], player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
    }
    if (!hero.active) {
        throw new Error(`Не удалось добавить героя '${hero.name}' из-за того, что он был уже выбран каким-то игроком.`);
    }
    hero.active = false;
    soloBotPublicPlayer.heroes.push(hero);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' выбрал героя '${hero.name}' для соло бота.`);
};
//# sourceMappingURL=HeroCardHelpers.js.map