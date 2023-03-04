import { INVALID_MOVE } from "boardgame.io/core";
import { IsValidMove } from "../MoveValidator";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { AddHeroToPlayerCardsAction, PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot, PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari } from "../helpers/SoloBotHelpers";
import { AssertExplorerDistinctionCardIdType, AssertPlayerCoinId, AssertTavernCardId } from "../is_helpers/AssertionTypeHelpers";
import { AutoBotsMoveNames, BidsDefaultStageNames, CardMoveNames, CoinMoveNames, EmptyCardMoveNames, PlaceYludDefaultStageNames, SoloBotAndvariCommonStageNames, TavernsResolutionDefaultStageNames, TroopEvaluationStageNames } from "../typescript/enums";
// TODO Move all playerID === `1` to validate!
/**
 * <h3>Выбор карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param tavernCardId Id карты.
 * @returns
 */
export const SoloBotAndvariClickCardMove = ({ G, ctx, playerID, ...rest }, tavernCardId) => {
    AssertTavernCardId(tavernCardId);
    const isValidMove = playerID === `1` &&
        IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TavernsResolutionDefaultStageNames.SoloBotClickCard, CardMoveNames.SoloBotAndvariClickCardMove, tavernCardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, myPlayerID: playerID, ...rest }, tavernCardId);
};
/**
 * <h3>Выбор базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const SoloBotAndvariClickCardToPickDistinctionMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    AssertExplorerDistinctionCardIdType(cardId);
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TroopEvaluationStageNames.SoloBotAndvariClickCardToPickDistinction, CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCardToPickDistinctionAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};
/**
 * <h3>Выбор героя соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotAndvariClickHeroCardMove = ({ G, ctx, playerID, ...rest }, heroId) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotAndvariCommonStageNames.SoloBotAndvariClickHeroCard, CardMoveNames.SoloBotAndvariClickHeroCardMove, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddHeroToPlayerCardsAction({ G, ctx, myPlayerID: playerID, ...rest }, heroId);
};
/**
 * <h3>Выкладка монет соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту Андвари нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param context
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotAndvariPlaceAllCoinsMove = ({ G, ctx, playerID, ...rest }, coinsOrder) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidsDefaultStageNames.SoloBotAndvariPlaceAllCoins, AutoBotsMoveNames.SoloBotAndvariPlaceAllCoinsMove, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.tierToEnd === 2) {
        PlaceAllCoinsInOrderWithZeroNotOnThePouchForSoloBotAndvari({ G, ctx, myPlayerID: playerID, ...rest });
    }
    else if (G.tierToEnd === 1) {
        PlaceAllCoinsInCurrentOrderForSoloBot({ G, ctx, myPlayerID: playerID, ...rest });
    }
};
// TODO suit: SuitNames => string and asserts it value if no other strings can be valid in moves!?
/**
 * <h3>Расположение героя на планшет соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Труд со способностью перемещения на планшете соло бота Андвари.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotAndvariPlaceThrudHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotAndvariCommonStageNames.SoloBotAndvariPlaceThrudHero, EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};
// TODO suit: SuitNames => string and asserts it value if no other strings can be valid in moves!?
/**
 * <h3>Расположение героя на планшет соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе героя Илуд со способностью размещения на планшете соло бота Андвари в конце эпохи.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const SoloBotAndvariPlaceYludHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, PlaceYludDefaultStageNames.SoloBotAndvariPlaceYludHero, EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};
// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
/**
 * <h3>Выбор монеты для улучшения соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const SoloBotAndvariClickCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    AssertPlayerCoinId(coinId);
    const isValidMove = playerID === `1`
        && IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotAndvariCommonStageNames.SoloBotAndvariClickCoinToUpgrade, CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, myPlayerID: playerID, ...rest });
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
//# sourceMappingURL=SoloBotAndvariMoves.js.map