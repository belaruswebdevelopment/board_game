import { INVALID_MOVE } from "boardgame.io/core";
import { AddCoinToPouchAction, ChooseCoinValueForVidofnirVedrfolnirUpgradeAction, DiscardSuitCardAction, PickCampCardAction, UpgradeCoinVidofnirVedrfolnirAction } from "../actions/CampActions";
import { IsValidMove } from "../MoveValidator";
import { ButtonMoveNames, CardMoveNames, CoinMoveNames, CoinTypeNames, CommonStageNames, TavernsResolutionDefaultStageNames } from "../typescript/enums";
import type { BasicVidofnirVedrfolnirUpgradeValueType, CampCardArrayType, CanBeVoidType, IndexOf, InvalidMoveType, Move, MyFnContext } from "../typescript/interfaces";

/**
 * <h3>Выбор монеты для выкладки монет в кошель при наличии героя Улина по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const AddCoinToPouchMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.AddCoinToPouch, CoinMoveNames.AddCoinToPouchMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    AddCoinToPouchAction({ G, ctx, myPlayerID: playerID, ...rest }, coinId);
};

/**
 * <h3>Выбор значения улучшения монеты при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по конкретному значению обмена монеты.</li>
 * </ol>
 *
 * @param context
 * @param value Значение улучшения монеты.
 * @returns
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    value: BasicVidofnirVedrfolnirUpgradeValueType): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
        ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove, value);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    ChooseCoinValueForVidofnirVedrfolnirUpgradeAction({ G, ctx, myPlayerID: playerID, ...rest }, value);
};

/**
 * <h3>Выбор карты из лагеря по действию персонажа Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из лагеря по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id выбираемой карты из лагеря.
 * @returns
 */
export const ClickCampCardHoldaMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    cardId: IndexOf<CampCardArrayType>): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.ClickCampCardHolda, CardMoveNames.ClickCampCardHoldaMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCampCardAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};

/**
 * <h3>Выбор карты из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает при выборе карты из лагеря.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id выбираемой карты из лагеря.
 * @returns
 */
export const ClickCampCardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: IndexOf<CampCardArrayType>):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionDefaultStageNames.ClickCampCard, CardMoveNames.ClickCampCardMove, cardId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    PickCampCardAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};

/**
 * <h3>Сбрасывает карту конкретной фракции в колоду сброса по выбору игрока при действии артефакта Hofud.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты конкретной фракции в колоду сброса при взятии артефакта Hofud.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardFromPlayerBoardMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, cardId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.DiscardSuitCardFromPlayerBoard, CardMoveNames.DiscardSuitCardFromPlayerBoardMove,
        {
            cardId,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    DiscardSuitCardAction({ G, ctx, myPlayerID: playerID, ...rest }, cardId);
};

/**
 * <h3>Выбор монеты для улучшения по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const UpgradeCoinVidofnirVedrfolnirMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.UpgradeCoinVidofnirVedrfolnir, CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinVidofnirVedrfolnirAction({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
