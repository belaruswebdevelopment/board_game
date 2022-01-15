import { IStack } from "./action_interfaces";
import { CampDeckCardTypes, PickedCardType } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { CoinType } from "./coin_types";
import { IHero } from "./hero_card_interfaces";
import { IPlayerCards } from "./interfaces";
import { IPriority } from "./priority_interfaces";

/**
 * <h3>Интерфейс для видов бафов у карт.</h3>
 */
interface IBuffs {
    // discardCardEndGame?: boolean,
    // endTier?: string,
    // everyTurn?: string,
    // getMjollnirProfit?: boolean,
    // goCamp?: boolean,
    // goCampOneTime?: boolean,
    // noHero?: boolean,
    // upgradeCoin?: number,
    // upgradeNextCoin?: string,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для создания публичных данных игрока.</h3>
 */
export interface ICreatePublicPlayer {
    nickname: string,
    cards: IPlayerCards,
    heroes?: IHero[],
    campCards?: CampDeckCardTypes[],
    handCoins: ICoin[],
    boardCoins: ICoin[],
    stack?: IStack[],
    priority: IPriority,
    buffs?: IBuffs,
    selectedCoin?: undefined,
    pickedCard?: null,
}

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    handCoins: ICoin[],
    boardCoins: ICoin[],
}

/**
 * <h3>Интерфейс для объекта, хранящего скрытые (secret) данные всех игроков.</h3>
 */
export interface IPlayers {
    [index: number]: IPlayer,
}

/**
 * <h3>Интерфейс для публичных данных игрока.</h3>
 */
export interface IPublicPlayer {
    nickname: string,
    cards: IPlayerCards,
    heroes: IHero[],
    campCards: CampDeckCardTypes[],
    handCoins: CoinType[],
    boardCoins: CoinType[],
    stack: IStack[],
    priority: IPriority,
    buffs: IBuffs,
    selectedCoin: undefined | number,
    pickedCard: PickedCardType,
}
