import { heroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { CreateDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { ChangeBuffValue, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddHeroCardToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CreateHeroPlayerCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { BuffNames, CardNames, ErrorNames, GameNames, HeroNames, LogTypeNames, RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G, ctx, suit, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const discardedCard = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    player.pickedCard = discardedCard;
    DiscardPickedCard(G, discardedCard);
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
 * @param suit Название фракции дворфов.
 */
export const PlaceOlwinCardsAction = (G, ctx, suit) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const playerVariants = stack.variants;
    if (playerVariants === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр вариантов выкладки карты '${CardNames.OlwinsDouble}'.`);
    }
    // TODO Rework it!?
    const olwinDouble = CreateDwarfCard({
        suit,
        points: playerVariants[suit].points,
        name: CardNames.OlwinsDouble,
        game: GameNames.Thingvellir,
    });
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' добавил карту '${CardNames.OlwinsDouble}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddCardToPlayer(G, ctx, olwinDouble);
    if (((_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.suit) === undefined) {
        AddActionsToStack(G, ctx, [StackData.placeOlwinCards(suit, 3)]);
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
 * @param suit Название фракции дворфов.
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
    const heroCard = CreateHeroPlayerCard({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypeNames.Hero_Player_Card,
        name: HeroNames.Thrud,
        game: GameNames.Basic,
        description: heroesConfig.Thrud.description,
    });
    AddDataToLog(G, LogTypeNames.Game, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} добавил карту '${HeroNames.Thrud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
    ChangeBuffValue(G, ctx, BuffNames.MoveThrud, suit);
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
 * @param suit Название фракции дворфов.
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
    const heroCard = CreateHeroPlayerCard({
        suit,
        rank: playerVariants[suit].rank,
        points: playerVariants[suit].points,
        type: RusCardTypeNames.Hero_Player_Card,
        name: HeroNames.Ylud,
        game: GameNames.Basic,
        description: heroesConfig.Ylud.description,
    });
    AddDataToLog(G, LogTypeNames.Game, `${G.solo && ctx.currentPlayer === `1` ? `Соло бот` : `Текущий игрок`} '${player.nickname}' добавил карту '${HeroNames.Ylud}' во фракцию '${suitsConfig[suit].suitName}'.`);
    AddHeroCardToPlayerCards(G, ctx, heroCard);
    if (G.tierToEnd === 0) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.EndTier);
    }
};
//# sourceMappingURL=HeroActions.js.map