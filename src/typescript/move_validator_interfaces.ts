import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";
import { MoveValidatorGetRangeTypes, ValidMoveIdParamTypes } from "./move_validator_types";

/**
 * <h3>Интерфейс для проверки параметров валидатора мувов.</h3>
 */
export interface ICheckMoveParam {
    obj?: object | null,
    objId: number,
    range?: number[],
    values?: number[],
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    placeCoins: IMoveByPlaceCoinsOptions,
    placeCoinsUline: IMoveByPlaceCoinsUlineOptions,
    pickCards: IMoveByPickCardsOptions,
    enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions,
    endTier: IMoveByEndTierOptions,
    getDistinctions: IMoveByGetDistinctionsOptions,
    brisingamensEndGame: IMoveByBrisingamensEndGameOptions,
    getMjollnirProfit: IMoveByGetMjollnirProfitOptions,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsOptions {
    default1: IMoveValidator,
    default2: IMoveValidator,
    default3: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsUlineOptions {
    default1: IMoveValidator,
    default2: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPickCardsOptions {
    default1: IMoveValidator,
    default2: IMoveValidator,
    // start
    addCoinToPouch: IMoveValidator,
    discardBoardCard: IMoveValidator,
    discardSuitCard: IMoveValidator,
    pickCampCardHolda: IMoveValidator,
    pickDiscardCard: IMoveValidator,
    pickHero: IMoveValidator,
    placeCards: IMoveValidator,
    upgradeCoin: IMoveValidator,
    upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    discardCard: IMoveValidator,
    // TODO Fix it!
    placeTradingCoinsUline: IMoveValidator,
    // placeTradingCoinsUline: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions {
    default1: IMoveValidator,
    default2: IMoveValidator,
    default3: IMoveValidator,
    default4: IMoveValidator,
    // start
    addCoinToPouch: IMoveValidator,
    discardBoardCard: IMoveValidator,
    discardSuitCard: IMoveValidator,
    pickCampCardHolda: IMoveValidator,
    pickDiscardCard: IMoveValidator,
    pickHero: IMoveValidator,
    placeCards: IMoveValidator,
    upgradeCoin: IMoveValidator,
    upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEndTierOptions {
    default1: IMoveValidator,
    // start
    addCoinToPouch: IMoveValidator,
    discardBoardCard: IMoveValidator,
    discardSuitCard: IMoveValidator,
    pickCampCardHolda: IMoveValidator,
    pickDiscardCard: IMoveValidator,
    pickHero: IMoveValidator,
    placeCards: IMoveValidator,
    upgradeCoin: IMoveValidator,
    upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetDistinctionsOptions {
    default1: IMoveValidator,
    // start
    addCoinToPouch: IMoveValidator,
    discardBoardCard: IMoveValidator,
    discardSuitCard: IMoveValidator,
    pickCampCardHolda: IMoveValidator,
    pickDiscardCard: IMoveValidator,
    pickHero: IMoveValidator,
    placeCards: IMoveValidator,
    upgradeCoin: IMoveValidator,
    upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    pickDistinctionCard: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBrisingamensEndGameOptions {
    default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetMjollnirProfitOptions {
    default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number) => MoveValidatorGetRangeTypes,
    getValue: (G: IMyGameState, ctx: Ctx, moveRangeData: MoveValidatorGetRangeTypes) => ValidMoveIdParamTypes,
    moveName: string,
    validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    BotsPlaceAllCoinsMoveValidator: IMoveValidator,
    ClickBoardCoinMoveValidator: IMoveValidator,
    ClickCampCardMoveValidator: IMoveValidator,
    ClickCardMoveValidator: IMoveValidator,
    ClickCardToPickDistinctionMoveValidator: IMoveValidator,
    ClickDistinctionCardMoveValidator: IMoveValidator,
    ClickHandCoinMoveValidator: IMoveValidator,
    DiscardCardFromPlayerBoardMoveValidator: IMoveValidator,
    DiscardCard2PlayersMoveValidator: IMoveValidator,
    GetEnlistmentMercenariesMoveValidator: IMoveValidator,
    GetMjollnirProfitMoveValidator: IMoveValidator,
    PassEnlistmentMercenariesMoveValidator: IMoveValidator,
    PlaceEnlistmentMercenariesMoveValidator: IMoveValidator,
    StartEnlistmentMercenariesMoveValidator: IMoveValidator,
    AddCoinToPouchMoveValidator: IMoveValidator,
    ClickCampCardHoldaMoveValidator: IMoveValidator,
    ClickCoinToUpgradeMoveValidator: IMoveValidator,
    ClickHeroCardMoveValidator: IMoveValidator,
    DiscardCardMoveValidator: IMoveValidator,
    DiscardSuitCardFromPlayerBoardMoveValidator: IMoveValidator,
    PickDiscardCardMoveValidator: IMoveValidator,
    PlaceCardMoveValidator: IMoveValidator,
    UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator,
}
