import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCard, PlaceEnlistmentMercenariesAction } from "../actions/Actions";
import { isCardNotActionAndNotNull } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages, SuitNames } from "../typescript/enums";
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
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card = G.taverns[G.currentTavern][cardId];
    G.taverns[G.currentTavern].splice(cardId, 1, null);
    if (card !== null) {
        const isAdded = AddCardToPlayer(G, ctx, card);
        if (!isCardNotActionAndNotNull(card)) {
            AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
        }
        else {
            if (isAdded) {
                CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
            }
        }
    }
    else {
        throw new Error(`Не существует кликнутая карта.`);
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
 */
export const ClickCardToPickDistinctionMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PickDistinctionCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const isAdded = AddCardToPlayer(G, ctx, G.decks[1][cardId]), pickedCard = G.decks[1].splice(cardId, 1)[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    G.decks[1] = ctx.random.Shuffle(G.decks[1]);
    if (isCardNotActionAndNotNull(pickedCard)) {
        if (isAdded) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
        }
    }
    else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack, pickedCard);
    }
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
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[suit].distinction.awarding(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)]);
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
 * @param suit Название фракции.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCardFromPlayerBoardMove = (G, ctx, suit, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, {
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardAnyCardFromPlayerBoardAction(G, ctx, suit, cardId);
};
/**
 * <h3>Сбрасывает карту из таверны при выборе карты из кэмпа на двоих игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCard2PlayersMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.DiscardCard, cardId);
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
 */
export const GetEnlistmentMercenariesMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default3, cardId);
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
 * @param suit Название фракции.
 */
export const GetMjollnirProfitMove = (G, ctx, suit) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1, suit);
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
 */
export const PassEnlistmentMercenariesMove = (G, ctx) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default2);
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
 */
export const PickDiscardCardMove = (G, ctx, cardId) => {
    const isValidMove = IsValidMove(G, ctx, Stages.PickDiscardCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickDiscardCard(G, ctx, cardId);
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
 * @param suit Название фракции.
 */
export const PlaceEnlistmentMercenariesMove = (G, ctx, suit) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default4, suit);
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
 */
export const StartEnlistmentMercenariesMove = (G, ctx) => {
    const isValidMove = IsValidMove(G, ctx, Stages.Default1);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
};
//# sourceMappingURL=Moves.js.map