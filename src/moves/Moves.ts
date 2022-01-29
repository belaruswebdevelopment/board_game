import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCard, PlaceEnlistmentMercenariesAction } from "../actions/Actions";
import { isCardNotAction } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { DeckCardTypes, TavernCardTypes } from "../typescript/card_types";
import { LogTypes, Stages, SuitNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";

// TODO Add logging
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
export const ClickCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card: TavernCardTypes = G.taverns[G.currentTavern][cardId];
    G.taverns[G.currentTavern][cardId] = null;
    if (card !== null) {
        const isAdded: boolean = AddCardToPlayer(G, ctx, card);
        if (!isCardNotAction(card)) {
            AddActionsToStackAfterCurrent(G, ctx, card.stack);
        } else {
            if (isAdded) {
                CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
            }
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не существует кликнутая карта.`);
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
export const ClickCardToPickDistinctionMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.PickDistinctionCard, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.decks[1][cardId]),
        pickedCard: DeckCardTypes = G.decks[1].splice(cardId, 1)[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    G.decks[1] = ctx.random!.Shuffle(G.decks[1]);
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
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
export const ClickDistinctionCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[suit].distinction.awarding(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)]);
};


/**
 * <h3>Сбрасывает карту в дискард в конце игры по выбору игрока при финальном действии артефакта Brisingamens.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardCardFromPlayerBoardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string,
    cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1, {
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
export const DiscardCard2PlayersMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.DiscardCard, cardId);
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
export const GetEnlistmentMercenariesMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default3, cardId);
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
export const GetMjollnirProfitMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1, suit);
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
export const PassEnlistmentMercenariesMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default2);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PassEnlistmentMercenariesAction(G, ctx);
};

/**
 * <h3>Выбор карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт из дискарда по действию героев.</li>
 * <li>Выбор карт из дискарда по действию артефактов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const PickDiscardCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.PickDiscardCard, cardId);
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
export const PlaceEnlistmentMercenariesMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, suit: string):
    string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default4, suit);
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
export const StartEnlistmentMercenariesMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx): string | void => {
    const isValidMove: boolean = IsValidMove(G, ctx, Stages.Default1);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
};
