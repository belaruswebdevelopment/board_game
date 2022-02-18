import { CampDeckCardTypes } from "../typescript_types/camp_card_types";
import { PickedCardType } from "../typescript_types/card_types";
import { CoinType } from "../typescript_types/coin_types";
import { IStack } from "./action_interfaces";
import { IBuffs } from "./player_buff_interfaces";
import { ICoin } from "./coin_interfaces";
import { IHeroCard } from "./hero_card_interfaces";
import { IPlayerCards } from "./interfaces";
import { IPriority } from "./priority_interfaces";

/**
 * <h3>Интерфейс для создания публичных данных игрока.</h3>
 */
export interface ICreatePublicPlayer {
    readonly actionsNum?: number,
    readonly nickname: string,
    readonly cards: IPlayerCards,
    readonly heroes?: IHeroCard[],
    readonly campCards?: CampDeckCardTypes[],
    readonly handCoins: ICoin[],
    readonly boardCoins: ICoin[],
    readonly stack?: IStack[],
    readonly priority: IPriority,
    readonly buffs?: IBuffs[],
    readonly selectedCoin?: undefined | number,
    readonly pickedCard?: PickedCardType,
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
    actionsNum: number,
    readonly nickname: string,
    readonly cards: IPlayerCards,
    readonly heroes: IHeroCard[],
    readonly campCards: CampDeckCardTypes[],
    readonly handCoins: CoinType[],
    readonly boardCoins: CoinType[],
    stack: IStack[],
    priority: IPriority,
    readonly buffs: IBuffs[],
    selectedCoin: undefined | number,
    pickedCard: PickedCardType,
}
