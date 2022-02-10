import { IActionCardConfig } from "./action_card_interfaces";
import { ICard } from "./card_interfaces";
import { PlayerCardsType } from "./card_types";
import { ISuitConfig } from "./suit_interfaces";

export interface IAdditionalCardsConfig {
    // TODO Rework [name: string]?
    [index: string]: ICard,
}

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    readonly suits: ISuitConfig,
    readonly actions: IActionCardConfig[],
}

/**
 * <h3>Интерфейс для карт игрока.</h3>
 */
export interface IPlayerCards {
    // TODO Rework [name: string]?
    [index: string]: PlayerCardsType[],
}
