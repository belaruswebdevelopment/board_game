import { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import {
    ConfigNames,
    DrawNames,
    GetEnlistmentMercenariesAction,
    PassEnlistmentMercenariesAction,
    PlaceEnlistmentMercenariesAction
} from "../actions/Actions";
import { DrawProfitCampAction } from "../actions/CampActions";
import { isCardNotAction } from "../Card";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { DeckCardTypes, MyGameState, TavernCardTypes } from "../GameSetup";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AfterBasicPickCardActions } from "../helpers/MovesHelpers";
import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionFromStackAndAddNew,
    StartActionFromStackOrEndActions
} from "../helpers/StackHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { IsValidMove } from "../MoveValidator";
import { AddCardToPlayer, IStack } from "../Player";

// todo Add logging

/**
 * <h3>Перечисление для описаний отрисовки экшенов.</h3>
 */
export const enum MoveNames {
    AddCoinToPouchMove = `AddCoinToPouchMove`,
    BotsPlaceAllCoinsMove = `BotsPlaceAllCoinsMove`,
    ClickBoardCoinMove = `ClickBoardCoinMove`,
    ClickCampCardHoldaMove = `ClickCampCardHoldaMove`,
    ClickCampCardMove = `ClickCampCardMove`,
    ClickCardMove = `ClickCardMove`,
    ClickHandCoinMove = `ClickHandCoinMove`,
    DiscardCardFromPlayerBoardMove = `DiscardCardFromPlayerBoardMove`,
    DiscardCardMove = `DiscardCardMove`,
    DiscardCard2PlayersMove = `DiscardCard2PlayersMove`,
    DiscardSuitCardFromPlayerBoardMove = `DiscardSuitCardFromPlayerBoardMove`,
    GetEnlistmentMercenariesMove = `GetEnlistmentMercenariesMove`,
    GetMjollnirProfitMove = `GetMjollnirProfitMove`,
    PassEnlistmentMercenariesMove = `PassEnlistmentMercenariesMove`,
    PickDiscardCardMove = `PickDiscardCardMove`,
    PlaceCardMove = `PlaceCardMove`,
    PlaceEnlistmentMercenariesMove = `PlaceEnlistmentMercenariesMove`,
    StartEnlistmentMercenariesMove = `StartEnlistmentMercenariesMove`,
    UpgradeCoinVidofnirVedrfolnirMove = `UpgradeCoinVidofnirVedrfolnirMove`,
}

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
export const ClickCardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): string | void => {
    const isValidMove: boolean = IsValidMove({ objId: G.currentTavern, values: [G.currentTavern] })
        && IsValidMove({
            obj: G.taverns[G.currentTavern][cardId],
            objId: cardId,
            range: [0, G.taverns[G.currentTavern].length],
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const card: TavernCardTypes = G.taverns[G.currentTavern][cardId];
    let suit: null | string = null;
    G.taverns[G.currentTavern][cardId] = null;
    if (card !== null) {
        const isAdded: boolean = AddCardToPlayer(G, ctx, card);
        if (isCardNotAction(card)) {
            if (isAdded) {
                CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
                suit = card.suit;
            }
        } else {
            AddActionsToStack(G, ctx, card.stack);
        }
        if (G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            StartActionFromStackOrEndActions(G, ctx, false, suit);
        } else {
            AfterBasicPickCardActions(G, ctx, false);
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
export const ClickCardToPickDistinctionMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.decks[1][cardId]),
        pickedCard: DeckCardTypes = G.decks[1].splice(cardId, 1)[0];
    let suit: null | string = null;
    G.decks[1] = ctx.random!.Shuffle(G.decks[1]);
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suit = pickedCard.suit;
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suit);
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
 * @param cardId Id карты.
 * @returns
 */
export const ClickDistinctionCardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number):
    string | void => {
    const index: number = Object.values(G.distinctions).indexOf(Number(ctx.currentPlayer)),
        isValidMove: boolean = IsValidMove({ objId: cardId, values: [index] });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    suitsConfig[Object.keys(suitsConfig)[cardId]].distinction
        .awarding(G, ctx, G.publicPlayers[Number(ctx.currentPlayer)]);
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
export const GetEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    const stack: IStack[] = [
        {
            action: GetEnlistmentMercenariesAction.name,
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, cardId);
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
export const PassEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            action: PassEnlistmentMercenariesAction.name,
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack);
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
export const PickDiscardCardMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, cardId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], cardId);
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
export const PlaceEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, suit: string): void => {
    const stack: IStack[] = [
        {
            action: PlaceEnlistmentMercenariesAction.name,
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack, suit);
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
export const StartEnlistmentMercenariesMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            action: DrawProfitCampAction.name,
            config: {
                name: ConfigNames.EnlistmentMercenaries,
                drawName: DrawNames.EnlistmentMercenaries,
            },
        },
    ];
    EndActionFromStackAndAddNew(G, ctx, stack);
};
