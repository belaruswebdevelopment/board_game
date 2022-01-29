import { IActionCardConfig } from "./action_card_intarfaces";
import { PlayerCardsType } from "./card_types";
import { ISuitConfig } from "./suit_interfaces";

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    suits: ISuitConfig,
    actions: IActionCardConfig[],
}

/**
 * <h3>Интерфейс для карт игрока.</h3>
 */
export interface IPlayerCards {
    [index: string]: PlayerCardsType[],
}