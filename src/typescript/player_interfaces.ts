import { IStack } from "./action_interfaces";
import { IBuffs } from "./buff_interfaces";
import { CampDeckCardTypes, PickedCardType } from "./card_types";
import { ICoin } from "./coin_interfaces";
import { CoinType } from "./coin_types";
import { IHero } from "./hero_card_interfaces";
import { IPlayerCards } from "./interfaces";
import { IPriority } from "./priority_interfaces";

/**
 * <h3>Интерфейс для создания публичных данных игрока.</h3>
 */
export interface ICreatePublicPlayer {
    readonly nickname: string,
    readonly cards: IPlayerCards,
    readonly heroes?: IHero[],
    readonly campCards?: CampDeckCardTypes[],
    readonly handCoins: ICoin[],
    readonly boardCoins: ICoin[],
    readonly stack?: IStack[],
    readonly priority: IPriority,
    readonly buffs?: IBuffs,
    readonly selectedCoin?: undefined,
    readonly pickedCard?: null,
}

/**
 * <h3>Интерфейс для приватных данных игрока.</h3>
 */
export interface IPlayer {
    readonly handCoins: ICoin[],
    readonly boardCoins: ICoin[],
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
    readonly nickname: string,
    readonly cards: IPlayerCards,
    readonly heroes: IHero[],
    readonly campCards: CampDeckCardTypes[],
    readonly handCoins: CoinType[],
    readonly boardCoins: CoinType[],
    stack: IStack[],
    priority: IPriority,
    buffs: IBuffs,
    selectedCoin: undefined | number,
    pickedCard: PickedCardType,
}
