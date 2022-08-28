import { INVALID_MOVE } from "boardgame.io/core";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { AddHeroToPlayerCardsAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot, PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari } from "../helpers/SoloBotHelpers";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, StageNames, SuitNames } from "../typescript/enums";
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
 */
export const SoloBotAndvariClickCardMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default3, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction(G, ctx, cardId);
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
 */
export const SoloBotAndvariClickCardToPickDistinctionMove = (G, ctx, cardId) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickDistinctionCardSoloBotAndvari, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction(G, ctx, cardId);
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
 */
export const SoloBotAndvariClickHeroCardMove = (G, ctx, heroId) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.pickHeroSoloBotAndvari, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction(G, ctx, heroId);
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
export const SoloBotAndvariPlaceAllCoinsMove = (G, ctx, coinsOrder) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default5, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.tierToEnd === 2) {
        PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari(G, ctx);
    }
    else if (G.tierToEnd === 1) {
        PlaceAllCoinsInCurrentOrderForSoloBot(G, ctx);
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
 */
export const SoloBotAndvariPlaceThrudHeroMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.placeThrudHero, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction(G, ctx, suit);
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
 */
export const SoloBotAndvariPlaceYludHeroMove = (G, ctx, suit) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.default3, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction(G, ctx, suit);
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
 */
export const SoloBotAndvariClickCoinToUpgradeMove = (G, ctx, coinId, type) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.upgradeCoin, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded(G);
    UpgradeCoinActions(G, ctx, coinId, type);
};
//# sourceMappingURL=SoloBotAndvariMoves.js.map