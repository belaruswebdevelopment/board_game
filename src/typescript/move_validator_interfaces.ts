import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";
import { MoveValidatorGetRangeTypes, ValidMoveIdParamTypes } from "./move_validator_types";

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    readonly placeCoins: IMoveByPlaceCoinsOptions,
    readonly placeCoinsUline: IMoveByPlaceCoinsUlineOptions,
    readonly pickCards: IMoveByPickCardsOptions,
    readonly enlistmentMercenaries: IMoveByEnlistmentMercenariesOptions,
    readonly endTier: IMoveByEndTierOptions,
    readonly getDistinctions: IMoveByGetDistinctionsOptions,
    readonly brisingamensEndGame: IMoveByBrisingamensEndGameOptions,
    readonly getMjollnirProfit: IMoveByGetMjollnirProfitOptions,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    readonly default3: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPlaceCoinsUlineOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByPickCardsOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    readonly discardCard: IMoveValidator,
    readonly placeTradingCoinsUline: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEnlistmentMercenariesOptions {
    readonly default1: IMoveValidator,
    readonly default2: IMoveValidator,
    readonly default3: IMoveValidator,
    readonly default4: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByEndTierOptions {
    readonly default1: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetDistinctionsOptions {
    readonly default1: IMoveValidator,
    // start
    readonly addCoinToPouch: IMoveValidator,
    readonly discardBoardCard: IMoveValidator,
    readonly discardSuitCard: IMoveValidator,
    readonly pickCampCardHolda: IMoveValidator,
    readonly pickDiscardCard: IMoveValidator,
    readonly pickHero: IMoveValidator,
    readonly placeOlwinCards: IMoveValidator,
    readonly placeThrudHero: IMoveValidator,
    readonly upgradeCoin: IMoveValidator,
    readonly upgradeVidofnirVedrfolnirCoin: IMoveValidator,
    // end
    readonly pickDistinctionCard: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByBrisingamensEndGameOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
export interface IMoveByGetMjollnirProfitOptions {
    readonly default1: IMoveValidator,
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    readonly getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number) => MoveValidatorGetRangeTypes,
    readonly getValue: (G: IMyGameState, ctx: Ctx, moveRangeData: MoveValidatorGetRangeTypes) => ValidMoveIdParamTypes,
    readonly moveName: string,
    readonly validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    readonly BotsPlaceAllCoinsMoveValidator: IMoveValidator,
    readonly ClickBoardCoinMoveValidator: IMoveValidator,
    readonly ClickCampCardMoveValidator: IMoveValidator,
    readonly ClickCardMoveValidator: IMoveValidator,
    readonly ClickCardToPickDistinctionMoveValidator: IMoveValidator,
    readonly ClickDistinctionCardMoveValidator: IMoveValidator,
    readonly ClickHandCoinMoveValidator: IMoveValidator,
    readonly ClickHandCoinUlineMoveValidator: IMoveValidator,
    readonly ClickHandTradingCoinUlineMoveValidator: IMoveValidator,
    readonly DiscardCardFromPlayerBoardMoveValidator: IMoveValidator,
    readonly DiscardCard2PlayersMoveValidator: IMoveValidator,
    readonly GetEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly GetMjollnirProfitMoveValidator: IMoveValidator,
    readonly PassEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly PlaceEnlistmentMercenariesMoveValidator: IMoveValidator,
    readonly PlaceYludHeroMoveValidator: IMoveValidator,
    readonly StartEnlistmentMercenariesMoveValidator: IMoveValidator,
    // start
    readonly AddCoinToPouchMoveValidator: IMoveValidator,
    readonly ClickCampCardHoldaMoveValidator: IMoveValidator,
    readonly ClickCoinToUpgradeMoveValidator: IMoveValidator,
    readonly ClickHeroCardMoveValidator: IMoveValidator,
    readonly DiscardCardMoveValidator: IMoveValidator,
    readonly DiscardSuitCardFromPlayerBoardMoveValidator: IMoveValidator,
    readonly PickDiscardCardMoveValidator: IMoveValidator,
    readonly PlaceOlwinCardMoveValidator: IMoveValidator,
    readonly PlaceThrudHeroMoveValidator: IMoveValidator,
    readonly UpgradeCoinVidofnirVedrfolnirMoveValidator: IMoveValidator,
    // end
}
