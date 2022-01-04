import { CampDeckCardTypes, PickedCardType } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { CoinType } from "./coin_types";
import { IHero } from "./hero_card_interfaces";
import { IBuffs, IPlayerCards, IStack } from "./interfaces";
import { IPriority } from "./priority_interfaces";

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    handCoins: ICoin[],
    boardCoins: ICoin[],
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
 * <h3>Интерфейс для объекта, хранящего скрытые (secret) данные всех игроков.</h3>
 */
export interface IPlayers {
    [index: number]: IPlayer,
}
