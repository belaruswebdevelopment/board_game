import { INVALID_MOVE } from "boardgame.io/core";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { AutoBotsMoveNames, BidsDefaultStageNames, CardMoveNames, CoinMoveNames, CoinTypeNames, EmptyCardMoveNames, PlaceYludDefaultStageNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonStageNames, SuitNames, TavernsResolutionDefaultStageNames, TroopEvaluationStageNames } from "../typescript/enums";
import type { CanBeVoidType, HeroesForSoloGameArrayType, IndexOf, InvalidMoveType, Move, MyFnContext } from "../typescript/interfaces";

// TODO Move all playerID === `1` to validate!
// TODO Add all solo bot moves!
/**
 * <h3>Выбор карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotClickCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TavernsResolutionDefaultStageNames.SoloBotAndvariClickCard,
            CardMoveNames.SoloBotClickCardMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};

/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotClickCardToPickDistinctionMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
            TroopEvaluationStageNames.SoloBotClickCardToPickDistinction,
            CardMoveNames.SoloBotClickCardToPickDistinctionMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};

/**
 * <h3>Выбор героя соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotClickHeroCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, heroId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotCommonStageNames.SoloBotClickHeroCard,
            CardMoveNames.SoloBotClickHeroCardMove, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    AddHeroCardToPlayerHeroCards({ G, ctx, myPlayerID: playerID, ...rest },
        G.heroesForSoloBot[heroId as IndexOf<HeroesForSoloGameArrayType>]);
};

/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param context
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotPlaceAllCoinsMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinsOrder: number[]):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidsDefaultStageNames.SoloBotPlaceAllCoins,
            AutoBotsMoveNames.SoloBotPlaceAllCoinsMove, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceAllCoinsInCurrentOrderForSoloBot({ G, ctx, myPlayerID: playerID, ...rest });
};

/**
 * <h3>Расположение героя на планшет соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Труд со способностью перемещения на планшете соло бота.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotPlaceThrudHeroMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotCommonStageNames.SoloBotClickHeroCard,
            EmptyCardMoveNames.SoloBotPlaceThrudHeroMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};

/**
 * <h3>Расположение героя на планшет соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Илуд со способностью размещения на планшете соло бота в конце эпохи.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotPlaceYludHeroMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, suit: SuitNames):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
            PlaceYludDefaultStageNames.SoloBotPlaceYludHero, EmptyCardMoveNames.SoloBotPlaceYludHeroMove,
            suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};

/**
 * <h3>Выбор монеты для улучшения соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const SoloBotClickCoinToUpgradeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
            SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade,
            CoinMoveNames.SoloBotClickCoinToUpgradeMove, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, myPlayerID: playerID, ...rest });
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
