import { INVALID_MOVE } from "boardgame.io/core";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { AddHeroToPlayerCardsAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot, PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { BidsDefaultStageNames, CoinTypeNames, MoveTypeNames, PlaceYludDefaultStageNames, SoloBotAndvariCommonStageNames, SuitNames, TavernsResolutionDefaultStageNames, TroopEvaluationStageNames } from "../typescript/enums";
// TODO Move all playerID === `1` to validate!
/**
 * <h3>Выбор карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotAndvariClickCardMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    const isValidMove = playerID === `1` &&
        IsValidMove({ G, ctx, playerID, ...rest }, TavernsResolutionDefaultStageNames.SoloBotClickCard, MoveTypeNames.default, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, playerID, ...rest }, cardId);
};
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotAndvariClickCardToPickDistinctionMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, TroopEvaluationStageNames.PickDistinctionCardSoloBotAndvari, MoveTypeNames.default, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction({ G, ctx, playerID, ...rest }, cardId);
};
/**
 * <h3>Выбор героя соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotAndvariClickHeroCardMove = ({ G, ctx, playerID, ...rest }, heroId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, SoloBotAndvariCommonStageNames.PickHeroSoloBotAndvari, MoveTypeNames.default, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction({ G, ctx, playerID, ...rest }, heroId);
};
/**
 * <h3>Выкладка монет соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotAndvariPlaceAllCoinsMove = ({ G, ctx, playerID, ...rest }, coinsOrder) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, BidsDefaultStageNames.SoloBotAndvariPlaceAllCoins, MoveTypeNames.default, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.tierToEnd === 2) {
        PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari({ G, ctx, playerID, ...rest });
    }
    else if (G.tierToEnd === 1) {
        PlaceAllCoinsInCurrentOrderForSoloBot({ G, ctx, playerID, ...rest });
    }
};
/**
 * <h3>Расположение героя на планшет соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Труд со способностью перемещения на планшете соло бота Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotAndvariPlaceThrudHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, SoloBotAndvariCommonStageNames.PlaceThrudHeroSoloBotAndvari, MoveTypeNames.default, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, playerID, ...rest }, suit);
};
/**
 * <h3>Расположение героя на планшет соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Илуд со способностью размещения на планшете соло бота Андвари в конце эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotAndvariPlaceYludHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, PlaceYludDefaultStageNames.SoloBotAndvariPlaceYludHero, MoveTypeNames.default, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, playerID, ...rest }, suit);
};
/**
 * <h3>Выбор монеты для улучшения соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const SoloBotAndvariClickCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, SoloBotAndvariCommonStageNames.UpgradeCoinSoloBotAndvari, MoveTypeNames.default, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, playerID, ...rest });
    UpgradeCoinActions({ G, ctx, playerID, ...rest }, coinId, type);
};
//# sourceMappingURL=SoloBotAndvariMoves.js.map