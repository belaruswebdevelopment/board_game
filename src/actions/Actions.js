import { CreateMercenaryPlayerCard, IsMercenaryCampCard } from "../Camp";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { IsDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer, PickCardOrActionCardActions } from "../helpers/CardHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { DiscardConcreteCardFromTavern } from "../Tavern";
import { ArtefactNames, BuffNames, ErrorNames, LogTypeNames, PhaseNames, RusCardTypeNames, RusSuitNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с отправкой любой указанной карты со стола игрока в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при отправке карты в колоду сброса в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 */
export const DiscardAnyCardFromPlayerBoardAction = (G, ctx, suit, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const discardedCard = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта во фракции '${RusSuitNames[suit]}' с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    DiscardPickedCard(G, discardedCard);
    DeleteBuffFromPlayer(G, ctx, BuffNames.DiscardCardEndGame);
};
/**
 * <h3>Сбрасывает карту из таверны в колоду сброса по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется после выбора первым игроком карты из лагеря при игре на двух игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G, ctx, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' должен сбросить в колоду сброса карту из текущей таверны:`);
    const isCardDiscarded = DiscardConcreteCardFromTavern(G, ctx, cardId);
    if (!isCardDiscarded) {
        throw new Error(`Не удалось сбросить карту с id '${cardId}' из текущей таверны с id '${G.currentTavern}'.`);
    }
    if (ctx.numPlayers === 2) {
        G.tavernCardDiscarded2Players = true;
    }
};
/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const GetEnlistmentMercenariesAction = (G, ctx, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const pickedCard = player.campCards[cardId];
    if (pickedCard === undefined) {
        throw new Error(`В массиве карт лагеря игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    if (!IsMercenaryCampCard(pickedCard)) {
        throw new Error(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
    }
    AddActionsToStack(G, ctx, [StackData.placeEnlistmentMercenaries(pickedCard)]);
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' во время фазы '${ctx.phase}' выбрал наёмника '${pickedCard.name}'.`);
};
/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 */
export const GetMjollnirProfitAction = (G, ctx, suit) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    AddBuffToPlayer(G, ctx, {
        name: BuffNames.SuitIdForMjollnir,
    }, suit);
    DeleteBuffFromPlayer(G, ctx, BuffNames.GetMjollnirProfit);
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал фракцию '${suitsConfig[suit].suitName}' для эффекта артефакта '${ArtefactNames.Mjollnir}'.`);
};
/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PassEnlistmentMercenariesAction = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' пасанул во время фазы '${ctx.phase}'.`);
};
/**
 * <h3>Действия, связанные с взятием карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из колоды сброса.</li>
 * <li>При выборе конкретных карт лагеря, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const PickDiscardCardAction = (G, ctx, cardId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const card = G.discardCardsDeck.splice(cardId, 1)[0];
    if (card === undefined) {
        throw new Error(`В массиве колоды сброса отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' взял карту '${card.name}' из колоды сброса.`);
    const isAdded = PickCardOrActionCardActions(G, ctx, card);
    if (isAdded && IsDwarfCard(card)) {
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
    }
};
/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 */
export const PlaceEnlistmentMercenariesAction = (G, ctx, suit) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const mercenaryCard = stack.card;
    if (mercenaryCard === undefined) {
        throw new Error(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${suit}'.`);
    }
    const cardVariants = mercenaryCard.variants[suit];
    if (cardVariants === undefined) {
        throw new Error(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${suit}'.`);
    }
    const mercenaryPlayerCard = CreateMercenaryPlayerCard({
        suit,
        points: cardVariants.points,
        name: mercenaryCard.name,
        path: mercenaryCard.path,
    }), isAdded = AddCardToPlayer(G, ctx, mercenaryPlayerCard), cardIndex = player.campCards.findIndex((card) => card.name === mercenaryCard.name);
    if (cardIndex === -1) {
        throw new Error(`У игрока с id '${ctx.currentPlayer}' в массиве карт лагеря отсутствует выбранная карта.`);
    }
    player.campCards.splice(cardIndex, 1);
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал карту '${mercenaryPlayerCard.type}' '${mercenaryPlayerCard.name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    if (isAdded) {
        CheckAndMoveThrudAction(G, ctx, mercenaryPlayerCard);
    }
};
//# sourceMappingURL=Actions.js.map