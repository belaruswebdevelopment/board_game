import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCardAction, PlaceEnlistmentMercenariesAction } from "../actions/Actions";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { PickCardOrActionCardActions } from "../helpers/CardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, LogTypeNames, RusCardTypeNames, StageNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Выбор карты из таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const ClickCardMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const currentTavern = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
    }
    const card = currentTavern[cardId];
    if (card === undefined) {
        throw new Error(`Отсутствует карта с id '${cardId}' текущей таверны с id '${G.currentTavern}'.`);
    }
    if (card === null) {
        throw new Error(`Не существует кликнутая карта с id '${cardId}'.`);
    }
    currentTavern.splice(cardId, 1, null);
    const isAdded = PickCardOrActionCardActions(G, ctx, card);
    // TODO Rework it!?
    if (isAdded && `suit` in card) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${card.type}' '${card.name}' во фракцию '${suitsConfig[card.suit].suitName}'.`);
    }
};
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const ClickCardToPickDistinctionMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickDistinctionCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const pickedCard = G.explorerDistinctionCards.splice(cardId, 1)[0];
    if (pickedCard === undefined) {
        throw new Error(`Отсутствует выбранная карта с id '${cardId}' эпохи '2'.`);
    }
    G.explorerDistinctionCards.splice(0);
    const isAdded = PickCardOrActionCardActions(G, ctx, pickedCard);
    if (isAdded && pickedCard.type === RusCardTypeNames.Dwarf_Card) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал карту '${pickedCard.type}' '${pickedCard.name}' во фракцию '${suitsConfig[pickedCard.suit].suitName}'.`);
        G.distinctions[SuitNames.Explorer] = undefined;
    }
    G.explorerDistinctionCardId = cardId;
};
/**
 * <h3>Выбор конкретного преимущества по фракциям в конце первой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После определения преимуществ по фракциям в конце первой эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Фракция.
 * @returns
 */
export const ClickDistinctionCardMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[suit].distinction.awarding(G, ctx, Number(ctx.currentPlayer));
};
/**
 * <h3>Убирает карту в колоду сброса в конце игры по выбору игрока при финальном действии артефакта Brisingamens.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при отправке карты в колоду сброса в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardCardFromPlayerBoardMove = (G, ctx, suit, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, {
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardAnyCardFromPlayerBoardAction(G, ctx, suit, cardId);
};
/**
 * <h3>Сбрасывает карту из таверны при выборе карты из лагеря на двоих игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из лагеря.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardCard2PlayersMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.DiscardCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardCardFromTavernAction(G, ctx, cardId);
};
/**
 * <h3>Выбор игроком карты наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе какую карту наёмника будет вербовать игрок.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const GetEnlistmentMercenariesMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default3, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    GetEnlistmentMercenariesAction(G, ctx, cardId);
};
/**
 * <h3>Выбирает фракцию для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const GetMjollnirProfitMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    GetMjollnirProfitAction(G, ctx, suit);
};
/**
 * <h3>Пасс первого игрока в начале фазы вербовки наёмников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников пасует для того, чтобы вербовать последним.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const PassEnlistmentMercenariesMove = (G, ctx) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default2);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PassEnlistmentMercenariesAction(G, ctx);
};
/**
 * <h3>Выбор карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт из колоды сброса по действию героев.</li>
 * <li>Выбор карт из колоды сброса по действию артефактов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const PickDiscardCardMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickDiscardCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickDiscardCardAction(G, ctx, cardId);
};
/**
 * <h3>Выбор фракции куда будет завербован наёмник.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе фракции, куда будет завербован наёмник.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceEnlistmentMercenariesMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.PlaceEnlistmentMercenaries, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceEnlistmentMercenariesAction(G, ctx, suit);
};
/**
 * <h3>Начало вербовки наёмников.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>Первый игрок в начале фазы вербовки наёмников выбирает старт вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartEnlistmentMercenariesMove = (G, ctx) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStack(G, ctx, [StackData.enlistmentMercenaries()]);
};
//# sourceMappingURL=Moves.js.map