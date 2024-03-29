import { INVALID_MOVE } from "boardgame.io/core";
import { IsValidMove } from "../MoveValidator";
import { ClickCardAction, PickCardToPickDistinctionAction } from "../actions/Actions";
import { PlaceThrudAction, PlaceYludAction } from "../actions/HeroActions";
import { AddAnyCardToPlayerActions } from "../helpers/CardHelpers";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { PlaceAllCoinsInCurrentOrderForSoloBot } from "../helpers/SoloBotHelpers";
import { AssertAllHeroesForSoloBotPossibleCardId, AssertExplorerDistinctionCardIdType, AssertPlayerCoinId, AssertTavernCardId } from "../is_helpers/AssertionTypeHelpers";
import { AutoBotsMoveNames, BidsDefaultStageNames, CardMoveNames, CoinMoveNames, EmptyCardMoveNames, PlaceYludDefaultStageNames, SoloBotCommonCoinUpgradeStageNames, SoloBotCommonStageNames, TavernsResolutionDefaultStageNames, TroopEvaluationStageNames } from "../typescript/enums";
// TODO Add all solo bot moves!
/**
 * <h3>Выбор карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param tavernCardId Id карты.
 * @returns
 */
export const SoloBotClickCardMove = ({ G, ctx, playerID, ...rest }, tavernCardId) => {
    AssertTavernCardId(tavernCardId);
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TavernsResolutionDefaultStageNames.SoloBotAndvariClickCard, CardMoveNames.SoloBotClickCardMove, tavernCardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ClickCardAction({ G, ctx, myPlayerID: playerID, ...rest }, tavernCardId);
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
export const SoloBotClickCardToPickDistinctionMove = ({ G, ctx, playerID, ...rest }, cardId) => {
    AssertExplorerDistinctionCardIdType(cardId);
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TroopEvaluationStageNames.SoloBotClickCardToPickDistinction, CardMoveNames.SoloBotClickCardToPickDistinctionMove, cardId);
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
export const SoloBotClickHeroCardMove = ({ G, ctx, playerID, ...rest }, heroId) => {
    AssertAllHeroesForSoloBotPossibleCardId(heroId);
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotCommonStageNames.SoloBotClickHeroCard, CardMoveNames.SoloBotClickHeroCardMove, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (G.heroesForSoloBot === null) {
        throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
    }
    const hero = G.heroesForSoloBot[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя для соло бота с id '${heroId}'.`);
    }
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID: playerID, ...rest }, hero);
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
export const SoloBotPlaceAllCoinsMove = ({ G, ctx, playerID, ...rest }, coinsOrder) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidsDefaultStageNames.SoloBotPlaceAllCoins, AutoBotsMoveNames.SoloBotPlaceAllCoinsMove, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceAllCoinsInCurrentOrderForSoloBot({ G, ctx, myPlayerID: playerID, ...rest });
};
// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
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
export const SoloBotPlaceThrudHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotCommonStageNames.SoloBotClickHeroCard, EmptyCardMoveNames.SoloBotPlaceThrudHeroMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceThrudAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};
// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
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
export const SoloBotPlaceYludHeroMove = ({ G, ctx, playerID, ...rest }, suit) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, PlaceYludDefaultStageNames.SoloBotPlaceYludHero, EmptyCardMoveNames.SoloBotPlaceYludHeroMove, suit);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PlaceYludAction({ G, ctx, myPlayerID: playerID, ...rest }, suit);
};
// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
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
export const SoloBotClickCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    AssertPlayerCoinId(coinId);
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, SoloBotCommonCoinUpgradeStageNames.SoloBotClickCoinToUpgrade, CoinMoveNames.SoloBotClickCoinToUpgradeMove, {
        coinId,
        type,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, myPlayerID: playerID, ...rest });
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
//# sourceMappingURL=SoloBotMoves.js.map