import { INVALID_MOVE } from "boardgame.io/core";
import { ClickCardAction, DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickCardToPickDistinctionAction, PickDiscardCardAction, PlaceEnlistmentMercenariesAction } from "../actions/Actions";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartDistinctionAwarding } from "../dispatchers/DistinctionAwardingDispatcher";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsValidMove } from "../MoveValidator";
import { BrisingamensEndGameDefaultStageNames, ButtonMoveNames, CardMoveNames, CommonStageNames, EmptyCardMoveNames, EnlistmentMercenariesDefaultStageNames, EnlistmentMercenariesStageNames, GetMjollnirProfitDefaultStageNames, SuitMoveNames, SuitNames, TavernsResolutionDefaultStageNames, TavernsResolutionStageNames, TroopEvaluationDefaultStageNames, TroopEvaluationStageNames } from "../typescript/enums";
import type { CanBeVoidType, InvalidMoveType, Move, MyFnContext } from "../typescript/interfaces";

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
export const ClickCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        TavernsResolutionDefaultStageNames.ClickCard, CardMoveNames.ClickCardMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, playerID, ...rest }, cardId);
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
export const ClickCardToPickDistinctionMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        TroopEvaluationStageNames.ClickCardToPickDistinction, CardMoveNames.ClickCardToPickDistinctionMove,
        cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction({ G, ctx, playerID, ...rest }, cardId);
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
export const ClickDistinctionCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        TroopEvaluationDefaultStageNames.ClickDistinctionCard, CardMoveNames.ClickDistinctionCardMove,
        suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    StartDistinctionAwarding({ G, ctx, playerID, ...rest }, suitsConfig[suit].distinction.awarding);
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
export const DiscardCardFromPlayerBoardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames,
    cardId: number): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        BrisingamensEndGameDefaultStageNames.DiscardCardFromPlayerBoard,
        CardMoveNames.DiscardCardFromPlayerBoardMove, {
        suit,
        cardId,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardAnyCardFromPlayerBoardAction({ G, ctx, playerID, ...rest }, suit, cardId);
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
export const DiscardCard2PlayersMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        TavernsResolutionStageNames.DiscardCard2Players, CardMoveNames.DiscardCard2PlayersMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardCardFromTavernAction({ G, ctx, playerID, ...rest }, cardId);
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
export const GetEnlistmentMercenariesMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        EnlistmentMercenariesDefaultStageNames.GetEnlistmentMercenaries,
        CardMoveNames.GetEnlistmentMercenariesMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    GetEnlistmentMercenariesAction({ G, ctx, playerID, ...rest }, cardId);
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
export const GetMjollnirProfitMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        GetMjollnirProfitDefaultStageNames.GetMjollnirProfit, SuitMoveNames.GetMjollnirProfitMove,
        suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    GetMjollnirProfitAction({ G, ctx, playerID, ...rest }, suit);
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
export const PassEnlistmentMercenariesMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        EnlistmentMercenariesDefaultStageNames.PassEnlistmentMercenaries,
        ButtonMoveNames.PassEnlistmentMercenariesMove, null);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PassEnlistmentMercenariesAction({ G, ctx, playerID, ...rest });
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
export const PickDiscardCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest }, CommonStageNames.PickDiscardCard,
        CardMoveNames.PickDiscardCardMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickDiscardCardAction({ G, ctx, playerID, ...rest }, cardId);
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
export const PlaceEnlistmentMercenariesMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
        EmptyCardMoveNames.PlaceEnlistmentMercenariesMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceEnlistmentMercenariesAction({ G, ctx, playerID, ...rest }, suit);
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
export const StartEnlistmentMercenariesMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, playerID, ...rest },
        EnlistmentMercenariesDefaultStageNames.StartEnlistmentMercenaries,
        ButtonMoveNames.StartEnlistmentMercenariesMove, null);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.enlistmentMercenaries()]);
};
