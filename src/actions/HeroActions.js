import { CreateCard } from "../Card";
import { heroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddHeroCardToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { CreateHero } from "../Hero";
import { AddDataToLog } from "../Logging";
import { BuffNames, CardNames, GameNames, HeroNames, LogTypes, RusCardTypes } from "../typescript/enums";
/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G, ctx, suit, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const discardedCard = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    player.pickedCard = discardedCard;
    DiscardPickedCard(G, player, discardedCard);
    if (player.actionsNum === 2) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.discardCardFromBoardDagda()]);
    }
};
/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Ольвин на игровое поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceOlwinCardsAction = (G, ctx, suit) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const playerVariants = stack.variants;
    if (playerVariants === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр вариантов выкладки карты '${CardNames.OlwinsDouble}'.`);
    }
    const olwinDouble = CreateCard({
        suit,
        points: playerVariants[suit].points,
        name: CardNames.OlwinsDouble,
        game: GameNames.Thingvellir,
    });
    AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' добавил карту '${CardNames.OlwinsDouble}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddCardToPlayer(G, ctx, olwinDouble);
    if (player.actionsNum === 2) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.placeOlwinCards()]);
    }
    CheckAndMoveThrudAction(G, ctx, olwinDouble);
};
/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровое поле игрока.</li>
 * <li>При добавлении героя Труд на игровое поле соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceThrudAction = (G, ctx, suit) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${ctx.currentPlayer}'.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `текущего игрока`} с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const playerVariants = stack.variants;
    if (playerVariants === undefined) {
        throw new Error(`У конфига действия ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `текущего игрока`} с id '${ctx.currentPlayer}' отсутствует обязательный параметр вариантов выкладки карты '${HeroNames.Thrud}'.`);
    }
    const heroCard = CreateHero({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypes.HERO,
        name: HeroNames.Thrud,
        game: GameNames.Basic,
        description: heroesConfig.Thrud.description,
    });
    AddDataToLog(G, LogTypes.GAME, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} добавил карту '${HeroNames.Thrud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
};
/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceYludAction = (G, ctx, suit) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${ctx.currentPlayer}'.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `текущего игрока`} с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const playerVariants = stack.variants;
    if (playerVariants === undefined) {
        throw new Error(`У конфига действия ${G.solo && ctx.currentPlayer === `1` ? `соло бота` : `текущего игрока`} с id '${ctx.currentPlayer}' отсутствует обязательный параметр вариантов выкладки карты '${HeroNames.Ylud}'.`);
    }
    const heroCard = CreateHero({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypes.HERO,
        name: HeroNames.Ylud,
        game: GameNames.Basic,
        description: heroesConfig.Ylud.description,
    });
    AddDataToLog(G, LogTypes.GAME, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} '${player.nickname}' добавил карту '${HeroNames.Ylud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
    CheckAndMoveThrudAction(G, ctx, heroCard);
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.EndTier);
    }
};
//# sourceMappingURL=HeroActions.js.map