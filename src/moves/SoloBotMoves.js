import { INVALID_MOVE } from "boardgame.io/core";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, StageNames, SuitNames } from "../typescript/enums";
// TODO Move all playerID === `1` to validate!
// TODO Add all solo bot moves!
/**
 * <h3>Выбор карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotClickCardMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.default4, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, playerID, ...rest }, cardId);
};
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotClickCardToPickDistinctionMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.pickDistinctionCardSoloBot, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction({ G, ctx, playerID, ...rest }, cardId);
};
/**
 * <h3>Выбор героя соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotClickHeroCardMove = ({ G, ctx, playerID, ...rest }, heroId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.pickHeroSoloBot, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    AddHeroCardToPlayerHeroCards({ G, ctx, playerID, ...rest }, G.heroesForSoloBot[heroId]);
};
/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotPlaceAllCoinsMove = ({ G, ctx, playerID, ...rest }, coinsOrder) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.default4, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceAllCoinsInCurrentOrderForSoloBot({ G, ctx, playerID, ...rest });
};
/**
 * <h3>Расположение героя на планшет соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Труд со способностью перемещения на планшете соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotPlaceThrudHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.placeThrudHeroSoloBot, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, playerID, ...rest }, suit);
};
/**
 * <h3>Расположение героя на планшет соло бота.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Илуд со способностью размещения на планшете соло бота в конце эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotPlaceYludHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.default2, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, playerID, ...rest }, suit);
};
/**
 * <h3>Выбор монеты для улучшения соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const SoloBotClickCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, playerID, ...rest }, StageNames.upgradeCoin, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, playerID, ...rest });
    UpgradeCoinActions({ G, ctx, playerID, ...rest }, coinId, type);
};
//# sourceMappingURL=SoloBotMoves.js.map